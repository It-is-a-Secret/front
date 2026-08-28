import {useEffect, useRef, useState} from 'react';

interface UseToastOptions {
  visibleDuration?: number;
  fadeDuration?: number;
}

const DEFAULT_VISIBLE_DURATION = 1800;
const DEFAULT_FADE_DURATION = 1700;

export const useToast = ({
  visibleDuration = DEFAULT_VISIBLE_DURATION,
  fadeDuration = DEFAULT_FADE_DURATION,
}: UseToastOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const visibleTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  const clearToastTimers = () => {
    if (visibleTimerRef.current) {
      window.clearTimeout(visibleTimerRef.current);
    }

    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current);
    }
  };

  useEffect(() => {
    return clearToastTimers;
  }, []);

  const hideToast = () => {
    clearToastTimers();
    setIsVisible(false);
    setIsLeaving(false);
  };

  const showToast = () => {
    clearToastTimers();
    setIsVisible(true);
    setIsLeaving(false);

    visibleTimerRef.current = window.setTimeout(() => {
      setIsLeaving(true);

      fadeTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setIsLeaving(false);
      }, fadeDuration);
    }, visibleDuration);
  };

  return {
    isVisible,
    isLeaving,
    showToast,
    hideToast,
    fadeDuration,
  };
};
