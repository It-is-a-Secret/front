import {useSortable} from '@dnd-kit/react/sortable';

import {IcSvgPlus, IcSvgX} from '@/shared/icons';

import type {PhotoSlot} from '../hooks/usePhotoUploadSlots';

interface PhotoUploadSlotProps {
  slot: PhotoSlot;
  index: number;
  className?: string;
  onPhotoChange: (id: string, file: File) => void;
  onPhotoRemove: (id: string) => void;
}

export const PhotoUploadSlot = ({
  slot,
  index,
  className = '',
  onPhotoChange,
  onPhotoRemove,
}: PhotoUploadSlotProps) => {
  const {ref, isDragging} = useSortable({
    id: slot.id,
    index,
    type: 'photo',
  });

  const inputId = `photo-input-${slot.id}`;

  return (
    <div
      ref={ref}
      className={`text-medium-20 bg-white-800 relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-[1.6rem] border border-gray-200 text-gray-400 ${className} ${
        isDragging ? 'opacity-60' : ''
      }`}>
      <label
        htmlFor={inputId}
        className='flex size-full cursor-pointer items-center justify-center overflow-hidden'>
        {slot.previewUrl ? (
          <img
            src={slot.previewUrl}
            alt='업로드한 사진 미리보기'
            className='size-full object-cover'
          />
        ) : (
          <IcSvgPlus className='size-[2.4rem]' />
        )}
      </label>

      {slot.previewUrl && (
        <button
          type='button'
          aria-label='사진 삭제'
          className='absolute top-[1rem] right-[1rem] z-10 flex items-center justify-center rounded-full text-black'
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onPhotoRemove(slot.id);
          }}>
          <IcSvgX className='size-[0.8rem]' />
        </button>
      )}

      <input
        id={inputId}
        type='file'
        accept='image/jpeg,image/png,image/heic,image/heif'
        className='sr-only'
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onPhotoChange(slot.id, file);
          }

          event.target.value = '';
        }}
      />
    </div>
  );
};
