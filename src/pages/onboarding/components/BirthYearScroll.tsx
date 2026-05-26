import {useEffect, useRef} from 'react';

import {BIRTH_YEARS} from '@/pages/onboarding/constants/constants';

interface BirthYearScrollProps {
  value: number;
  onChange: (year: number) => void;
}

const ITEM_HEIGHT = 60;
const SCROLL_HEIGHT = 300;
const CENTER_PADDING = (SCROLL_HEIGHT - ITEM_HEIGHT) / 2;

export const BirthYearScroll = ({value, onChange}: BirthYearScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const didInitScrollRef = useRef(false);

  useEffect(() => {
    if (didInitScrollRef.current) {
      return;
    }

    const selectedIndex = BIRTH_YEARS.indexOf(value);

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
  }, []);

  const changeToCenteredYear = () => {
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    const selectedIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const nextYear = BIRTH_YEARS[selectedIndex];

    if (nextYear && nextYear !== value) {
      onChange(nextYear);
    }
  };

  const handleScroll = () => {
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(changeToCenteredYear, 120);
  };

  const handleSelectYear = (year: number) => {
    const selectedIndex = BIRTH_YEARS.indexOf(year);

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
    onChange(year);
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
          {BIRTH_YEARS.map((year) => {
            const isSelected = year === value;

            return (
              <button
                key={year}
                type='button'
                aria-pressed={isSelected}
                className={`flex h-[6rem] w-[19.2rem] snap-center items-center justify-center ${
                  isSelected
                    ? 'text-bold-28 text-primary'
                    : 'text-medium-20 text-gray-400'
                }`}
                onClick={() => handleSelectYear(year)}>
                {year}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
