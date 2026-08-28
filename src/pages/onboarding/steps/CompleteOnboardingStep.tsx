import {Button} from '@/shared/components/Button';
import {EmptyState} from '@/shared/components/EmptyState';

interface CompleteOnboardingStepProps {
  onStart: () => void;
}

export const CompleteOnboardingStep = ({
  onStart,
}: CompleteOnboardingStepProps) => {
  return (
    <section className='flex min-h-dvh flex-col'>
      <div className='flex flex-1 flex-col items-center justify-center'>
        <EmptyState
          image={<img src='completeOnboarding.png' alt='' />}
          title='준비 완료!'
          highlightTitle='이제 만나러 가볼까요?'
          description={'당신과 어울리는 사람을\nBlurSome이 골라드릴게요'}
        />
      </div>

      <div className='pb-[3.8rem]'>
        <Button text='시작하기' onClick={onStart} />
      </div>
    </section>
  );
};
