import {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {PhotoBlurNoticeModal} from '@/pages/home/components/PhotoBlurNoticeModal';
import {PwaInstallBottomSheet} from '@/pages/home/components/PwaInstallBottomSheet';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {Button} from '@/shared/components/Button';
import {useToast} from '@/shared/hooks/useToast';

export const PhotoFeedbackPreview = () => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement | null>(null);
  const [isInstallOpen, setIsInstallOpen] = useState(true);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const toast = useToast({visibleDuration: 3000, fadeDuration: 300});

  const showNotice = () => {
    if (isInstallOpen) setIsNoticeOpen(true);
    else setIsInstallOpen(true);
  };

  return (
    <main
      ref={mainRef}
      tabIndex={-1}
      className='flex min-h-dvh flex-col gap-[2rem] px-[2rem] py-[4rem] outline-none'>
      <h1 className='text-bold-20 text-gray-800'>사진 처리 안내 미리보기</h1>
      <p className='text-body1-15r text-gray-600'>
        모달의 ‘확인했어요’, 설치 안내의 ‘나중에 할게요’를 누르면 아래 버튼으로
        다시 확인할 수 있어요.
      </p>
      <Button text='안내 모달 다시 보기' onClick={showNotice} />
      <div className='mt-[2rem]'>
        <Button
          text='채팅 시작하기'
          description='처리 중일 때 표시되는 토스트를 확인해 보세요'
          onClick={toast.showToast}
        />
      </div>
      <PwaInstallBottomSheet
        open={isInstallOpen}
        platform='android'
        onInstall={() =>
          navigate('/install-guide', {
            state: {fromInstallPrompt: true, platform: 'android'},
          })
        }
        onClose={() => setIsInstallOpen(false)}
        onOpenAutoFocus={() => setIsNoticeOpen(true)}
      />
      <PhotoBlurNoticeModal
        open={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        fallbackFocusRef={mainRef}
      />
      {toast.isVisible && (
        <div
          className={`pointer-events-none fixed right-[2rem] bottom-[3.6rem] left-[2rem] z-[80] mx-auto max-w-[39rem] transition-opacity ${toast.isLeaving ? 'opacity-0' : 'opacity-100'}`}
          style={{transitionDuration: `${toast.fadeDuration}ms`}}>
          <ToastMessage message='사진 블러 처리 중이에요. 조금만 기다려 주세요.' />
        </div>
      )}
    </main>
  );
};
