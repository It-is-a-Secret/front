import {useEffect, useState} from 'react';

interface UseCountdownOptions {
  initialSeconds: number;
  enabled?: boolean;
  onExpire?: () => void;
}

export const useCountdown = ({
  initialSeconds,
  enabled = true,
  onExpire,
}: UseCountdownOptions) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!enabled || secondsLeft <= 0) {
      if (secondsLeft === 0) {
        onExpire?.();
      }

      return;
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((prevSeconds) => Math.max(prevSeconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [enabled, onExpire, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  const reset = () => {
    setSecondsLeft(initialSeconds);
  };

  return {
    secondsLeft,
    formattedTime,
    isExpired: secondsLeft === 0,
    reset,
  };
};
