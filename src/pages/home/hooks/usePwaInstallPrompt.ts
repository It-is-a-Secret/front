import {useState} from 'react';

import {
  detectPwaPlatform,
  isRunningStandalone,
  PWA_PROMPT_DISMISSED_AT_KEY,
  savePwaPromptDismissedAt,
  shouldShowPwaPrompt,
} from '@/pages/home/model/pwa-install-prompt';

type NavigatorWithStandalone = Navigator & {standalone?: boolean};

export const usePwaInstallPrompt = () => {
  const platform = detectPwaPlatform(
    navigator.userAgent,
    navigator.maxTouchPoints
  );
  const [isOpen, setIsOpen] = useState(
    () =>
      platform !== 'unknown' &&
      shouldShowPwaPrompt({
        standalone: isRunningStandalone(
          window.matchMedia('(display-mode: standalone)').matches,
          (navigator as NavigatorWithStandalone).standalone
        ),
        readDismissedAt: () =>
          localStorage.getItem(PWA_PROMPT_DISMISSED_AT_KEY),
      })
  );

  const handleDismiss = () => {
    savePwaPromptDismissedAt((key, value) => localStorage.setItem(key, value));
    setIsOpen(false);
  };

  return {isOpen, platform, handleDismiss};
};
