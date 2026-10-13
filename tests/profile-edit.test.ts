import assert from 'node:assert/strict';
import {test} from 'node:test';

import {createInitialPhotoSlots} from '../src/pages/onboarding/hooks/usePhotoUploadSlots';
import {
  getProfileBlurLabel,
  getProfileInterestCategories,
  getProfilePhotos,
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

test('sorts photos without treating private object keys as browser image URLs', () => {
  const images = [
    {displayOrder: 3, objectKey: 'originals/member/photo.jpg', blurLevel: 80},
    {
      displayOrder: 1,
      objectKey: 'https://cdn.example.com/photo.jpg?signature=abc',
      blurLevel: 60,
    },
    {displayOrder: 2, objectKey: 'javascript:alert(1)', blurLevel: 70},
  ];
  const photos = getProfilePhotos(images);

  assert.deepEqual(
    photos.map((photo) => photo.displayOrder),
    [1, 2, 3]
  );
  assert.equal(photos[0].previewUrl, images[1].objectKey);
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

test('keeps registered photos in upload slots even without a preview URL', () => {
  const slots = createInitialPhotoSlots(
    getProfilePhotos([
      {displayOrder: 1, objectKey: 'originals/private.jpg', blurLevel: 60},
      {
        displayOrder: 2,
        objectKey: 'https://cdn.example.com/photo.jpg',
        blurLevel: 60,
      },
    ])
  );

  assert.equal(slots.length, 5);
  assert.equal(slots[0].objectKey, 'originals/private.jpg');
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
