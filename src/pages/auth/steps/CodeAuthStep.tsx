import {AuthInput} from '@/pages/auth/components/AuthInput';
import {AuthTextarea} from '@/pages/auth/components/AuthTextarea';
import {AUTH_MOCK, AUTH_STEP_PROGRESS} from '@/pages/auth/mocks/mock';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface CodeAuthStepProps {
  email: string;
  code: string;
  onCodeChange: (code: string) => void;
  onConfirm: () => void;
  onResend: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export const CodeAuthStep = ({
  email,
  code,
  onCodeChange,
  onConfirm,
  onResend,
  onSkip,
  onBack,
}: CodeAuthStepProps) => {
  return (
    <section className='flex min-h-dvh flex-col'>
      <Header
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-400' />
        }
        onClickLeft={onBack}
        rightItem={
          <span className='text-caption1-12r text-gray-400'>건너뛰기</span>
        }
        onClickRight={onSkip}
        hasProgress
        progress={AUTH_STEP_PROGRESS.code}
      />

      <div className='mt-[3rem]'>
        <AuthTextarea type='code' email={email} />
      </div>

      <div className='mt-[1rem]'>
        <AuthInput
          value={code}
          onChange={onCodeChange}
          expireSeconds={AUTH_MOCK.expireSeconds}
          attemptCount={AUTH_MOCK.attemptCount}
          maxAttemptCount={AUTH_MOCK.maxAttemptCount}
        />
      </div>

      <div className='mt-auto flex flex-col pb-[3.8rem]'>
        <button
          type='button'
          className='text-button1-14b w-full rounded-[20px] border border-gray-200 bg-transparent p-[1.55rem] text-gray-600'
          onClick={onResend}>
          인증 코드 재발송
        </button>
        <Button text='확인' disabled={code.length !== 6} onClick={onConfirm} />
      </div>
    </section>
  );
};
