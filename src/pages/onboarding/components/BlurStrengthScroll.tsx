import {useEffect, useRef} from 'react';

import {
  BLUR_STRENGTHS,
  type BlurStrength,
} from '@/pages/onboarding/constants/constants';

interface BlurStrengthScrollProps {
  value?: BlurStrength;
  onChange: (strength: BlurStrength) => void;
  disabled?: boolean;
}

const ITEM_HEIGHT = 60;
const SCROLL_HEIGHT = 300;
const CENTER_PADDING = (SCROLL_HEIGHT - ITEM_HEIGHT) / 2;

export const BlurStrengthScroll = ({
  value,
  onChange,
  disabled = false,
}: BlurStrengthScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const didInitScrollRef = useRef(false);

  useEffect(() => {
    if (didInitScrollRef.current) {
      return;
    }

    const selectedIndex =
      value === undefined ? -1 : BLUR_STRENGTHS.indexOf(value);

    if (selectedIndex < 0) {
      return;
    }

    didInitScrollRef.current = true;
    scrollRef.current?.scrollTo({
      top: selectedIndex * ITEM_HEIGHT,
      behavior: 'auto',
    });
  }, [value]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, [disabled]);

  const changeToCenteredStrength = () => {
    if (disabled) return;
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    const selectedIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const nextStrength = BLUR_STRENGTHS[selectedIndex];

    if (nextStrength && nextStrength !== value) {
      onChange(nextStrength);
    }
  };

  const handleScroll = () => {
    if (disabled) return;
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(changeToCenteredStrength, 120);
  };

  const handleSelectStrength = (strength: BlurStrength) => {
    if (disabled) return;
    const selectedIndex = BLUR_STRENGTHS.indexOf(strength);

    if (selectedIndex < 0) {
      return;
    }

    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollRef.current?.scrollTo({
      top: selectedIndex * ITEM_HEIGHT,
      behavior: 'smooth',
    });
    onChange(strength);
  };

  return (
    <div className='relative w-full'>
      <div className='border-primary pointer-events-none absolute top-1/2 left-1/2 z-10 h-[7.9rem] w-[19.2rem] -translate-x-1/2 -translate-y-1/2 border-y' />

      <div
        ref={scrollRef}
        className='h-[30rem] snap-y snap-mandatory overflow-y-auto overscroll-contain'
        onScroll={handleScroll}>
        <div
          className='flex flex-col items-center justify-center'
          style={{
            paddingTop: CENTER_PADDING,
            paddingBottom: CENTER_PADDING,
          }}>
          {BLUR_STRENGTHS.map((strength) => {
            const isSelected = strength === value;

            return (
              <button
                key={strength}
                type='button'
                disabled={disabled}
                aria-pressed={isSelected}
                className={`flex h-[6rem] w-[19.2rem] snap-center items-center justify-center ${
                  isSelected
                    ? 'text-bold-28 text-primary'
                    : 'text-medium-20 text-gray-400'
                }`}
                onClick={() => handleSelectStrength(strength)}>
                {strength}%
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
