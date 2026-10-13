import {useState} from 'react';

import {useQuery} from '@tanstack/react-query';

import {MY_QUERY_OPTIONS} from '@/pages/my/api/query';
import type {ProfileEditSheetType} from '@/pages/my/features/profile-edit-sheet/ProfileEditSheet';
import {
  getProfileBlurLabel,
  getProfileInterestCategories,
  getProfilePhotos,
} from '@/pages/my/model/profile-edit';
import {ONBOARDING_QUERY_OPTIONS} from '@/pages/onboarding/api/query';

export const useProfileEdit = () => {
  const [selectedSheet, setSelectedSheet] =
    useState<ProfileEditSheetType | null>(null);
  const profileQuery = useQuery({
    ...MY_QUERY_OPTIONS.PROFILE(),
    refetchOnMount: 'always',
  });
  const keywordsQuery = useQuery(ONBOARDING_QUERY_OPTIONS.KEYWORDS());
  const imagesQuery = useQuery(ONBOARDING_QUERY_OPTIONS.IMAGES());
  const profile = profileQuery.data?.data;
  const keywords = profile?.keywords ?? [];
  const photos = getProfilePhotos(imagesQuery.data?.data?.images ?? []);
  const blurLabel = imagesQuery.isPending
    ? '불러오는 중...'
    : imagesQuery.isError || !imagesQuery.data?.data
      ? '조회 실패'
      : getProfileBlurLabel(photos);

  return {
    profile,
    profileQuery,
    keywordsQuery,
    imagesQuery,
    categories: getProfileInterestCategories(
      keywordsQuery.data?.data ?? [],
      keywords
    ),
    selectedTagIds: keywords.flatMap((keyword) =>
      keyword.tagId !== undefined ? [keyword.tagId] : []
    ),
    photos,
    blurLabel,
    selectedSheet,
    openSheet: setSelectedSheet,
    closeSheet: () => setSelectedSheet(null),
  };
};
