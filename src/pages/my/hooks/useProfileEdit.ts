import {useRef, useState} from 'react';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {MY_MUTATION_OPTIONS, MY_QUERY_OPTIONS} from '@/pages/my/api/query';
import type {ProfileEditSheetType} from '@/pages/my/features/profile-edit-sheet/ProfileEditSheet';
import {
  getProfileBlurLabel,
  getProfileInterestCategories,
  getProfilePhotos,
  buildProfileUpdateRequest,
  getProfileErrorMessage,
} from '@/pages/my/model/profile-edit';
import type {ProfileChanges} from '@/pages/my/model/profile-edit';
import {ONBOARDING_QUERY_OPTIONS} from '@/pages/onboarding/api/query';
import {QUERY_KEYS} from '@/shared/api';
import {useToast} from '@/shared/hooks/useToast';

export const useProfileEdit = () => {
  const queryClient = useQueryClient();
  const saveMutation = useMutation(MY_MUTATION_OPTIONS.UPDATE_PROFILE());
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const [message, setMessage] = useState('');
  const toast = useToast({visibleDuration: 3000, fadeDuration: 300});
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

  const notify = (text: string) => {
    setMessage(text);
    toast.showToast();
  };

  const closeSheet = () => {
    if (!savingRef.current) setSelectedSheet(null);
  };

  const saveProfile = async (changes: ProfileChanges) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    try {
      const latest = await queryClient.fetchQuery({
        ...MY_QUERY_OPTIONS.PROFILE(),
        staleTime: 0,
      });
      if (!latest.data) throw new Error('프로필을 다시 불러와 주세요.');
      const body = buildProfileUpdateRequest(latest.data, changes);
      const saved = await saveMutation.mutateAsync(body);
      if (saved.data) queryClient.setQueryData(QUERY_KEYS.profile.me(), saved);
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.profile.me()});
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.discovery.all});
      setSelectedSheet(null);
      notify('프로필을 저장했어요.');
    } catch (error) {
      notify(getProfileErrorMessage(error, '프로필을 저장하지 못했어요.'));
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.profile.me()});
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

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
    isSaving,
    saveProfile,
    notify,
    message,
    toast,
    selectedSheet,
    openSheet: setSelectedSheet,
    closeSheet,
  };
};
