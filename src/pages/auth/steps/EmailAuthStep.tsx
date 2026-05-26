import {AuthTextarea} from '@/pages/auth/components/AuthTextarea';
import {AUTH_EMAIL_DOMAIN} from '@/pages/auth/mocks/mock';
import {Button} from '@/shared/components/Button';
import {Input} from '@/shared/components/Input';

interface EmailAuthStepProps {
  emailId: string;
  onEmailIdChange: (emailId: string) => void;
  onSubmit: () => void;
}

export const EmailAuthStep = ({
  emailId,
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
      </div>

      <div className='mt-auto pb-[3.8rem]'>
        <Button
          text='인증 코드 발송'
          description='발송 후 10분 이내 입력 / 1일 5회 제한'
          disabled={!emailId.trim()}
          onClick={onSubmit}
        />
      </div>
    </>
  );
};
