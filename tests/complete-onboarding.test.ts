import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
  DEPARTMENTS,
  INTEREST_CATEGORIES,
  INTEREST_STEPS,
} from '../src/pages/onboarding/constants/constants';
import {buildCompleteOnboardingRequest} from '../src/pages/onboarding/model/complete-onboarding';
import {createInitialOnboardingDraft} from '../src/pages/onboarding/model/onboarding-draft';

const CATEGORY_CODES = [
  'HOBBY',
  'FOOD',
  'LIFESTYLE',
  'PERSONALITY',
  'DATE',
  'CONTACT',
  'PET',
  'VALUES',
];

test('builds the completion request with department code and catalog tag IDs', () => {
  const draft = createInitialOnboardingDraft();
  draft.nickname = '  새친구  ';
  draft.department = '컴퓨터공학과';
  draft.selectedGender = 'male';
  draft.selectedMbti = 'ENFP';

  INTEREST_STEPS.forEach((step, index) => {
    draft.selectedInterests[step] = [INTEREST_CATEGORIES[index].items[0]];
  });

  const catalog = {
    data: INTEREST_CATEGORIES.map((category, index) => ({
      code: CATEGORY_CODES[index],
      name: category.category,
      tags: [{id: index + 10, name: category.items[0]}],
    })),
  };

  assert.deepEqual(buildCompleteOnboardingRequest(draft, catalog), {
    nickName: '새친구',
    birthYear: 2005,
    department: 'COMPUTER_ENGINEERING',
    mbti: 'ENFP',
    gender: 'MALE',
    keywordTagIds: [10, 11, 12, 13, 14, 15, 16, 17],
  });
});

test('every selectable department has an API code', () => {
  const draft = createInitialOnboardingDraft();
  draft.nickname = '테스트';
  draft.selectedGender = 'female';

  for (const department of DEPARTMENTS) {
    draft.department = department;
    assert.ok(buildCompleteOnboardingRequest(draft, {data: []}).department);
  }
});

test('does not submit unknown departments or unmatched keyword labels', () => {
  const draft = createInitialOnboardingDraft();
  draft.nickname = '테스트';
  draft.selectedGender = 'female';
  draft.department = '자율전공';

  assert.throws(() => buildCompleteOnboardingRequest(draft, {data: []}));

  draft.department = '컴퓨터공학과';
  draft.selectedInterests.hobby = ['운동'];

  assert.throws(() => buildCompleteOnboardingRequest(draft, {data: []}));
});

test('maps display-only keyword names to the live catalog names', () => {
  const draft = createInitialOnboardingDraft();
  draft.nickname = '테스트';
  draft.selectedGender = 'female';
  draft.department = '컴퓨터공학과';
  draft.selectedInterests.foodStyle = ['가벼운음주'];
  draft.selectedInterests.lifeStyle = ['즉흥'];

  const body = buildCompleteOnboardingRequest(draft, {
    data: [
      {code: 'FOOD', tags: [{id: 16, name: '가벼운 음주'}]},
      {code: 'LIFESTYLE', tags: [{id: 21, name: '즉흥형'}]},
    ],
  });

  assert.deepEqual(body.keywordTagIds, [16, 21]);
});
