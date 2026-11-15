import assert from 'node:assert/strict';
import {test} from 'node:test';

import {createInitialOnboardingDraft} from '../src/pages/onboarding/model/onboarding-draft';
import {submitOnboarding} from '../src/pages/onboarding/model/submit-onboarding';

const createDraft = () => {
  const draft = createInitialOnboardingDraft();
  draft.nickname = '새친구';
  draft.department = '컴퓨터공학과';
  draft.selectedGender = 'female';
  draft.selectedInterests = {
    hobby: ['운동'],
    personalityConversation: ['다정함'],
    contactRelationship: ['연락자주'],
  };
  draft.photoSlots[0].file = new File(['photo'], 'photo.jpg', {
    type: 'image/jpeg',
  });
  return draft;
};

const catalog = {
  data: [
    {code: 'HOBBY', tags: [{id: 1, name: '운동'}]},
    {code: 'PERSONALITY', tags: [{id: 26, name: '다정함'}]},
    {code: 'CONTACT', tags: [{id: 45, name: '연락자주'}]},
  ],
};

test('creates the member feed through completion before storing photos', async () => {
  let feedExists = false;
  const draft = createDraft();

  await submitOnboarding(draft, {
    isOnboardingComplete: async () => feedExists,
    getKeywordCatalog: async () => catalog,
    completeOnboarding: async (body) => {
      assert.deepEqual(body.keywordTagIds, [1, 26, 45]);
      feedExists = true;
    },
    uploadImages: async (input) => {
      assert.equal(feedExists, true, 'image storage requires an existing feed');
      assert.equal(input, draft);
    },
  });
});

test('does not upload photos when profile completion fails', async () => {
  const error = new Error('MEMBER_409_NICKNAME_DUPLICATED');
  await assert.rejects(
    submitOnboarding(createDraft(), {
      isOnboardingComplete: async () => false,
      getKeywordCatalog: async () => catalog,
      completeOnboarding: async () => {
        throw error;
      },
      uploadImages: async () => assert.fail('must not upload without a feed'),
    }),
    error
  );
});

test('retries failed photos without completing the profile twice', async () => {
  let completed = false;
  let completionCount = 0;
  let uploadCount = 0;
  const draft = createDraft();
  const file = draft.photoSlots[0].file;
  const api = {
    isOnboardingComplete: async () => completed,
    getKeywordCatalog: async () => {
      assert.equal(completed, false, 'photo retries do not need the catalog');
      return catalog;
    },
    completeOnboarding: async () => {
      assert.equal(completed, false, 'completion cannot run twice');
      completionCount += 1;
      completed = true;
    },
    uploadImages: async () => {
      uploadCount += 1;
      if (uploadCount === 1) throw new Error('S3 upload failed');
    },
  };

  await assert.rejects(submitOnboarding(draft, api), /S3 upload failed/);
  assert.equal(draft.photoSlots[0].file, file);
  await submitOnboarding(draft, api);
  assert.equal(completionCount, 1);
  assert.equal(uploadCount, 2);
});

test('a completed profile can resume photos without rebuilding profile fields', async () => {
  let uploaded = false;
  await submitOnboarding(createInitialOnboardingDraft(), {
    isOnboardingComplete: async () => true,
    getKeywordCatalog: async () => assert.fail('must not fetch catalog'),
    completeOnboarding: async () => assert.fail('must not complete again'),
    uploadImages: async () => {
      uploaded = true;
    },
  });
  assert.equal(uploaded, true);
});

test('checks server completion again when the completion response was lost', async () => {
  let completed = false;
  let uploaded = false;
  const api = {
    isOnboardingComplete: async () => completed,
    getKeywordCatalog: async () => catalog,
    completeOnboarding: async () => {
      assert.equal(completed, false, 'must not repeat the committed request');
      completed = true;
      throw new Error('response lost');
    },
    uploadImages: async () => {
      uploaded = true;
    },
  };

  await assert.rejects(submitOnboarding(createDraft(), api), /response lost/);
  assert.equal(uploaded, false);
  await submitOnboarding(createDraft(), api);
  assert.equal(uploaded, true);
});
