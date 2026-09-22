import assert from 'node:assert/strict';
import {test} from 'node:test';

import {createInitialOnboardingDraft} from '../src/pages/onboarding/model/onboarding-draft';
import {
  loadOnboardingDraft,
  parseStoredOnboardingDraft,
  saveOnboardingDraft,
} from '../src/pages/onboarding/model/onboarding-draft-storage';

const HOUR_MS = 60 * 60 * 1000;

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
