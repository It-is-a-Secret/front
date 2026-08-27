import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {
  INTEREST_STEPS,
  ONBOARDING_STEP_PROGRESS,
  ONBOARDING_STEPS,
} from '@/pages/onboarding/constants/constants';
import type {
  GenderType,
  InterestItem,
  InterestStep,
  MbtiType,
  OnboardingStep,
  SelectedInterests,
} from '@/pages/onboarding/constants/constants';
import {MAX_INTEREST_COUNT} from '@/pages/onboarding/constants/constants';
import {BirthYearStep} from '@/pages/onboarding/steps/BirthYearStep';
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
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('nickname');
  const [nickname, setNickname] = useState('');
  const [selectedGender, setSelectedGender] = useState<GenderType | null>(null);
  const [department, setDepartment] = useState('');
  const [selectedMbti, setSelectedMbti] = useState<MbtiType | null>(null);
  const [selectedInterests, setSelectedInterests] =
    useState<SelectedInterests>({});

  const currentStepIndex = ONBOARDING_STEPS.indexOf(step);
  const isInterestStep = INTEREST_STEPS.includes(step as InterestStep);
  const interestStep = step as InterestStep;
  const interestStepIndex = INTEREST_STEPS.indexOf(interestStep);
  const currentInterestCount =
    isInterestStep ? (selectedInterests[interestStep]?.length ?? 0) : 0;
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
      setStep(nextStep);
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

  const handleToggleInterest = (interestStep: InterestStep, item: InterestItem) => {
    setSelectedInterests((prevSelectedInterests) => {
      const currentItems = prevSelectedInterests[interestStep] ?? [];
      const isSelected = currentItems.includes(item);

      if (isSelected) {
        return {
          ...prevSelectedInterests,
          [interestStep]: currentItems.filter(
            (selectedItem) => selectedItem !== item
          ),
        };
      }

      if (currentItems.length >= MAX_INTEREST_COUNT) {
        return prevSelectedInterests;
      }

      return {
        ...prevSelectedInterests,
        [interestStep]: [...currentItems, item],
      };
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 'gender':
        return (
          <GenderStep
            selectedGender={selectedGender}
            onGenderChange={setSelectedGender}
          />
        );
      case 'birthYear':
        return <BirthYearStep />;
      case 'department':
        return (
          <DepartmentStep
            department={department}
            onDepartmentChange={setDepartment}
          />
        );
      case 'mbti':
        return (
          <MbtiStep
            selectedMbti={selectedMbti}
            onMbtiChange={setSelectedMbti}
          />
        );
      case 'hobby':
        return (
          <HobbyStep
            selectedItems={selectedInterests.hobby ?? []}
            onToggleInterest={(item) => handleToggleInterest('hobby', item)}
          />
        );
      case 'foodStyle':
        return (
          <FoodStyleStep
            selectedItems={selectedInterests.foodStyle ?? []}
            onToggleInterest={(item) => handleToggleInterest('foodStyle', item)}
          />
        );
      case 'lifeStyle':
        return (
          <LifeStyleStep
            selectedItems={selectedInterests.lifeStyle ?? []}
            onToggleInterest={(item) => handleToggleInterest('lifeStyle', item)}
          />
        );
      case 'personalityConversation':
        return (
          <PersonalityConversationStep
            selectedItems={selectedInterests.personalityConversation ?? []}
            onToggleInterest={(item) =>
              handleToggleInterest('personalityConversation', item)
            }
          />
        );
      case 'dateStyle':
        return (
          <DateStyleStep
            selectedItems={selectedInterests.dateStyle ?? []}
            onToggleInterest={(item) => handleToggleInterest('dateStyle', item)}
          />
        );
      case 'contactRelationship':
        return (
          <ContactRelationshipStep
            selectedItems={selectedInterests.contactRelationship ?? []}
            onToggleInterest={(item) =>
              handleToggleInterest('contactRelationship', item)
            }
          />
        );
      case 'pet':
        return (
          <PetStep
            selectedItems={selectedInterests.pet ?? []}
            onToggleInterest={(item) => handleToggleInterest('pet', item)}
          />
        );
      case 'valueInterest':
        return (
          <ValueInterestStep
            selectedItems={selectedInterests.valueInterest ?? []}
            onToggleInterest={(item) =>
              handleToggleInterest('valueInterest', item)
            }
          />
        );
      case 'photoUpload':
        return <PhotoUploadStep />;
      case 'complete':
        return <CompleteOnboardingStep onStart={() => navigate('/home')} />;
      case 'nickname':
      default:
        return (
          <NicknameStep
            nickname={nickname}
            onNicknameChange={setNickname}
          />
        );
    }
  };

  if (step === 'complete') {
    return renderStepContent();
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
    </section>
  );
};
