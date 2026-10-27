import {
  BLUR_STRENGTHS,
  type BlurStrength,
} from '@/pages/onboarding/constants/constants';
import type {PhotoSlot} from '@/pages/onboarding/hooks/usePhotoUploadSlots';
import type {
  IssuePresignedUrlsRequest,
  IssuePresignedUrlsResponse,
  SaveImagesRequest,
  SaveImagesResponse,
} from '@/pages/onboarding/api/type';
import type {ProfilePhoto} from './profile-edit';

interface ImageApi {
  issuePresignedUrls: (
    body: IssuePresignedUrlsRequest
  ) => Promise<IssuePresignedUrlsResponse>;
  saveImages: (body: SaveImagesRequest) => Promise<SaveImagesResponse>;
}

export const getOccupiedPhotoSlots = (slots: PhotoSlot[]) =>
  slots.filter(
    (slot) =>
      slot.file ||
      slot.imageId !== undefined ||
      slot.objectKey ||
      slot.previewUrl
  );

export const hasProfilePhotoChanges = (
  slots: PhotoSlot[],
  photos: ProfilePhoto[]
) => {
  const occupied = getOccupiedPhotoSlots(slots);
  return (
    occupied.length !== photos.length ||
    occupied.some(
      (slot, index) => slot.file || slot.imageId !== photos[index]?.id
    )
  );
};

const validateImageCount = (length: number) => {
  if (length < 1 || length > 5)
    throw new Error('사진은 1장 이상, 5장 이하로 저장해 주세요.');
};

const validateId = (id: number | undefined) => {
  if (id === undefined || !Number.isSafeInteger(id) || id < 1) {
    throw new Error('기존 사진 정보를 확인하지 못했어요. 다시 불러와 주세요.');
  }
  return id;
};

const getContentType = (file: File) => {
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    heic: 'image/heic',
    heif: 'image/heif',
  };
  const contentType =
    file.type || types[file.name.split('.').pop()?.toLowerCase() ?? ''];
  if (!Object.values(types).includes(contentType))
    throw new Error('JPG, PNG, HEIC 사진을 선택해 주세요.');
  return contentType;
};

export const buildBlurUpdateRequest = (
  photos: ProfilePhoto[],
  blurLevel: BlurStrength
): SaveImagesRequest => {
  validateImageCount(photos.length);
  if (!BLUR_STRENGTHS.includes(blurLevel))
    throw new Error('블러 강도를 다시 선택해 주세요.');
  const images = photos.map((photo, index) => ({
    id: validateId(photo.id),
    displayOrder: index + 1,
    blurLevel,
  }));
  if (new Set(images.map((image) => image.id)).size !== images.length)
    throw new Error('같은 사진을 중복해서 저장할 수 없어요.');
  return {images};
};

export const saveProfilePhotos = async (
  slots: PhotoSlot[],
  defaultBlurLevel: BlurStrength,
  api: ImageApi
) => {
  const occupied = getOccupiedPhotoSlots(slots);
  validateImageCount(occupied.length);
  const existingIds = occupied
    .filter((slot) => !slot.file)
    .map((slot) => validateId(slot.imageId));
  if (new Set(existingIds).size !== existingIds.length)
    throw new Error('같은 사진을 중복해서 저장할 수 없어요.');
  const uploads = occupied.flatMap((slot) => {
    if (!slot.file) return [];
    const blurLevel =
      BLUR_STRENGTHS.find((level) => level === slot.blurLevel) ??
      defaultBlurLevel;
    return [
      {
        slotId: slot.id,
        file: slot.file,
        blurLevel,
        contentType: getContentType(slot.file),
      },
    ];
  });
  const uploadedKeys = new Map<
    string,
    {objectKey: string; blurLevel: number}
  >();
  if (uploads.length > 0) {
    const response = await api.issuePresignedUrls({
      images: uploads.map(({file, blurLevel, contentType}) => ({
        fileName: file.name,
        contentType,
        blurLevel,
      })),
    });
    const urls = response.data?.images;
    if (
      !urls ||
      urls.length !== uploads.length ||
      urls.some(
        (url) => !url.uploadUrl || !url.originalKey || !url.requiredHeaders
      )
    ) {
      throw new Error('사진 업로드 정보를 받지 못했어요. 다시 시도해 주세요.');
    }
    for (const [index, url] of urls.entries()) {
      const upload = uploads[index];
      // Use raw signed PUT requests without the app's auth headers or cookies.
      const result = await fetch(url.uploadUrl!, {
        method: 'PUT',
        headers: url.requiredHeaders,
        body: upload.file,
        credentials: 'omit',
      });
      if (!result.ok)
        throw new Error('사진을 업로드하지 못했어요. 다시 시도해 주세요.');
      uploadedKeys.set(upload.slotId, {
        objectKey: url.originalKey!,
        blurLevel: upload.blurLevel,
      });
    }
  }
  return api.saveImages({
    images: occupied.map((slot, index) => ({
      ...(slot.file
        ? uploadedKeys.get(slot.id)!
        : {id: validateId(slot.imageId)}),
      displayOrder: index + 1,
    })),
  });
};
