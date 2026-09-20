import {AuthInput} from '@/pages/auth/components/AuthInput';
import {AuthTextarea} from '@/pages/auth/components/AuthTextarea';
import {AUTH_MOCK} from '@/pages/auth/mocks/mock';
import {Button} from '@/shared/components/Button';
import {FieldErrorMessage} from '@/shared/components/FieldErrorMessage';

interface CodeAuthStepProps {
  email: string;
  code: string;
  errorMessage?: string;
  isPending?: boolean;
  onCodeChange: (code: string) => void;
  onConfirm: () => void;
  onResend: () => void;
}

export const CodeAuthStep = ({
  email,
  code,
  errorMessage,
  isPending = false,
  onCodeChange,
  onConfirm,
  onResend,
}: CodeAuthStepProps) => {
  return (
    <>
      <div className='mt-[3rem]'>
        <AuthTextarea type='code' email={email} />
      </div>

      <div className='mt-[1rem] flex flex-col items-center'>
        <AuthInput
          value={code}
          onChange={onCodeChange}
          expireSeconds={AUTH_MOCK.expireSeconds}
          attemptCount={AUTH_MOCK.attemptCount}
          maxAttemptCount={AUTH_MOCK.maxAttemptCount}
          disabled={isPending}
        />
        {errorMessage && (
          <FieldErrorMessage
            message={errorMessage}
            className='mt-[1.2rem] justify-center'
          />
        )}
      </div>

      <div className='mt-auto flex flex-col gap-[0.8rem] pb-[3.8rem]'>
        <button
          type='button'
          className='text-button1-14b border-primary text-primary w-full rounded-[20px] border bg-transparent p-[1.55rem]'
          disabled={isPending}
          onClick={onResend}>
          인증 코드 재발송
        </button>
        <Button
          text={isPending ? '확인 중...' : '확인'}
          disabled={code.length !== 6 || isPending}
          onClick={onConfirm}
        />
      </div>
    </>
  );
};
