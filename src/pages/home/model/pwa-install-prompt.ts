export type PwaPlatform = 'ios' | 'android' | 'desktop' | 'unknown';

export const PWA_PROMPT_DISMISSED_AT_KEY = 'blursome:pwa-prompt-dismissed-at';
export const PWA_PROMPT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const detectPwaPlatform = (
  userAgent: string,
  maxTouchPoints = 0
): PwaPlatform => {
  if (/Android/i.test(userAgent)) return 'android';

  const isIpadOs = /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/i.test(userAgent) || isIpadOs) return 'ios';

  if (/Windows NT|Macintosh|X11|Linux/i.test(userAgent)) return 'desktop';

  return 'unknown';
};

export const isRunningStandalone = (
  standaloneDisplay: boolean,
  iosStandalone?: boolean
) => standaloneDisplay || iosStandalone === true;

interface PwaPromptPolicy {
  standalone: boolean;
  readDismissedAt: () => string | null;
  now?: number;
}

export const shouldShowPwaPrompt = ({
  standalone,
  readDismissedAt,
  now = Date.now(),
}: PwaPromptPolicy) => {
  if (standalone) return false;

  try {
    const savedValue = readDismissedAt();
    if (savedValue === null) return true;

    const dismissedAt = Number(savedValue);
    if (!Number.isFinite(dismissedAt) || dismissedAt <= 0) return true;

    return now - dismissedAt >= PWA_PROMPT_COOLDOWN_MS;
  } catch {
    return true;
  }
};

export const savePwaPromptDismissedAt = (
  writeDismissedAt: (key: string, value: string) => void,
  now = Date.now()
) => {
  try {
    writeDismissedAt(PWA_PROMPT_DISMISSED_AT_KEY, String(now));
  } catch {
    // 저장소를 사용할 수 없어도 현재 안내창은 닫을 수 있습니다.
  }
};
