import {AuthTextarea} from '@/pages/auth/components/AuthTextarea';
import {AUTH_EMAIL_DOMAIN, AUTH_STEP_PROGRESS} from '@/pages/auth/mocks/mock';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {Input} from '@/shared/components/Input';
import {IcSvgLeft} from '@/shared/icons';

interface EmailAuthStepProps {
  emailId: string;
  onEmailIdChange: (emailId: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export const EmailAuthStep = ({
  emailId,
  onEmailIdChange,
  onSubmit,
  onSkip,
  onBack,
}: EmailAuthStepProps) => {
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
        progress={AUTH_STEP_PROGRESS.email}
      />

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
    </section>
  );
};
