import {useEffect, useRef} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';

import {
  INTEREST_STEPS,
  ONBOARDING_STEP_PROGRESS,
  ONBOARDING_STEPS,
} from '@/pages/onboarding/constants/constants';
import type {InterestStep} from '@/pages/onboarding/constants/constants';
import {useOnboardingDraft} from '@/pages/onboarding/hooks/useOnboardingDraft';
import {BirthYearStep} from '@/pages/onboarding/steps/BirthYearStep';
import {BlurStrengthStep} from '@/pages/onboarding/steps/BlurStrengthStep';
import {CompleteOnboardingStep} from '@/pages/onboarding/steps/CompleteOnboardingStep';
import {ContactRelationshipStep} from '@/pages/onboarding/steps/ContactRelationshipStep';
import {DateStyleStep} from '@/pages/onboarding/steps/DateStyleStep';
import {DepartmentStep} from '@/pages/onboarding/steps/DepartmentStep';
import {FoodStyleStep} from '@/pages/onboarding/steps/FoodStyleStep';
import {GenderStep} from '@/pages/onboarding/steps/GenderStep';
import {HobbyStep} from '@/pages/onboarding/steps/HobbyStep';
import {LifeStyleStep} from '@/pages/onboarding/steps/LifeStyleStep';
import {MbtiStep} from '@/pages/onboarding/steps/MbtiStep';
import {NicknameStep} from '@/pages/onboarding/steps/NicknameStep';
import {PersonalityConversationStep} from '@/pages/onboarding/steps/PersonalityConversationStep';
import {PetStep} from '@/pages/onboarding/steps/PetStep';
import {PhotoUploadStep} from '@/pages/onboarding/steps/PhotoUploadStep';
import {ValueInterestStep} from '@/pages/onboarding/steps/ValueInterestStep';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {MY_QUERY_OPTIONS} from '@/pages/my/api/query';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {useToast} from '@/shared/hooks/useToast';
import {IcSvgLeft} from '@/shared/icons';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const profileQuery = useQuery({
    ...MY_QUERY_OPTIONS.PROFILE(),
    refetchOnMount: 'always',
  });
  const memberId =
    profileQuery.isFetchedAfterMount && !profileQuery.isError
      ? profileQuery.data?.data?.id
      : undefined;
  const {
    draft,
    isReady,
    restoreError,
    saveError,
    photoRestoreError,
    retryRestore,
    updateDraft,
    toggleInterest,
    changePhoto,
    removePhoto,
    sortPhotos,
  } = useOnboardingDraft(memberId);
  const lastShownToastMessageRef = useRef<string | null>(null);
  const {
    isVisible: isToastVisible,
    isLeaving: isToastLeaving,
    showToast,
    fadeDuration,
  } = useToast({visibleDuration: 3000, fadeDuration: 300});
  const errorToastMessage = photoRestoreError
    ? '사진을 복원하지 못했어요. 사진 단계에서 다시 선택해 주세요.'
    : saveError
      ? '진행 내용을 저장하지 못했어요. 다시 시도해 주세요.'
      : null;

  useEffect(() => {
    if (!isReady || !errorToastMessage) {
      lastShownToastMessageRef.current = null;
      return;
    }

    if (lastShownToastMessageRef.current !== errorToastMessage) {
      lastShownToastMessageRef.current = errorToastMessage;
      showToast();
    }
  }, [isReady, errorToastMessage, showToast]);

  const {
    step,
    nickname,
    selectedGender,
    birthYear,
    department,
    selectedMbti,
    selectedInterests,
    blurStrength,
    photoSlots,
  } = draft;

  const currentStepIndex = ONBOARDING_STEPS.indexOf(step);
  const isInterestStep = INTEREST_STEPS.includes(step as InterestStep);
  const interestStep = step as InterestStep;
  const interestStepIndex = INTEREST_STEPS.indexOf(interestStep);
  const currentInterestCount = isInterestStep
    ? (selectedInterests[interestStep]?.length ?? 0)
    : 0;
  const isNextDisabled =
    (step === 'nickname' && nickname.length === 0) ||
    (step === 'gender' && !selectedGender) ||
    (step === 'department' && department.length === 0) ||
    (step === 'mbti' && !selectedMbti) ||
    (isInterestStep && currentInterestCount === 0);
  const nextButtonText = isInterestStep
    ? `다음 (${interestStepIndex + 1}/${INTEREST_STEPS.length})`
    : '다음';

  const moveStep = (nextIndex: number) => {
    const nextStep = ONBOARDING_STEPS[nextIndex];

    if (nextStep) {
      updateDraft('step', nextStep);
    }
  };

  const handleBack = () => {
    if (currentStepIndex === 0) {
      navigate(-1);
      return;
    }

    moveStep(currentStepIndex - 1);
  };

  const handleNext = () => {
    moveStep(currentStepIndex + 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'gender':
        return (
          <GenderStep
            selectedGender={selectedGender}
            onGenderChange={(gender) => updateDraft('selectedGender', gender)}
          />
        );
      case 'birthYear':
        return (
          <BirthYearStep
            birthYear={birthYear}
            onBirthYearChange={(year) => updateDraft('birthYear', year)}
          />
        );
      case 'department':
        return (
          <DepartmentStep
            department={department}
            onDepartmentChange={(value) => updateDraft('department', value)}
          />
        );
      case 'mbti':
        return (
          <MbtiStep
            selectedMbti={selectedMbti}
            onMbtiChange={(mbti) => updateDraft('selectedMbti', mbti)}
          />
        );
      case 'hobby':
        return (
          <HobbyStep
            selectedItems={selectedInterests.hobby ?? []}
            onToggleInterest={(item) => toggleInterest('hobby', item)}
          />
        );
      case 'foodStyle':
        return (
          <FoodStyleStep
            selectedItems={selectedInterests.foodStyle ?? []}
            onToggleInterest={(item) => toggleInterest('foodStyle', item)}
          />
        );
      case 'lifeStyle':
        return (
          <LifeStyleStep
            selectedItems={selectedInterests.lifeStyle ?? []}
            onToggleInterest={(item) => toggleInterest('lifeStyle', item)}
          />
        );
      case 'personalityConversation':
        return (
          <PersonalityConversationStep
            selectedItems={selectedInterests.personalityConversation ?? []}
            onToggleInterest={(item) =>
              toggleInterest('personalityConversation', item)
            }
          />
        );
      case 'dateStyle':
        return (
          <DateStyleStep
            selectedItems={selectedInterests.dateStyle ?? []}
            onToggleInterest={(item) => toggleInterest('dateStyle', item)}
          />
        );
      case 'contactRelationship':
        return (
          <ContactRelationshipStep
            selectedItems={selectedInterests.contactRelationship ?? []}
            onToggleInterest={(item) =>
              toggleInterest('contactRelationship', item)
            }
          />
        );
      case 'pet':
        return (
          <PetStep
            selectedItems={selectedInterests.pet ?? []}
            onToggleInterest={(item) => toggleInterest('pet', item)}
          />
        );
      case 'valueInterest':
        return (
          <ValueInterestStep
            selectedItems={selectedInterests.valueInterest ?? []}
            onToggleInterest={(item) => toggleInterest('valueInterest', item)}
          />
        );
      case 'blurStrength':
        return (
          <BlurStrengthStep
            blurStrength={blurStrength}
            onBlurStrengthChange={(strength) =>
              updateDraft('blurStrength', strength)
            }
          />
        );
      case 'photoUpload':
        return (
          <PhotoUploadStep
            photoSlots={photoSlots}
            onPhotoChange={changePhoto}
            onPhotoRemove={removePhoto}
            onPhotoSort={sortPhotos}
          />
        );
      case 'complete':
        return <CompleteOnboardingStep onStart={() => navigate('/home')} />;
      case 'nickname':
      default:
        return (
          <NicknameStep
            nickname={nickname}
            onNicknameChange={(value) => updateDraft('nickname', value)}
          />
        );
    }
  };

  if (profileQuery.isError || (profileQuery.isFetchedAfterMount && !memberId)) {
    return (
      <section className='flex min-h-dvh flex-col items-center justify-center gap-[1.6rem] px-[2rem]'>
        <p role='alert' className='text-body1-15r text-gray-800'>
          회원 정보를 불러오지 못했어요.
        </p>
        <Button text='다시 시도' onClick={() => void profileQuery.refetch()} />
      </section>
    );
  }

  if (restoreError) {
    return (
      <section className='flex min-h-dvh flex-col items-center justify-center gap-[1.6rem] px-[2rem]'>
        <p role='alert' className='text-body1-15r text-gray-800'>
          진행 내용을 불러오지 못했어요.
        </p>
        <Button text='다시 시도' onClick={retryRestore} />
      </section>
    );
  }

  if (!isReady) {
    return <section className='min-h-dvh' aria-label='온보딩 불러오는 중' />;
  }

  const errorToast = isToastVisible && errorToastMessage && (
    <div
      className={`fixed right-[2rem] bottom-[8.2rem] left-[2rem] z-[60] mx-auto max-w-[35rem] transition-opacity ${
        isToastLeaving ? 'opacity-0' : 'opacity-100'
      }`}
      style={{transitionDuration: `${fadeDuration}ms`}}>
      <ToastMessage message={errorToastMessage} />
    </div>
  );

  if (step === 'complete') {
    return (
      <>
        {renderStepContent()}
        {errorToast}
      </>
    );
  }

  return (
    <section className='flex min-h-dvh flex-col'>
      <Header
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-400' />
        }
        onClickLeft={handleBack}
        rightItem={
          <span className='text-caption1-12r text-gray-400'>건너뛰기</span>
        }
        onClickRight={() => moveStep(ONBOARDING_STEPS.length - 1)}
        hasProgress
        progress={ONBOARDING_STEP_PROGRESS[step]}
      />

      <div className='flex flex-1 flex-col'>
        <div className='flex-1'>{renderStepContent()}</div>

        <div className='pb-[2rem]'>
          <Button
            text={nextButtonText}
            disabled={isNextDisabled}
            onClick={handleNext}
          />
        </div>
      </div>

      {errorToast}
    </section>
  );
};
