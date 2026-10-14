import type {
  IssuePresignedUrlsRequest,
  IssuePresignedUrlsResponse,
  SaveImagesRequest,
} from '../api/type';
import type {OnboardingDraft} from './onboarding-draft';

type UploadImagesInput = Pick<OnboardingDraft, 'photoSlots' | 'blurStrength'>;

interface ImageUploadApi {
  issuePresignedUrls: (
    body: IssuePresignedUrlsRequest
  ) => Promise<IssuePresignedUrlsResponse>;
  saveImages: (body: SaveImagesRequest) => Promise<unknown>;
}

export const uploadOnboardingImages = async (
  {photoSlots, blurStrength}: UploadImagesInput,
  {issuePresignedUrls, saveImages}: ImageUploadApi
) => {
  const files = photoSlots.flatMap((slot) => (slot.file ? [slot.file] : []));
  if (files.length === 0) return;

  const response = await issuePresignedUrls({
    images: files.map((file) => ({
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
      blurLevel: blurStrength,
    })),
  });
  const urls = response.data?.images;

  if (
    urls?.length !== files.length ||
    urls.some(
      (url) => !url.uploadUrl || !url.originalKey || !url.requiredHeaders
    )
  ) {
    throw new Error('사진 업로드 정보를 받지 못했어요. 다시 시도해 주세요.');
  }

  // Signed S3 requests must not inherit the API client's auth or cookies.
  for (const [index, url] of urls.entries()) {
    const uploaded = await fetch(url.uploadUrl!, {
      method: 'PUT',
      headers: url.requiredHeaders,
      body: files[index],
      credentials: 'omit',
    });

    if (!uploaded.ok) {
      throw new Error('사진을 업로드하지 못했어요. 다시 시도해 주세요.');
    }
  }

  await saveImages({
    images: urls.map((url, index) => ({
      objectKey: url.originalKey!,
      displayOrder: index + 1,
      blurLevel: blurStrength,
    })),
  });
};
