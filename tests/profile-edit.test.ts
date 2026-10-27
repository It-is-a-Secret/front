import assert from 'node:assert/strict';
import {test} from 'node:test';

import {createInitialPhotoSlots} from '../src/pages/onboarding/hooks/usePhotoUploadSlots';
import {
  getProfileBlurLabel,
  getProfileInterestCategories,
  getProfilePhotos,
  buildProfileUpdateRequest,
  getProfileChangeNote,
  isValidNickname,
} from '../src/pages/my/model/profile-edit';

test('uses catalog order and IDs even when category labels are identical', () => {
  const catalog = [
    {
      code: 'FOOD',
      name: '관심사',
      sortOrder: 2,
      tags: [{id: 20, name: '산책'}],
    },
    {
      code: 'HOBBY',
      name: '관심사',
      sortOrder: 1,
      tags: [{id: 10, name: '산책'}],
    },
  ];
  const snapshot = structuredClone(catalog);
  const categories = getProfileInterestCategories(catalog, [
    {categoryCode: 'FOOD', tagId: 20, tagName: '산책'},
  ]);

  assert.deepEqual(
    categories.map((category) => category.code),
    ['HOBBY', 'FOOD']
  );
  assert.equal(categories[0].tags[0].id, 10);
  assert.equal(categories[1].tags[0].id, 20);
  assert.deepEqual(catalog, snapshot);
});

test('keeps selected tags that have been removed from the active catalog', () => {
  const categories = getProfileInterestCategories(
    [{code: 'HOBBY', name: '취미', tags: [{id: 1, name: '운동'}]}],
    [
      {categoryCode: 'HOBBY', tagId: 2, tagName: '기존 취미'},
      {
        categoryCode: 'LEGACY',
        categoryName: '기존 카테고리',
        tagId: 3,
        tagName: '기존 관심사',
      },
    ]
  );

  assert.deepEqual(categories[0].tags, [
    {id: 1, name: '운동'},
    {id: 2, name: '기존 취미'},
  ]);
  assert.deepEqual(categories[1], {
    code: 'LEGACY',
    name: '기존 카테고리',
    tags: [{id: 3, name: '기존 관심사'}],
  });
});

test('sorts photos and uses only valid variant URLs for previews', () => {
  const images = [
    {
      id: 3,
      displayOrder: 3,
      variantUrl: 'originals/member/photo.jpg',
      blurLevel: 80,
    },
    {
      displayOrder: 1,
      variantUrl: 'https://cdn.example.com/photo.jpg?signature=abc',
      blurLevel: 60,
    },
    {displayOrder: 2, variantUrl: 'javascript:alert(1)', blurLevel: 70},
  ];
  const photos = getProfilePhotos(images);

  assert.deepEqual(
    photos.map((photo) => photo.displayOrder),
    [1, 2, 3]
  );
  assert.equal(photos[0].previewUrl, images[1].variantUrl);
  assert.equal(photos[1].previewUrl, null);
  assert.equal(photos[2].previewUrl, null);
  assert.equal(images[0].displayOrder, 3);
});

test('distinguishes empty, unknown, uniform, and per-photo blur settings', () => {
  assert.equal(getProfileBlurLabel(getProfilePhotos([])), '');
  assert.equal(
    getProfileBlurLabel(getProfilePhotos([{displayOrder: 1}])),
    '확인 필요'
  );
  assert.equal(
    getProfileBlurLabel(getProfilePhotos([{displayOrder: 1, blurLevel: 0}])),
    '0%'
  );
  assert.equal(
    getProfileBlurLabel(
      getProfilePhotos([
        {displayOrder: 1, blurLevel: 60},
        {displayOrder: 2, blurLevel: 60},
      ])
    ),
    '60%'
  );
  assert.equal(
    getProfileBlurLabel(
      getProfilePhotos([
        {displayOrder: 1, blurLevel: 60},
        {displayOrder: 2, blurLevel: 80},
      ])
    ),
    '사진별 설정'
  );
});

test('restores registered photo previews without inventing original storage keys', () => {
  const slots = createInitialPhotoSlots(
    getProfilePhotos([
      {id: 12, displayOrder: 1, blurLevel: 60, processingStatus: 'PROCESSING'},
      {
        displayOrder: 2,
        variantUrl: 'https://cdn.example.com/photo.jpg',
        blurLevel: 60,
      },
    ])
  );

  assert.equal(slots.length, 5);
  assert.equal(slots[0].objectKey, undefined);
  assert.equal(slots[0].imageId, 12);
  assert.equal(slots[0].blurLevel, 60);
  assert.equal(slots[0].previewUrl, null);
  assert.equal(slots[1].previewUrl, 'https://cdn.example.com/photo.jpg');
  assert.equal(slots[2].file, null);
  assert.equal(slots[2].previewUrl, null);
  assert.deepEqual(createInitialPhotoSlots(['existing.png'])[0], {
    id: 'photo-slot-1',
    file: null,
    previewUrl: 'existing.png',
  });
});

const profile = {
  id: 1,
  nickName: '기존닉네임',
  mbti: 'INFP' as const,
  registrationStatus: 'COMPLETED' as const,
  keywords: [{tagId: 4}, {tagId: 7}, {tagId: 4}],
};

test('sends all editable fields while changing only the requested value', () => {
  const snapshot = structuredClone(profile);
  assert.deepEqual(buildProfileUpdateRequest(profile, {nickName: '새닉네임'}), {
    nickName: '새닉네임',
    mbti: 'INFP',
    keywordTagIds: [4, 7],
  });
  assert.deepEqual(buildProfileUpdateRequest(profile, {mbti: 'ENFP'}), {
    nickName: '기존닉네임',
    mbti: 'ENFP',
    keywordTagIds: [4, 7],
  });
  assert.deepEqual(buildProfileUpdateRequest(profile, {keywordTagIds: [8]}), {
    nickName: '기존닉네임',
    mbti: 'INFP',
    keywordTagIds: [8],
  });
  assert.deepEqual(profile, snapshot);
});

test('preserves unknown MBTI as explicit null and supports clearing it', () => {
  assert.equal(
    buildProfileUpdateRequest({...profile, mbti: undefined}, {}).mbti,
    null
  );
  assert.equal(buildProfileUpdateRequest(profile, {mbti: null}).mbti, null);
});

test('never uses profile editing to finish onboarding', () => {
  assert.throws(() =>
    buildProfileUpdateRequest(
      {...profile, registrationStatus: 'VERIFIED'},
      {mbti: 'ENFP'}
    )
  );
});

test('formats actual server change dates in Korea time without inventing a last change', () => {
  assert.equal(getProfileChangeNote({changeable: true}), '');
  const note = getProfileChangeNote({
    lastChangedAt: '2026-10-01T23:00:00Z',
    nextChangeableAt: '2026-10-31T23:00:00Z',
    changeable: false,
  });
  assert.match(note, /최근 변경일 2026\. 10\. 02\./);
  assert.match(note, /다음 변경 가능일 2026\. 11\. 01\./);
  assert.match(
    getProfileChangeNote({
      changeable: true,
      nextChangeableAt: '2026-10-01T23:00:00Z',
    }),
    /다음 변경 가능일 2026\. 10\. 02\./
  );
  assert.equal(
    getProfileChangeNote({lastChangedAt: 'invalid', changeable: true}),
    ''
  );
});

test('nickname format matches the existing 2 to 12 character UI rule', () => {
  for (const value of ['한글', 'abc123', '가나다라마바123456'])
    assert.equal(isValidNickname(value), true);
  for (const value of ['', 'a', 'space name', 'abc!', 'abcdefghijklm'])
    assert.equal(isValidNickname(value), false);
});
