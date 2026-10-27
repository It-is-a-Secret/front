import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
  buildBlurUpdateRequest,
  getOccupiedPhotoSlots,
  hasProfilePhotoChanges,
  saveProfilePhotos,
} from '../src/pages/my/model/profile-images';
import {getProfilePhotos} from '../src/pages/my/model/profile-edit';
import {createInitialPhotoSlots} from '../src/pages/onboarding/hooks/usePhotoUploadSlots';

const photos = getProfilePhotos([
  {id: 10, displayOrder: 1, blurLevel: 60, processingStatus: 'PROCESSING'},
  {
    id: 20,
    displayOrder: 2,
    blurLevel: 80,
    variantUrl: 'https://cdn.example.com/blur.jpg',
    processingStatus: 'READY',
  },
]);
const signed = {
  data: {
    images: [
      {
        uploadUrl: 'https://uploads.example.com/new',
        originalKey: 'originals/new.png',
        requiredHeaders: {
          'Content-Type': 'image/png',
          'x-amz-meta-blur-level': '80',
        },
      },
    ],
  },
};

test('keeps a processing photo with no preview identifiable by its image ID', () => {
  const slots = createInitialPhotoSlots(photos);
  assert.equal(slots[0].imageId, 10);
  assert.equal(slots[0].blurLevel, 60);
  assert.equal(slots[0].processingStatus, 'PROCESSING');
  assert.equal(getOccupiedPhotoSlots(slots).length, 2);
  assert.equal(hasProfilePhotoChanges(slots, photos), false);
  [slots[0], slots[1]] = [slots[1], slots[0]];
  assert.equal(hasProfilePhotoChanges(slots, photos), true);
});

test('reorders existing IDs without uploading or changing individual blur levels', async () => {
  const slots = createInitialPhotoSlots(photos);
  [slots[0], slots[1]] = [slots[1], slots[0]];
  const snapshot = structuredClone(slots);
  await saveProfilePhotos(slots, 70, {
    issuePresignedUrls: async () => assert.fail('no new files to upload'),
    saveImages: async (body) => {
      assert.deepEqual(body, {
        images: [
          {id: 20, displayOrder: 1},
          {id: 10, displayOrder: 2},
        ],
      });
      return {};
    },
  });
  assert.deepEqual(slots, snapshot);
});

test('deletion omits only removed IDs and compacts gaps in display order', async () => {
  const slots = createInitialPhotoSlots(photos);
  slots[0] = {...slots[0], imageId: undefined, previewUrl: null};
  await saveProfilePhotos(slots, 70, {
    issuePresignedUrls: async () => assert.fail('must not upload'),
    saveImages: async (body) => {
      assert.deepEqual(body, {images: [{id: 20, displayOrder: 1}]});
      return {};
    },
  });
});

test('uploads only the replacement file with signed headers and saves mixed references', async (t) => {
  const slots = createInitialPhotoSlots(photos);
  slots[1] = {
    ...slots[1],
    imageId: undefined,
    file: new File(['raw png'], 'new.png', {type: 'image/png'}),
  };
  const calls: string[] = [];
  t.mock.method(globalThis, 'fetch', async (url, options: RequestInit) => {
    calls.push('upload');
    assert.equal(url, signed.data.images[0].uploadUrl);
    assert.equal(options.method, 'PUT');
    assert.equal(options.credentials, 'omit');
    assert.deepEqual(options.headers, signed.data.images[0].requiredHeaders);
    assert.equal(options.body, slots[1].file);
    assert.equal(await (options.body as File).text(), 'raw png');
    return new Response(null, {status: 200});
  });
  await saveProfilePhotos(slots, 70, {
    issuePresignedUrls: async (body) => {
      calls.push('presign');
      assert.deepEqual(body, {
        images: [
          {fileName: 'new.png', contentType: 'image/png', blurLevel: 80},
        ],
      });
      return signed;
    },
    saveImages: async (body) => {
      calls.push('save');
      assert.deepEqual(body, {
        images: [
          {id: 10, displayOrder: 1},
          {objectKey: 'originals/new.png', displayOrder: 2, blurLevel: 80},
        ],
      });
      assert.equal('id' in body.images![1], false);
      return {};
    },
  });
  assert.deepEqual(calls, ['presign', 'upload', 'save']);
});

test('a failed PUT never saves a partial list and leaves the file available for retry', async (t) => {
  const slots = createInitialPhotoSlots(photos);
  const file = new File(['new'], 'new.png', {type: 'image/png'});
  slots[1] = {...slots[1], imageId: undefined, file};
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, {status: 403})
  );
  const api = {
    issuePresignedUrls: async () => signed,
    saveImages: async () => ({}),
  };
  const save = t.mock.method(api, 'saveImages');
  await assert.rejects(
    saveProfilePhotos(slots, 70, api),
    /사진을 업로드하지 못했어요/
  );
  assert.equal(save.mock.callCount(), 0);
  assert.equal(slots[1].file, file);
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, {status: 200})
  );
  await saveProfilePhotos(slots, 70, api);
  assert.equal(save.mock.callCount(), 1);
});

test('rejects empty, oversized, duplicate and unknown existing references before API calls', async () => {
  const slots = createInitialPhotoSlots(photos);
  const api = {
    issuePresignedUrls: async () => assert.fail('must not upload'),
    saveImages: async () => assert.fail('must not save'),
  };
  for (const invalid of [
    createInitialPhotoSlots(),
    Array.from({length: 6}, () => slots[0]),
    [slots[0], slots[0]],
    [{...slots[1], imageId: undefined}],
  ])
    await assert.rejects(saveProfilePhotos(invalid, 70, api));
});

test('invalid signed URL response is rejected before uploading or saving', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    assert.fail('must not upload')
  );
  const slots = createInitialPhotoSlots();
  slots[0].file = new File(['new'], 'new.png', {type: 'image/png'});
  for (const response of [
    {},
    {data: {images: []}},
    {data: {images: [{originalKey: 'missing-url'}]}},
  ]) {
    await assert.rejects(
      saveProfilePhotos(slots, 70, {
        issuePresignedUrls: async () => response,
        saveImages: async () => assert.fail('must not save'),
      }),
      /사진 업로드 정보를/
    );
  }
});

test('metadata errors propagate and never discard selected files', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, {status: 200})
  );
  const slots = createInitialPhotoSlots();
  slots[0].file = new File(['new'], 'new.png', {type: 'image/png'});
  const error = new Error('save failed');
  await assert.rejects(
    saveProfilePhotos(slots, 70, {
      issuePresignedUrls: async () => signed,
      saveImages: async () => {
        throw error;
      },
    }),
    error
  );
  assert.ok(slots[0].file);
});

test('blur changes keep every existing ID and request server-side regeneration without S3 URLs', () => {
  assert.deepEqual(buildBlurUpdateRequest(photos, 90), {
    images: [
      {id: 10, displayOrder: 1, blurLevel: 90},
      {id: 20, displayOrder: 2, blurLevel: 90},
    ],
  });
  assert.throws(() => buildBlurUpdateRequest([], 70));
  assert.throws(() =>
    buildBlurUpdateRequest([{...photos[0], id: undefined}], 70)
  );
  assert.throws(() => buildBlurUpdateRequest([photos[0], photos[0]], 70));
});
