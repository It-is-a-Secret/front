import {isHTTPError} from 'ky';

import type {
  MemberProfile,
  ProfileEditStatus,
  UpdateProfileRequest,
} from '@/pages/my/api/type';
import type {components} from '@/shared/types/schema';

type KeywordCategory = components['schemas']['KeywordCategoryResponse'];
type MemberKeyword = components['schemas']['MemberKeywordResponse'];
type Image = components['schemas']['FeedImageItem'];

export interface ProfileInterestCategory {
  code: string;
  name: string;
  tags: {id: number; name: string}[];
}

export type ProfilePhoto = Image & {previewUrl: string | null};

export const getProfileInterestCategories = (
  catalog: KeywordCategory[],
  keywords: MemberKeyword[]
): ProfileInterestCategory[] => {
  const categories = new Map<string, ProfileInterestCategory>();

  for (const category of [...catalog].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  )) {
    if (!category.code || !category.name) continue;

    categories.set(category.code, {
      code: category.code,
      name: category.name,
      tags: (category.tags ?? []).flatMap((tag) =>
        tag.id !== undefined && tag.name ? [{id: tag.id, name: tag.name}] : []
      ),
    });
  }

  // Keep selected tags visible even when they are no longer in the catalog.
  for (const keyword of keywords) {
    if (
      !keyword.categoryCode ||
      keyword.tagId === undefined ||
      !keyword.tagName
    )
      continue;

    const category = categories.get(keyword.categoryCode) ?? {
      code: keyword.categoryCode,
      name: keyword.categoryName ?? keyword.categoryCode,
      tags: [],
    };

    if (!category.tags.some((tag) => tag.id === keyword.tagId)) {
      category.tags.push({id: keyword.tagId, name: keyword.tagName});
    }

    categories.set(category.code, category);
  }

  return [...categories.values()];
};

export const getProfilePhotos = (images: Image[]): ProfilePhoto[] =>
  [...images]
    .sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    .map((image) => {
      let previewUrl: string | null = null;

      if (image.variantUrl) {
        try {
          const url = new URL(image.variantUrl);
          if (url.protocol === 'https:' || url.protocol === 'http:') {
            previewUrl = url.href;
          }
        } catch {
          // Only render absolute HTTP(S) preview URLs from the API.
        }
      }

      return {...image, previewUrl};
    });

export const getProfileBlurLabel = (photos: ProfilePhoto[]) => {
  if (photos.length === 0) return '';
  if (photos.some((photo) => photo.blurLevel === undefined)) return '확인 필요';

  const levels = new Set(photos.map((photo) => photo.blurLevel));
  return levels.size === 1 ? `${photos[0].blurLevel}%` : '사진별 설정';
};

export type ProfileChanges = Partial<UpdateProfileRequest>;

export const buildProfileUpdateRequest = (
  profile: MemberProfile,
  changes: ProfileChanges
): UpdateProfileRequest => {
  if (!profile.nickName || profile.registrationStatus !== 'COMPLETED') {
    throw new Error('온보딩을 완료한 뒤 프로필을 수정할 수 있어요.');
  }
  return {
    nickName: profile.nickName,
    mbti: profile.mbti ?? null,
    keywordTagIds: [
      ...new Set(
        (profile.keywords ?? []).flatMap((keyword) =>
          keyword.tagId === undefined ? [] : [keyword.tagId]
        )
      ),
    ],
    ...changes,
  };
};

export const isValidNickname = (nickname: string) =>
  /^[가-힣a-zA-Z0-9]{2,12}$/.test(nickname);

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
};

export const getProfileChangeNote = (status?: ProfileEditStatus) => {
  const notes: string[] = [];
  if (status?.lastChangedAt) {
    const date = formatDate(status.lastChangedAt);
    if (date) notes.push(`최근 변경일 ${date}`);
  }
  if (status?.nextChangeableAt) {
    const date = formatDate(status.nextChangeableAt);
    if (date) notes.push(`다음 변경 가능일 ${date}`);
  }
  return notes.join(' / ');
};

export const getProfileErrorMessage = (error: unknown, fallback: string) => {
  if (isHTTPError(error)) {
    const data = error.data as {message?: unknown} | undefined;
    if (typeof data?.message === 'string' && data.message) return data.message;
    return fallback;
  }
  return error instanceof TypeError
    ? '네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
    : error instanceof Error
      ? error.message
      : fallback;
};
