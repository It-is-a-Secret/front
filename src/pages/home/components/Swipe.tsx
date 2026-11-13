import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useRef, useState} from 'react';

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
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoadMoreError: boolean;
  onLoadMore: () => void;
}

const EMBLA_OPTIONS = {
  align: 'center',
  containScroll: 'trimSnaps',
  loop: false,
} as const;

export const Swipe = ({
  users,
  hasMore,
  isLoadingMore,
  isLoadMoreError,
  onLoadMore,
}: SwipeProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canMovePrev, setCanMovePrev] = useState(false);
  const [canMoveNext, setCanMoveNext] = useState(false);
  const pendingNextIndex = useRef<number | null>(null);

  const updateCarouselState = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    if (
      pendingNextIndex.current !== null &&
      emblaApi.scrollSnapList().length > pendingNextIndex.current
    ) {
      const index = pendingNextIndex.current;
      pendingNextIndex.current = null;
      emblaApi.scrollTo(index);
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanMovePrev(emblaApi.canScrollPrev());
    setCanMoveNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    queueMicrotask(updateCarouselState);
    emblaApi.on('select', updateCarouselState);
    emblaApi.on('reInit', updateCarouselState);

    return () => {
      emblaApi.off('select', updateCarouselState);
      emblaApi.off('reInit', updateCarouselState);
    };
  }, [emblaApi, updateCarouselState]);

  useEffect(() => {
    if (
      selectedIndex >= users.length - 2 &&
      hasMore &&
      !isLoadingMore &&
      !isLoadMoreError
    ) {
      onLoadMore();
    }
  }, [
    selectedIndex,
    users.length,
    hasMore,
    isLoadingMore,
    isLoadMoreError,
    onLoadMore,
  ]);

  const handlePrev = useCallback(() => {
    pendingNextIndex.current = null;
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    if (emblaApi?.canScrollNext()) {
      emblaApi.scrollNext();
    } else if (hasMore) {
      pendingNextIndex.current = selectedIndex + 1;
      if (!isLoadingMore) onLoadMore();
    }
  }, [emblaApi, hasMore, selectedIndex, isLoadingMore, onLoadMore]);

  return (
    <div className='relative h-full w-full overflow-hidden'>
      <div className='bg-white-800 pointer-events-none absolute top-[1.2rem] left-[44%] h-[calc(100%-2.4rem)] w-[82%] -translate-x-1/2 -rotate-[4deg] rounded-[3.2rem] opacity-50' />
      <div className='bg-white-800 pointer-events-none absolute top-[1.2rem] left-[56%] h-[calc(100%-2.4rem)] w-[82%] -translate-x-1/2 rotate-[4deg] rounded-[3.2rem] opacity-50' />

      <div ref={emblaRef} className='relative z-10 h-full overflow-hidden'>
        <div className='flex h-full touch-pan-y'>
          {users.map((user, index) => {
            const isSelected = index === selectedIndex;

            return (
              <div
                key={user.userId}
                className='flex min-w-0 flex-[0_0_82%] justify-center px-[0.8rem]'>
                <div
                  className={`h-full w-full transition-transform duration-200 ${
                    isSelected ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                  style={{
                    opacity: isSelected ? 1 : 0,
                    transform: `scale(${isSelected ? 1 : 0.96})`,
                  }}>
                  <SwipeCard {...user} isActive={isSelected} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
        aria-label={isLoadMoreError ? '다음 카드 다시 불러오기' : '다음 카드'}
        aria-busy={isLoadingMore}
        disabled={!canMoveNext && !hasMore}
        className='absolute top-1/2 right-[1.2rem] z-40 flex size-[3.2rem] -translate-y-1/2 items-center justify-center text-gray-400 disabled:opacity-30'
        onClick={handleNext}>
        <IcSvgLeft className='size-[2.4rem] rotate-180' />
      </button>
    </div>
  );
};
