import useEmblaCarousel from 'embla-carousel-react';
import {useEffect, useState} from 'react';

interface ProfileImageCarouselProps {
  images: string[];
}

const CAROUSEL_OPTIONS = {
  align: 'start',
  containScroll: 'trimSnaps',
  loop: false,
} as const;

export const ProfileImageCarousel = ({images}: ProfileImageCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(CAROUSEL_OPTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const updateCurrentIndex = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };
    queueMicrotask(updateCurrentIndex);
    emblaApi.on('select', updateCurrentIndex);
    emblaApi.on('reInit', updateCurrentIndex);

    return () => {
      emblaApi.off('select', updateCurrentIndex);
      emblaApi.off('reInit', updateCurrentIndex);
    };
  }, [emblaApi]);

  return (
    <div className='flex flex-col items-center gap-[0.9rem]'>
      <div
        ref={emblaRef}
        className='relative aspect-square h-[38rem] w-full overflow-hidden rounded-[2rem] bg-gray-100'>
        <div className='flex h-full touch-pan-y select-none'>
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className='h-full min-w-0 flex-[0_0_100%]'>
              <img
                src={image}
                alt={`프로필 사진 ${index + 1}`}
                draggable={false}
                className='size-full object-cover'
              />
            </div>
          ))}
        </div>
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
