import {useQuery} from '@tanstack/react-query';

import {PwaInstallBottomSheet} from '@/pages/home/components/PwaInstallBottomSheet';
import {usePwaInstallPrompt} from '@/pages/home/hooks/usePwaInstallPrompt';
import {MY_QUERY_OPTIONS} from '@/pages/my/api/query';

const EligiblePwaInstallPrompt = () => {
  const {isOpen, platform, handleDismiss} = usePwaInstallPrompt();

  return (
    <PwaInstallBottomSheet
      open={isOpen}
      platform={platform}
      onClose={handleDismiss}
    />
  );
};

export const PwaInstallPrompt = () => {
  const profileQuery = useQuery(MY_QUERY_OPTIONS.PROFILE());

  if (profileQuery.data?.data?.registrationStatus !== 'COMPLETED') return null;

  return <EligiblePwaInstallPrompt />;
};
