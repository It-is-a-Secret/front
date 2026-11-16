import {Button} from '@/shared/components/Button';

interface LoginAuthStepProps {
  onKakaoLogin: () => void;
}

export const LoginAuthStep = ({onKakaoLogin}: LoginAuthStepProps) => {
  return (
    <section className="-mx-[2rem] flex min-h-dvh flex-col bg-[url('/auth-background.png')] bg-cover bg-center px-[2rem]">
      <div className='flex flex-1 items-center justify-center'>
        <img
          src='/auth-logo.png'
          alt='BlurSome, 흐릿하게 시작되어 선명해지는 인연'
          width={375}
          height={375}
          className='w-full max-w-[37.5rem]'
        />
      </div>

      <div className='pb-[calc(3.8rem+env(safe-area-inset-bottom))]'>
        <Button
          text='카카오 로그인 하기'
          description='계속 진행 시 이용약관·개인정보 처리방침에 동의합니다'
          onClick={onKakaoLogin}
        />
      </div>
    </section>
  );
};
