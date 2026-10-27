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
import {
  ONBOARDING_QUERY_OPTIONS,
  issuePresignedUrls,
  saveImages,
} from '@/pages/onboarding/api/query';
import type {SaveImagesResponse} from '@/pages/onboarding/api/type';
import {
  BLUR_STRENGTHS,
  type BlurStrength,
} from '@/pages/onboarding/constants/constants';
import type {PhotoSlot} from '@/pages/onboarding/hooks/usePhotoUploadSlots';
import {
  buildBlurUpdateRequest,
  saveProfilePhotos,
} from '@/pages/my/model/profile-images';
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
  const imagesQuery = useQuery({
    ...ONBOARDING_QUERY_OPTIONS.IMAGES(),
    refetchInterval: (query) =>
      !isSaving &&
      query.state.data?.data?.images?.some(
        (image) => image.processingStatus === 'PROCESSING'
      )
        ? 2000
        : false,
  });
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

  const saveImageChanges = async (
    save: () => Promise<SaveImagesResponse>,
    successMessage = '사진을 저장했어요.'
  ) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    try {
      const saved = await save();
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.onboarding.images(),
      });
      const images = saved.data?.images;
      if (images) {
        queryClient.setQueryData(QUERY_KEYS.onboarding.images(), {
          ...saved,
          data: {
            images,
            reuploadRequired: images.some(
              (image) => image.processingStatus === 'FAILED'
            ),
          },
        });
      }
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.onboarding.images(),
      });
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.discovery.all});
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.profile.all});
      setSelectedSheet(null);
      notify(successMessage);
    } catch (error) {
      notify(getProfileErrorMessage(error, '사진을 저장하지 못했어요.'));
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const savePhotos = (slots: PhotoSlot[]) => {
    const defaultLevel =
      BLUR_STRENGTHS.find((level) => level === photos[0]?.blurLevel) ?? 70;
    return saveImageChanges(() =>
      saveProfilePhotos(slots, defaultLevel, {issuePresignedUrls, saveImages})
    );
  };

  const saveBlur = (strength: BlurStrength) =>
    saveImageChanges(async () => {
      const latest = await queryClient.fetchQuery({
        ...ONBOARDING_QUERY_OPTIONS.IMAGES(),
        staleTime: 0,
      });
      if (!latest.data?.images)
        throw new Error('사진 정보를 다시 불러와 주세요.');
      return saveImages(
        buildBlurUpdateRequest(getProfilePhotos(latest.data.images), strength)
      );
    }, '블러 강도가 재설정되었어요.');

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
    savePhotos,
    saveBlur,
    notify,
    message,
    toast,
    selectedSheet,
    openSheet: setSelectedSheet,
    closeSheet,
  };
};
