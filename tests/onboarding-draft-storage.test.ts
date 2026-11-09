import assert from 'node:assert/strict';
import {test} from 'node:test';

import {createInitialOnboardingDraft} from '../src/pages/onboarding/model/onboarding-draft';
import {
  getOnboardingDraftStep,
  loadOnboardingDraft,
  parseStoredOnboardingDraft,
  saveOnboardingDraft,
} from '../src/pages/onboarding/model/onboarding-draft-storage';

const HOUR_MS = 60 * 60 * 1000;

const useMemoryStorage = () => {
  const entries = new Map<string, string>();
  globalThis.localStorage = {
    setItem: (key, value) => {
      entries.set(key, value);
    },
    getItem: (key) => entries.get(key) ?? null,
    removeItem: (key) => {
      entries.delete(key);
    },
  } as Storage;
  return entries;
};

const createStoredDraft = (updatedAt: number) => ({
  ...createInitialOnboardingDraft(),
  photoSlots: undefined,
  version: 1,
  updatedAt,
  photoCount: 0,
  photoSlotIds: createInitialOnboardingDraft().photoSlots.map(({id}) => id),
});

test('restores a valid draft until 24 hours after its last change', () => {
  const now = Date.now();
  const raw = JSON.stringify(createStoredDraft(now - 23 * HOUR_MS));

  assert.equal(parseStoredOnboardingDraft(raw, now)?.step, 'nickname');
  assert.equal(parseStoredOnboardingDraft(raw, now + HOUR_MS), null);
});

test('rejects malformed, future, and outdated drafts', () => {
  const now = Date.now();

  assert.equal(parseStoredOnboardingDraft('{', now), null);
  assert.equal(
    parseStoredOnboardingDraft(
      JSON.stringify({...createStoredDraft(now), version: 2}),
      now
    ),
    null
  );
  assert.equal(
    parseStoredOnboardingDraft(JSON.stringify(createStoredDraft(now + 1)), now),
    null
  );
});

test('stores input fields and photo order without serializing files', () => {
  const entries = useMemoryStorage();
  const draft = createInitialOnboardingDraft();
  draft.nickname = '테스트';
  draft.step = 'photoUpload';
  draft.photoSlots.reverse();
  draft.photoSlots[0].previewUrl = 'blob:temporary';

  saveOnboardingDraft(101, draft);

  const raw = entries.get('onboarding-draft:v1:101');
  assert.ok(raw);
  assert.equal(entries.has('onboarding-draft:v1:102'), false);
  assert.equal(raw.includes('blob:temporary'), false);
  assert.deepEqual(parseStoredOnboardingDraft(raw)?.photoSlotIds, [
    'photo-slot-5',
    'photo-slot-4',
    'photo-slot-3',
    'photo-slot-2',
    'photo-slot-1',
  ]);
  assert.equal(parseStoredOnboardingDraft(raw)?.nickname, '테스트');
});

test('restores a text-only draft for the matching member', async () => {
  useMemoryStorage();
  const draft = createInitialOnboardingDraft();
  draft.nickname = '이어하기';
  draft.birthYear = 2003;
  draft.step = 'department';

  saveOnboardingDraft(101, draft);

  const restored = await loadOnboardingDraft(101);
  const otherMember = await loadOnboardingDraft(102);

  assert.equal(restored.draft?.nickname, '이어하기');
  assert.equal(restored.draft?.birthYear, 2003);
  assert.equal(restored.draft?.step, 'department');
  assert.equal(restored.photosUnavailable, false);
  assert.equal(otherMember.draft, null);
});

test('reads only the matching member step and ignores expired drafts', () => {
  const entries = useMemoryStorage();
  const now = Date.now();
  entries.set(
    'onboarding-draft:v1:101',
    JSON.stringify({...createStoredDraft(now), step: 'mbti', photoCount: 1})
  );
  entries.set(
    'onboarding-draft:v1:102',
    JSON.stringify(createStoredDraft(now - 25 * HOUR_MS))
  );

  assert.equal(getOnboardingDraftStep(101), 'mbti');
  assert.equal(getOnboardingDraftStep(102), null);
  assert.equal(getOnboardingDraftStep(103), null);
});

test('pre-API complete drafts resume from photo upload', async () => {
  const entries = useMemoryStorage();
  entries.set(
    'onboarding-draft:v1:101',
    JSON.stringify({...createStoredDraft(Date.now()), step: 'complete'})
  );

  assert.equal(getOnboardingDraftStep(101), 'photoUpload');
  assert.equal((await loadOnboardingDraft(101)).draft?.step, 'photoUpload');
});
