import type {ReactNode} from 'react';

import {Button} from '@/shared/components/Button';

interface LoginAuthStepProps {
  visualSlot?: ReactNode;
  onKakaoLogin: () => void;
}

export const LoginAuthStep = ({
  visualSlot,
  onKakaoLogin,
}: LoginAuthStepProps) => {
  return (
    <section className='flex min-h-dvh flex-col'>
      <div className='flex flex-1 items-center justify-center'>
        {visualSlot}
      </div>

      <div className='pb-[3.8rem]'>
        <Button
          text='카카오 로그인 하기'
          description='계속 진행 시 이용약관·개인정보 처리방침에 동의합니다'
          onClick={onKakaoLogin}
        />
      </div>
    </section>
  );
};
