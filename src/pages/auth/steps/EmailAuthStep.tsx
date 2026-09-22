import {AuthTextarea} from '@/pages/auth/components/AuthTextarea';
import {AUTH_EMAIL_DOMAIN} from '@/pages/auth/mocks/mock';
import {Button} from '@/shared/components/Button';
import {FieldErrorMessage} from '@/shared/components/FieldErrorMessage';
import {Input} from '@/shared/components/Input';

interface EmailAuthStepProps {
  emailId: string;
  errorMessage?: string;
  isPending?: boolean;
  onEmailIdChange: (emailId: string) => void;
  onSubmit: () => void;
}

export const EmailAuthStep = ({
  emailId,
  errorMessage,
  isPending = false,
  onEmailIdChange,
  onSubmit,
}: EmailAuthStepProps) => {
  return (
    <>
      <div className='mt-[3rem]'>
        <AuthTextarea type='email' />
      </div>

      <div className='mt-[1.2rem]'>
        <Input
          value={emailId}
          onChange={(event) => onEmailIdChange(event.target.value)}
          placeholder='ex) abcde'
          isError={Boolean(errorMessage)}
          disabled={isPending}
          rightItem={
            <span
              className={`text-input1-14r ${
                emailId
                  ? 'text-gray-800'
                  : 'text-gray-400 group-focus-within:text-gray-800'
              }`}>
              {AUTH_EMAIL_DOMAIN}
            </span>
          }
        />
        {errorMessage && (
          <FieldErrorMessage
            message={errorMessage}
            className='mt-[0.8rem] px-[0.4rem]'
          />
        )}
      </div>

      <div className='mt-auto pb-[3.8rem]'>
        <Button
          text={isPending ? '발송 중...' : '인증 코드 발송'}
          description='발송 후 10분 이내 입력 / 1일 5회 제한'
          disabled={!emailId.trim() || isPending}
          onClick={onSubmit}
        />
      </div>
    </>
  );
};
