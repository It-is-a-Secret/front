import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {
  clearPhotoBlurNoticeState,
  readPhotoBlurNoticeState,
} from '@/pages/home/model/photo-blur-notice';

export const usePhotoBlurNotice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() =>
    readPhotoBlurNoticeState(location.state)
  );

  const handleDismiss = () => {
    setIsOpen(false);
    void navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      {
        replace: true,
        state: clearPhotoBlurNoticeState(location.state),
      }
    );
  };

  return {isOpen, handleDismiss};
};
