import {
  BLUR_STRENGTHS,
  BIRTH_YEARS,
  INTEREST_STEPS,
  MBTI_TYPES,
  ONBOARDING_STEPS,
} from '@/pages/onboarding/constants/constants';
import type {
  OnboardingStep,
  SelectedInterests,
} from '@/pages/onboarding/constants/constants';
import {createInitialPhotoSlots} from '@/pages/onboarding/hooks/usePhotoUploadSlots';
import type {PhotoSlot} from '@/pages/onboarding/hooks/usePhotoUploadSlots';
import {createInitialOnboardingDraft} from '@/pages/onboarding/model/onboarding-draft';
import type {OnboardingDraft} from '@/pages/onboarding/model/onboarding-draft';

const DRAFT_VERSION = 1;
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const DB_NAME = 'blursome-onboarding';
const PHOTO_STORE = 'photos';

interface StoredDraft extends Omit<OnboardingDraft, 'photoSlots'> {
  version: number;
  updatedAt: number;
  photoCount: number;
  photoSlotIds: string[];
}

interface StoredPhotos {
  memberId: number;
  files: Array<{id: string; file: File}>;
}

const photoWrites = new Map<number, Promise<void>>();

const getStorageKey = (memberId: number) =>
  `onboarding-draft:v${DRAFT_VERSION}:${memberId}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStoredDraft = (value: unknown): value is StoredDraft => {
  if (!isRecord(value) || !isRecord(value.selectedInterests)) {
    return false;
  }

  const slotIds = createInitialPhotoSlots().map((slot) => slot.id);
  const interestsAreValid = Object.entries(value.selectedInterests).every(
    ([step, items]) =>
      INTEREST_STEPS.includes(step as (typeof INTEREST_STEPS)[number]) &&
      Array.isArray(items) &&
      items.every((item) => typeof item === 'string')
  );

  return (
    value.version === DRAFT_VERSION &&
    typeof value.updatedAt === 'number' &&
    Number.isFinite(value.updatedAt) &&
    ONBOARDING_STEPS.includes(value.step as OnboardingStep) &&
    typeof value.nickname === 'string' &&
    (value.selectedGender === null ||
      value.selectedGender === 'male' ||
      value.selectedGender === 'female') &&
    BIRTH_YEARS.includes(value.birthYear as number) &&
    typeof value.department === 'string' &&
    (value.selectedMbti === null ||
      MBTI_TYPES.includes(value.selectedMbti as (typeof MBTI_TYPES)[number])) &&
    BLUR_STRENGTHS.includes(
      value.blurStrength as (typeof BLUR_STRENGTHS)[number]
    ) &&
    interestsAreValid &&
    Number.isInteger(value.photoCount) &&
    (value.photoCount as number) >= 0 &&
    (value.photoCount as number) <= slotIds.length &&
    Array.isArray(value.photoSlotIds) &&
    value.photoSlotIds.length === slotIds.length &&
    new Set(value.photoSlotIds).size === slotIds.length &&
    value.photoSlotIds.every((id) => slotIds.includes(id))
  );
};

export const parseStoredOnboardingDraft = (
  rawDraft: string,
  now = Date.now()
): StoredDraft | null => {
  try {
    const storedDraft: unknown = JSON.parse(rawDraft);

    if (
      !isStoredDraft(storedDraft) ||
      storedDraft.updatedAt > now ||
      now - storedDraft.updatedAt >= DRAFT_TTL_MS
    ) {
      return null;
    }

    return storedDraft;
  } catch {
    return null;
  }
};

const getResumableStep = (
  step: OnboardingStep
): Exclude<OnboardingStep, 'complete'> =>
  step === 'complete' ? 'photoUpload' : step;

export const getOnboardingDraftStep = (memberId: number) => {
  try {
    const rawDraft = localStorage.getItem(getStorageKey(memberId));
    if (!rawDraft) return null;

    const storedDraft = parseStoredOnboardingDraft(rawDraft);
    return storedDraft ? getResumableStep(storedDraft.step) : null;
  } catch {
    return null;
  }
};

const openPhotoDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(PHOTO_STORE, {keyPath: 'memberId'});
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const readPhotos = async (
  memberId: number
): Promise<StoredPhotos | undefined> => {
  await photoWrites.get(memberId)?.catch(() => undefined);
  const db = await openPhotoDb();

  try {
    return await new Promise<StoredPhotos | undefined>((resolve, reject) => {
      const request = db
        .transaction(PHOTO_STORE, 'readonly')
        .objectStore(PHOTO_STORE)
        .get(memberId);

      request.onsuccess = () =>
        resolve(request.result as StoredPhotos | undefined);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
};

const writePhotos = async (memberId: number, photoSlots: PhotoSlot[]) => {
  const db = await openPhotoDb();
  const files = photoSlots.flatMap(({id, file}) => (file ? [{id, file}] : []));

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE, 'readwrite');

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
      transaction.objectStore(PHOTO_STORE).put({memberId, files});
    });
  } finally {
    db.close();
  }
};

const deletePhotos = async (memberId: number) => {
  await photoWrites.get(memberId)?.catch(() => undefined);
  const db = await openPhotoDb();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE, 'readwrite');

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
      transaction.objectStore(PHOTO_STORE).delete(memberId);
    });
  } finally {
    db.close();
  }
};

export const clearOnboardingDraft = async (memberId: number) => {
  try {
    localStorage.removeItem(getStorageKey(memberId));
  } finally {
    await deletePhotos(memberId);
  }
};

export const loadOnboardingDraft = async (
  memberId: number
): Promise<{draft: OnboardingDraft | null; photosUnavailable: boolean}> => {
  const rawDraft = localStorage.getItem(getStorageKey(memberId));

  if (!rawDraft) {
    return {draft: null, photosUnavailable: false};
  }

  const storedDraft = parseStoredOnboardingDraft(rawDraft);

  if (!storedDraft) {
    try {
      await clearOnboardingDraft(memberId);
    } catch {
      localStorage.removeItem(getStorageKey(memberId));
    }
    return {draft: null, photosUnavailable: false};
  }

  let storedPhotos: StoredPhotos | undefined;
  let photosUnavailable = false;

  if (storedDraft.photoCount > 0) {
    try {
      storedPhotos = await readPhotos(memberId);
      if (storedPhotos && !Array.isArray(storedPhotos.files)) {
        storedPhotos = undefined;
        photosUnavailable = true;
      }
    } catch {
      photosUnavailable = true;
    }
  }
  const validFiles = storedPhotos?.files.filter(
    ({id, file}) => typeof id === 'string' && file instanceof File
  );
  if ((validFiles?.length ?? 0) < storedDraft.photoCount) {
    photosUnavailable = true;
  }
  const filesById = new Map(validFiles?.map(({id, file}) => [id, file]));
  const slotsById = new Map(
    createInitialPhotoSlots().map((slot) => [slot.id, slot])
  );
  const photoSlots = storedDraft.photoSlotIds.map((id) => ({
    ...slotsById.get(id)!,
    file: filesById.get(id) ?? null,
  }));

  const draft: OnboardingDraft = {
    ...createInitialOnboardingDraft(),
    step: getResumableStep(storedDraft.step),
    nickname: storedDraft.nickname,
    selectedGender: storedDraft.selectedGender,
    birthYear: storedDraft.birthYear,
    department: storedDraft.department,
    selectedMbti: storedDraft.selectedMbti,
    selectedInterests: storedDraft.selectedInterests as SelectedInterests,
    blurStrength: storedDraft.blurStrength,
    photoSlots,
  };

  return {draft, photosUnavailable};
};

export const saveOnboardingDraft = (
  memberId: number,
  draft: OnboardingDraft
) => {
  const {photoSlots, ...fields} = draft;
  const storedDraft: StoredDraft = {
    ...fields,
    version: DRAFT_VERSION,
    updatedAt: Date.now(),
    photoCount: photoSlots.filter((slot) => slot.file).length,
    photoSlotIds: photoSlots.map(({id}) => id),
  };

  localStorage.setItem(getStorageKey(memberId), JSON.stringify(storedDraft));
};

export const saveOnboardingPhotos = (
  memberId: number,
  photoSlots: PhotoSlot[]
) => {
  const pendingWrite = photoWrites.get(memberId) ?? Promise.resolve();
  const nextWrite = pendingWrite
    .catch(() => undefined)
    .then(() => writePhotos(memberId, photoSlots));

  photoWrites.set(memberId, nextWrite);
  void nextWrite.then(
    () => {
      if (photoWrites.get(memberId) === nextWrite) photoWrites.delete(memberId);
    },
    () => {
      if (photoWrites.get(memberId) === nextWrite) photoWrites.delete(memberId);
    }
  );

  return nextWrite;
};
