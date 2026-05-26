import {Button} from '@/shared/components/Button';

interface CompleteOnboardingStepProps {
  onStart: () => void;
}

export const CompleteOnboardingStep = ({
  onStart,
}: CompleteOnboardingStepProps) => {
  return (
    <section className='flex min-h-dvh flex-col'>
      <div className='flex flex-1 flex-col items-center justify-center'>
        <img src='complete.png' alt='' className='mb-[2.4rem]' />

        <div className='flex flex-col items-center text-center'>
          <h1 className='text-title-22b mb-[1.6rem] whitespace-pre-line text-gray-800'>
            {'준비 완료!\n'}
            <span className='text-primary'>이제 만나러 가볼까요?</span>
          </h1>

          <p className='text-caption1-12r whitespace-pre-line text-gray-600'>
            {'당신과 어울리는 사람을\nBlurSome이 골라드릴게요'}
          </p>
        </div>
      </div>

      <div className='pb-[3.8rem]'>
        <Button text='시작하기' onClick={onStart} />
      </div>
    </section>
  );
};
