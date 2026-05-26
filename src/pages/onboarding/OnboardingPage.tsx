import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {
  ONBOARDING_STEP_PROGRESS,
  ONBOARDING_STEPS,
} from '@/pages/onboarding/constants/constants';
import type {
  MbtiType,
  OnboardingStep,
} from '@/pages/onboarding/constants/constants';
import {BirthYearStep} from '@/pages/onboarding/steps/BirthYearStep';
import {CategoryStep} from '@/pages/onboarding/steps/CategoryStep';
import {DepartmentStep} from '@/pages/onboarding/steps/DepartmentStep';
import {MbtiStep} from '@/pages/onboarding/steps/MbtiStep';
import {NicknameStep} from '@/pages/onboarding/steps/NicknameStep';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('nickname');
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedMbti, setSelectedMbti] = useState<MbtiType | null>(null);

  const currentStepIndex = ONBOARDING_STEPS.indexOf(step);
  const isNextDisabled =
    (step === 'nickname' && nickname.length === 0) ||
    (step === 'department' && department.length === 0) ||
    (step === 'mbti' && !selectedMbti);

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

  const renderStepContent = () => {
    switch (step) {
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
      case 'category':
        return <CategoryStep />;
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
          <Button text='다음' disabled={isNextDisabled} onClick={handleNext} />
        </div>
      </div>
    </section>
  );
};
