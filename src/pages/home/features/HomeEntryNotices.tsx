import {useCallback, useState, type RefObject} from 'react';

import {PhotoBlurNoticeModal} from '@/pages/home/components/PhotoBlurNoticeModal';
import {PwaInstallPrompt} from '@/pages/home/features/pwa-install-prompt/PwaInstallPrompt';
import {usePhotoBlurNotice} from '@/pages/home/hooks/usePhotoBlurNotice';

interface HomeEntryNoticesProps {
  fallbackFocusRef: RefObject<HTMLElement | null>;
}

export const HomeEntryNotices = ({fallbackFocusRef}: HomeEntryNoticesProps) => {
  const {isOpen, handleDismiss} = usePhotoBlurNotice();
  const [isInstallPromptReady, setIsInstallPromptReady] = useState(false);
  const handleInstallPromptReady = useCallback(() => {
    setIsInstallPromptReady(true);
  }, []);

  return (
    <>
      <PwaInstallPrompt
        onReady={handleInstallPromptReady}
        deferOpening={isOpen && isInstallPromptReady}
      />
      {/* 시트의 포커스 처리가 끝난 뒤 열어 모달을 최상위 레이어로 유지합니다. */}
      <PhotoBlurNoticeModal
        open={isOpen && isInstallPromptReady}
        onClose={handleDismiss}
        fallbackFocusRef={fallbackFocusRef}
      />
    </>
  );
};
