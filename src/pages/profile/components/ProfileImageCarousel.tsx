import {useRef, useState} from 'react';
import type {PointerEvent} from 'react';

interface ProfileImageCarouselProps {
  images: string[];
}

const SWIPE_THRESHOLD = 60;

export const ProfileImageCarousel = ({images}: ProfileImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasImages = images.length > 0;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, images.length - 1));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX;
    dragOffsetRef.current = 0;
    isPointerDownRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) {
      return;
    }

    dragOffsetRef.current = event.clientX - startXRef.current;
  };

  const handlePointerEnd = () => {
    const dragOffset = dragOffsetRef.current;

    if (dragOffset <= -SWIPE_THRESHOLD) {
      handleNext();
    }

    if (dragOffset >= SWIPE_THRESHOLD) {
      handlePrev();
    }

    dragOffsetRef.current = 0;
    isPointerDownRef.current = false;
  };

  return (
    <div className='flex flex-col items-center gap-[0.9rem]'>
      <div
        className='relative aspect-square h-[38rem] w-full touch-pan-y overflow-hidden rounded-[2rem] bg-gray-100'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}>
        {hasImages && (
          <img
            src={images[currentIndex]}
            alt={`프로필 사진 ${currentIndex + 1}`}
            className='size-full object-cover'
          />
        )}
      </div>

      <div className='flex gap-[0.4rem]'>
        {images.map((image, index) => (
          <span
            key={`${image}-${index}`}
            className={`size-[0.4rem] rounded-full ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
