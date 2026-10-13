import {DragDropProvider} from '@dnd-kit/react';

import type {ProfilePhoto} from '@/pages/my/model/profile-edit';
import {PhotoUploadSlot} from '@/pages/onboarding/components/PhotoUploadSlot';
import {
  PHOTO_SLOT_COUNT,
  usePhotoUploadSlots,
} from '@/pages/onboarding/hooks/usePhotoUploadSlots';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface PhotoUploadResetSheetProps {
  photos: ProfilePhoto[];
  onClose: () => void;
}

export const PhotoUploadResetSheet = ({
  photos,
  onClose,
}: PhotoUploadResetSheetProps) => {
  const {
    photoSlots,
    uploadedPhotoCount,
    handlePhotoChange,
    handlePhotoRemove,
    handlePhotoSort,
  } = usePhotoUploadSlots(photos);

  return (
    <section className='flex h-dvh flex-col overflow-hidden'>
      <Header
        title={<h1 className='text-title-18b text-gray-800'>프로필 수정</h1>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={onClose}
      />
      <div className='mt-[1.6rem] flex flex-1 flex-col'>
        <div className='flex flex-col gap-[1.6rem]'>
          <div className='flex flex-col gap-[1.2rem]'>
            <h2 className='text-body4-16m text-gray-800'>사진 관리</h2>
            <p className='text-body1-15r whitespace-pre-line text-gray-400'>
              업로드된 사진은{' '}
              <span className='text-body2-15sb text-gray-600'>블러 처리</span>
              되어 저장되며,
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
            {'JPG · PNG · HEIC 지원\n순서를 드래그로 변경할 수 있어요'}
          </p>
        </div>
        <div className='relative mt-auto pb-[2rem]'>
          <Button text='저장하기' disabled />
        </div>
      </div>
      <span className='sr-only'>
        업로드된 사진 {uploadedPhotoCount}/{PHOTO_SLOT_COUNT}
      </span>
    </section>
  );
};
