import type {components} from '@/shared/types/schema';

type KeywordCategory = components['schemas']['KeywordCategoryResponse'];
type MemberKeyword = components['schemas']['MemberKeywordResponse'];
type Image = components['schemas']['Image'];

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
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((image) => {
      let previewUrl: string | null = null;

      if (image.objectKey) {
        try {
          const url = new URL(image.objectKey);
          if (url.protocol === 'https:' || url.protocol === 'http:') {
            previewUrl = url.href;
          }
        } catch {
          // A storage object key is not an image URL.
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
