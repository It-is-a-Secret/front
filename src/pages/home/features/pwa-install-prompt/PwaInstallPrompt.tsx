import {useCallback, useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';

import {PwaInstallBottomSheet} from '@/pages/home/components/PwaInstallBottomSheet';
import {usePwaInstallPrompt} from '@/pages/home/hooks/usePwaInstallPrompt';
import {MY_QUERY_OPTIONS} from '@/pages/my/api/query';

interface PwaInstallPromptProps {
  onReady?: () => void;
  deferOpening?: boolean;
}

const EligiblePwaInstallPrompt = ({onReady}: PwaInstallPromptProps) => {
  const navigate = useNavigate();
  const {isOpen, platform, handleDismiss} = usePwaInstallPrompt();

  useEffect(() => {
    if (!isOpen || platform === 'unknown') onReady?.();
  }, [isOpen, platform, onReady]);

  return (
    <PwaInstallBottomSheet
      open={isOpen}
      platform={platform}
      onInstall={() => {
        handleDismiss();
        navigate('/install-guide', {state: {fromInstallPrompt: true, platform}});
      }}
      onClose={handleDismiss}
      onOpenAutoFocus={onReady}
    />
  );
};

export const PwaInstallPrompt = ({
  onReady,
  deferOpening = false,
}: PwaInstallPromptProps) => {
  const profileQuery = useQuery(MY_QUERY_OPTIONS.PROFILE());
  const [hasStartedEligiblePrompt, setHasStartedEligiblePrompt] =
    useState(false);
  const isEligible =
    profileQuery.data?.data?.registrationStatus === 'COMPLETED';
  const handleEligiblePromptReady = useCallback(() => {
    setHasStartedEligiblePrompt(true);
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (!profileQuery.isPending && !isEligible) onReady?.();
  }, [profileQuery.isPending, isEligible, onReady]);

  // 위쪽 모달이 열린 뒤 프로필 재조회가 성공해도 새 시트는 그 아래에 열지 않습니다.
  // 이미 시작한 시트는 유지해 모달을 닫았을 때 그대로 이어서 사용할 수 있습니다.
  if (!hasStartedEligiblePrompt && (!isEligible || deferOpening)) return null;

  return <EligiblePwaInstallPrompt onReady={handleEligiblePromptReady} />;
};
