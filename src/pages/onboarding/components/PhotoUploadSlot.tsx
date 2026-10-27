import {useState} from 'react';

import {useSortable} from '@dnd-kit/react/sortable';

import {IcSvgImage, IcSvgPlus, IcSvgX} from '@/shared/icons';

import type {PhotoSlot} from '../hooks/usePhotoUploadSlots';

interface PhotoUploadSlotProps {
  slot: PhotoSlot;
  index: number;
  className?: string;
  disabled?: boolean;
  onPhotoChange: (id: string, file: File) => void;
  onPhotoRemove: (id: string) => void;
}

export const PhotoUploadSlot = ({
  slot,
  index,
  className = '',
  disabled = false,
  onPhotoChange,
  onPhotoRemove,
}: PhotoUploadSlotProps) => {
  const [failedPreviewUrl, setFailedPreviewUrl] = useState<string | null>(null);
  const hasPhoto = Boolean(
    slot.file || slot.previewUrl || slot.objectKey || slot.imageId !== undefined
  );
  const {ref, isDragging} = useSortable({
    id: slot.id,
    index,
    type: 'photo',
    disabled,
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
        {slot.previewUrl && slot.previewUrl !== failedPreviewUrl ? (
          <img
            src={slot.previewUrl}
            alt='업로드한 사진 미리보기'
            className='size-full object-cover'
            onError={() => setFailedPreviewUrl(slot.previewUrl)}
          />
        ) : hasPhoto ? (
          <span className='flex flex-col items-center gap-[0.6rem] text-gray-400'>
            <IcSvgImage className='size-[2.4rem]' />
            <span className='text-caption1-12r'>
              {slot.processingStatus === 'PROCESSING'
                ? '처리 중'
                : slot.processingStatus === 'FAILED'
                  ? '처리 실패'
                  : '미리보기 없음'}
            </span>
          </span>
        ) : (
          <IcSvgPlus className='size-[2.4rem]' />
        )}
      </label>

      {hasPhoto && (
        <button
          type='button'
          disabled={disabled}
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
        disabled={disabled}
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
