import {useEffect, useRef, useState} from 'react';

import {arrayMove} from '@dnd-kit/helpers';
import type {DragEndEvent} from '@dnd-kit/react';
import {isSortableOperation} from '@dnd-kit/react/sortable';

import {MAX_INTEREST_COUNT} from '@/pages/onboarding/constants/constants';
import type {
  InterestItem,
  InterestStep,
} from '@/pages/onboarding/constants/constants';
import {createInitialOnboardingDraft} from '@/pages/onboarding/model/onboarding-draft';
import type {OnboardingDraft} from '@/pages/onboarding/model/onboarding-draft';
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
  saveOnboardingPhotos,
} from '@/pages/onboarding/model/onboarding-draft-storage';

export const useOnboardingDraft = (memberId: number | undefined) => {
  const [draft, setDraft] = useState(createInitialOnboardingDraft);
  const [hydratedMemberId, setHydratedMemberId] = useState<number | null>(null);
  const [restoreErrorMemberId, setRestoreErrorMemberId] = useState<
    number | null
  >(null);
  const [metadataSaveError, setMetadataSaveError] = useState(false);
  const [photoSaveError, setPhotoSaveError] = useState(false);
  const [photoRestoreError, setPhotoRestoreError] = useState(false);
  const [restoreAttempt, setRestoreAttempt] = useState(0);
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const lastSavedDraftRef = useRef<OnboardingDraft | null>(null);
  const lastSavedPhotoSlotsRef = useRef<OnboardingDraft['photoSlots'] | null>(
    null
  );

  useEffect(() => {
    if (memberId === undefined) return;

    let cancelled = false;

    const restore = async () => {
      try {
        const {draft: storedDraft, photosUnavailable} =
          await loadOnboardingDraft(memberId);

        if (cancelled) return;

        const restoredDraft = storedDraft ?? createInitialOnboardingDraft();
        const photoSlots = restoredDraft.photoSlots.map((slot) => {
          if (!slot.file) return slot;

          const previewUrl = URL.createObjectURL(slot.file);
          previewUrlsRef.current.add(previewUrl);
          return {...slot, previewUrl};
        });
        const nextDraft = {...restoredDraft, photoSlots};

        lastSavedDraftRef.current = nextDraft;
        lastSavedPhotoSlotsRef.current = photoSlots;
        setDraft(nextDraft);
        setRestoreErrorMemberId(null);
        setPhotoRestoreError(photosUnavailable);
        setHydratedMemberId(memberId);
      } catch {
        if (!cancelled) {
          setRestoreErrorMemberId(memberId);
          setHydratedMemberId(null);
        }
      }
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, [memberId, restoreAttempt]);

  useEffect(() => {
    const currentUrls = new Set(
      draft.photoSlots
        .map((slot) => slot.previewUrl)
        .filter((url): url is string => Boolean(url?.startsWith('blob:')))
    );

    previewUrlsRef.current.forEach((url) => {
      if (!currentUrls.has(url)) {
        URL.revokeObjectURL(url);
        previewUrlsRef.current.delete(url);
      }
    });
  }, [draft.photoSlots]);

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.clear();
    };
  }, []);

  useEffect(() => {
    if (
      memberId === undefined ||
      hydratedMemberId !== memberId ||
      lastSavedDraftRef.current === draft
    ) {
      return;
    }

    let cancelled = false;

    try {
      saveOnboardingDraft(memberId, draft);
      lastSavedDraftRef.current = draft;
      queueMicrotask(() => {
        if (!cancelled) setMetadataSaveError(false);
      });
    } catch {
      queueMicrotask(() => {
        if (!cancelled) setMetadataSaveError(true);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [draft, memberId, hydratedMemberId]);

  useEffect(() => {
    if (
      memberId === undefined ||
      hydratedMemberId !== memberId ||
      lastSavedPhotoSlotsRef.current === draft.photoSlots
    ) {
      return;
    }

    lastSavedPhotoSlotsRef.current = draft.photoSlots;
    void saveOnboardingPhotos(memberId, draft.photoSlots).then(
      () => {
        setPhotoSaveError(false);
        setPhotoRestoreError(false);
      },
      () => setPhotoSaveError(true)
    );
  }, [draft.photoSlots, memberId, hydratedMemberId]);

  const updateDraft = <Key extends keyof OnboardingDraft>(
    key: Key,
    value: OnboardingDraft[Key]
  ) => {
    setDraft((currentDraft) => ({...currentDraft, [key]: value}));
  };

  const saveBeforeLeave = async () => {
    if (memberId === undefined || hydratedMemberId !== memberId) return false;

    try {
      saveOnboardingDraft(memberId, draft);
      setMetadataSaveError(false);

      if (draft.photoSlots.some((slot) => slot.file)) {
        await saveOnboardingPhotos(memberId, draft.photoSlots);
        setPhotoSaveError(false);
      }

      return true;
    } catch {
      setMetadataSaveError(true);
      return false;
    }
  };

  const toggleInterest = (interestStep: InterestStep, item: InterestItem) => {
    setDraft((currentDraft) => {
      const currentItems = currentDraft.selectedInterests[interestStep] ?? [];
      const isSelected = currentItems.includes(item);

      if (isSelected) {
        return {
          ...currentDraft,
          selectedInterests: {
            ...currentDraft.selectedInterests,
            [interestStep]: currentItems.filter(
              (selectedItem) => selectedItem !== item
            ),
          },
        };
      }

      if (currentItems.length >= MAX_INTEREST_COUNT) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        selectedInterests: {
          ...currentDraft.selectedInterests,
          [interestStep]: [...currentItems, item],
        },
      };
    });
  };

  const changePhoto = (id: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.add(previewUrl);

    setDraft((currentDraft) => ({
      ...currentDraft,
      photoSlots: currentDraft.photoSlots.map((slot) =>
        slot.id === id ? {...slot, file, previewUrl} : slot
      ),
    }));
  };

  const removePhoto = (id: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      photoSlots: currentDraft.photoSlots.map((slot) =>
        slot.id === id ? {...slot, file: null, previewUrl: null} : slot
      ),
    }));
  };

  const sortPhotos = (event: DragEndEvent) => {
    if (event.canceled || !isSortableOperation(event.operation)) return;

    const {source} = event.operation;

    if (!source) return;

    const {initialIndex, index} = source;

    if (initialIndex !== index) {
      setDraft((currentDraft) => ({
        ...currentDraft,
        photoSlots: arrayMove(currentDraft.photoSlots, initialIndex, index),
      }));
    }
  };

  return {
    draft,
    isReady: memberId !== undefined && hydratedMemberId === memberId,
    restoreError: memberId !== undefined && restoreErrorMemberId === memberId,
    photoRestoreError,
    saveError: metadataSaveError || photoSaveError,
    saveBeforeLeave,
    retryRestore: () => setRestoreAttempt((attempt) => attempt + 1),
    updateDraft,
    toggleInterest,
    changePhoto,
    removePhoto,
    sortPhotos,
  };
};
