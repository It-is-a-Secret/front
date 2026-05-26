import {AuthInput} from '@/pages/auth/components/AuthInput';
import {AuthTextarea} from '@/pages/auth/components/AuthTextarea';
import {AUTH_MOCK} from '@/pages/auth/mocks/mock';
import {Button} from '@/shared/components/Button';

interface CodeAuthStepProps {
  email: string;
  code: string;
  onCodeChange: (code: string) => void;
  onConfirm: () => void;
  onResend: () => void;
}

export const CodeAuthStep = ({
  email,
  code,
  onCodeChange,
  onConfirm,
  onResend,
}: CodeAuthStepProps) => {
  return (
    <>
      <div className='mt-[3rem]'>
        <AuthTextarea type='code' email={email} />
      </div>

      <div className='mt-[1rem] flex justify-center'>
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
    </>
  );
};
