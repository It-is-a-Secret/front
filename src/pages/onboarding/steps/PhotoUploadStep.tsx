import {DragDropProvider} from '@dnd-kit/react';

import {PhotoUploadSlot} from '../components/PhotoUploadSlot';
import {
  PHOTO_SLOT_COUNT,
  usePhotoUploadSlots,
} from '../hooks/usePhotoUploadSlots';

export const PhotoUploadStep = () => {
  const {
    photoSlots,
    uploadedPhotoCount,
    handlePhotoChange,
    handlePhotoRemove,
    handlePhotoSort,
  } = usePhotoUploadSlots();

  return (
    <div className='mt-[3rem] flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[1.6rem]'>
        <h1 className='text-h1-22sb'>{'사진 5장을 업로드해 주세요'}</h1>

        <p className='text-body1-15r whitespace-pre-line text-gray-400'>
          업로드된 사진은{' '}
          <span className='text-body2-15sb text-gray-600'>블러 처리</span>되어
          저장되며,
          {'\n'}채팅 진행에 따라
          <span className='text-body2-15sb text-gray-600'>
            업로드 순서대로 한 장씩 공개
          </span>
          돼요
        </p>
      </div>

      <DragDropProvider onDragEnd={handlePhotoSort}>
        <div className='flex w-full flex-wrap justify-center gap-[1rem]'>
          {photoSlots.map((slot, index) => (
            <PhotoUploadSlot
              key={slot.id}
              slot={slot}
              index={index}
              className='basis-[calc((100%_-_2rem)/3)]'
              onPhotoChange={handlePhotoChange}
              onPhotoRemove={handlePhotoRemove}
            />
          ))}
        </div>
      </DragDropProvider>

      <p className='text-caption1-12r whitespace-pre-line text-gray-400'>
        {'JPG · PNG · HEIC 지원\n한 장당 최대 3MB까지 업로드할 수 있어요'}
      </p>

      <span className='sr-only'>
        업로드된 사진 {uploadedPhotoCount}/{PHOTO_SLOT_COUNT}
      </span>
    </div>
  );
};
