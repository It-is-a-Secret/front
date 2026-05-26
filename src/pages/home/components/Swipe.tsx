import {useRef, useState} from 'react';
import type {MouseEvent, PointerEvent} from 'react';

import {SwipeCard} from '@/pages/home/components/SwipeCard';
import {IcSvgLeft} from '@/shared/icons';

export interface SwipeUser {
  userId: string;
  name: string;
  birthYear: string;
  department: string;
  mbti: string;
  imageUrl?: string;
}

interface SwipeProps {
  users: SwipeUser[];
}

const SWIPE_THRESHOLD = 80;
const VISIBLE_CARD_COUNT = 3;

export const Swipe = ({users}: SwipeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const didDragRef = useRef(false);

  const canMovePrev = currentIndex > 0;
  const canMoveNext = currentIndex < users.length - 1;

  const handlePrev = () => {
    if (canMovePrev) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (canMoveNext) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX;
    dragOffsetRef.current = 0;
    isPointerDownRef.current = true;
    didDragRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) {
      return;
    }

    const nextDragOffset = event.clientX - startXRef.current;

    if (Math.abs(nextDragOffset) > 6) {
      didDragRef.current = true;
    }

    dragOffsetRef.current = nextDragOffset;
    setDragOffset(nextDragOffset);
  };

  const handlePointerEnd = () => {
    const currentDragOffset = dragOffsetRef.current;

    if (currentDragOffset <= -SWIPE_THRESHOLD) {
      handleNext();
    }

    if (currentDragOffset >= SWIPE_THRESHOLD) {
      handlePrev();
    }

    isPointerDownRef.current = false;
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
    }
  };

  return (
    <div className='relative h-full w-full overflow-hidden'>
      {users
        .slice(currentIndex, currentIndex + VISIBLE_CARD_COUNT)
        .map((user, index) => {
          const isFrontCard = index === 0;
          const sideOffset = index % 2 === 0 ? -1 : 1;
          const stackTranslateX = isFrontCard
            ? dragOffset
            : sideOffset * index * 1.6 * 10;
          const stackScale = 1 - index * 0.04;

          return (
            <div
              key={user.userId}
              className={`absolute inset-0 flex justify-center ${
                isFrontCard
                  ? 'z-30 touch-pan-y cursor-grab select-none active:cursor-grabbing'
                  : 'pointer-events-none transition-transform duration-200'
              }`}
              style={{
                zIndex: VISIBLE_CARD_COUNT - index,
                opacity: isFrontCard ? 1 : 0.42,
                transform: `translateX(${stackTranslateX}px) scale(${stackScale})`,
                transitionDuration: isFrontCard && dragOffset !== 0 ? '0ms' : undefined,
              }}
              onPointerDown={isFrontCard ? handlePointerDown : undefined}
              onPointerMove={isFrontCard ? handlePointerMove : undefined}
              onPointerUp={isFrontCard ? handlePointerEnd : undefined}
              onPointerCancel={isFrontCard ? handlePointerEnd : undefined}
              onClickCapture={isFrontCard ? handleClickCapture : undefined}>
              <SwipeCard {...user} />
            </div>
          );
        })}

      <button
        type='button'
        aria-label='이전 카드'
        disabled={!canMovePrev}
        className='absolute top-1/2 left-[1.2rem] z-40 flex size-[3.2rem] -translate-y-1/2 items-center justify-center text-gray-400 disabled:opacity-30'
        onClick={handlePrev}>
        <IcSvgLeft className='size-[2.4rem]' />
      </button>

      <button
        type='button'
        aria-label='다음 카드'
        disabled={!canMoveNext}
        className='absolute top-1/2 right-[1.2rem] z-40 flex size-[3.2rem] -translate-y-1/2 items-center justify-center text-gray-400 disabled:opacity-30'
        onClick={handleNext}>
        <IcSvgLeft className='size-[2.4rem] rotate-180' />
      </button>
    </div>
  );
};
