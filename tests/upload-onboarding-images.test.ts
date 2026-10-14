import assert from 'node:assert/strict';
import {test} from 'node:test';

import {createInitialOnboardingDraft} from '../src/pages/onboarding/model/onboarding-draft';
import {uploadOnboardingImages} from '../src/pages/onboarding/model/upload-onboarding-images';

const createDraft = () => {
  const draft = createInitialOnboardingDraft();
  draft.blurStrength = 80;
  draft.photoSlots[0].file = new File(['second photo'], 'second.png', {
    type: 'image/png',
  });
  draft.photoSlots[2].file = new File(['first photo'], 'first.jpg', {
    type: 'image/jpeg',
  });
  return draft;
};

const signedImages = {
  data: {
    images: ['second', 'first'].map((name) => ({
      uploadUrl: `https://uploads.example.com/${name}`,
      originalKey: `originals/${name}`,
      requiredHeaders: {
        'Content-Type': name === 'second' ? 'image/png' : 'image/jpeg',
        'x-amz-meta-blur-level': '80',
      },
    })),
  },
};

test('uploads raw files in slot order with signed headers before saving metadata', async (t) => {
  const calls: string[] = [];
  const files: File[] = [];
  t.mock.method(globalThis, 'fetch', async (url, options: RequestInit) => {
    calls.push(String(url));
    assert.equal(options.method, 'PUT');
    assert.equal(options.credentials, 'omit');
    const index = files.length;
    assert.deepEqual(
      options.headers,
      signedImages.data.images[index].requiredHeaders
    );
    assert.ok(options.body instanceof File);
    files.push(options.body);
    return new Response(null, {status: 200});
  });

  await uploadOnboardingImages(createDraft(), {
    issuePresignedUrls: async (body) => {
      calls.push('presigned');
      assert.deepEqual(body, {
        images: [
          {fileName: 'second.png', contentType: 'image/png', blurLevel: 80},
          {fileName: 'first.jpg', contentType: 'image/jpeg', blurLevel: 80},
        ],
      });
      return signedImages;
    },
    saveImages: async (body) => {
      calls.push('save');
      assert.deepEqual(body, {
        images: [
          {objectKey: 'originals/second', displayOrder: 1, blurLevel: 80},
          {objectKey: 'originals/first', displayOrder: 2, blurLevel: 80},
        ],
      });
    },
  });

  assert.deepEqual(calls, [
    'presigned',
    'https://uploads.example.com/second',
    'https://uploads.example.com/first',
    'save',
  ]);
  assert.equal(await files[0].text(), 'second photo');
  assert.equal(await files[1].text(), 'first photo');
});

test('does not replace server images with an empty list when no files are selected', async () => {
  await uploadOnboardingImages(createInitialOnboardingDraft(), {
    issuePresignedUrls: async () => assert.fail('must not issue URLs'),
    saveImages: async () => assert.fail('must not save an empty list'),
  });
});

test('rejects incomplete signed URL responses before uploading any file', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    assert.fail('must not upload')
  );
  for (const response of [
    {},
    {data: {images: [signedImages.data.images[0]]}},
    {data: {images: [{}, signedImages.data.images[1]]}},
  ]) {
    await assert.rejects(
      uploadOnboardingImages(createDraft(), {
        issuePresignedUrls: async () => response,
        saveImages: async () => assert.fail('must not save'),
      }),
      /사진 업로드 정보를/
    );
  }
});

test('failed PUT does not save metadata and preserves files for retry', async (t) => {
  const draft = createDraft();
  const originalFile = draft.photoSlots[0].file;
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, {status: 403})
  );
  await assert.rejects(
    uploadOnboardingImages(draft, {
      issuePresignedUrls: async () => signedImages,
      saveImages: async () => assert.fail('must not save after failed upload'),
    }),
    /사진을 업로드하지 못했어요/
  );
  assert.equal(draft.photoSlots[0].file, originalFile);

  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, {status: 200})
  );
  let saved = false;
  await uploadOnboardingImages(draft, {
    issuePresignedUrls: async () => signedImages,
    saveImages: async () => {
      saved = true;
    },
  });
  assert.equal(saved, true);
});

test('metadata save failure propagates instead of marking the upload complete', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, {status: 200})
  );
  const error = new Error('save failed');
  await assert.rejects(
    uploadOnboardingImages(createDraft(), {
      issuePresignedUrls: async () => signedImages,
      saveImages: async () => {
        throw error;
      },
    }),
    error
  );
});
