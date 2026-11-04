import {useRef, useState} from 'react';

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';

import {MY_MUTATION_OPTIONS} from '@/pages/my/api/query';
import type {GetMyProfileResponse} from '@/pages/my/api/type';
import {getProfileErrorMessage} from '@/pages/my/model/profile-edit';
import {clearOnboardingDraft} from '@/pages/onboarding/model/onboarding-draft-storage';
import {QUERY_KEYS} from '@/shared/api';
import {clearAccessToken} from '@/shared/api/config/auth-token';
import {useToast} from '@/shared/hooks/useToast';

export const useWithdrawal = (onClose: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(MY_MUTATION_OPTIONS.WITHDRAW());
  const submittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toast = useToast({visibleDuration: 3000, fadeDuration: 300});

  const submit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    toast.hideToast();
    const memberId = queryClient.getQueryData<GetMyProfileResponse>(
      QUERY_KEYS.profile.me()
    )?.data?.id;
    try {
      await mutation.mutateAsync();
    } catch (error) {
      setErrorMessage(
        getProfileErrorMessage(
          error,
          '회원 탈퇴에 실패했어요. 다시 시도해 주세요.'
        )
      );
      toast.showToast();
      submittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    // Cleanup failures must not turn a successful withdrawal into another DELETE.
    await Promise.allSettled([
      queryClient.cancelQueries(),
      ...(memberId !== undefined ? [clearOnboardingDraft(memberId)] : []),
      Promise.resolve().then(clearAccessToken),
    ]);
    queryClient.clear();
    navigate('/auth', {replace: true});
  };

  return {
    submit,
    isSubmitting,
    errorMessage,
    toast,
    close: () => {
      if (!submittingRef.current) onClose();
    },
  };
};
