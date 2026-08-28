import {DragDropProvider} from '@dnd-kit/react';

import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {PhotoUploadSlot} from '@/pages/onboarding/components/PhotoUploadSlot';
import {
  PHOTO_SLOT_COUNT,
  usePhotoUploadSlots,
} from '@/pages/onboarding/hooks/usePhotoUploadSlots';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {useToast} from '@/shared/hooks/useToast';
import {IcSvgLeft} from '@/shared/icons';

const MOCK_LAST_CHANGED_DATE = '2026.00.00';

interface PhotoUploadResetSheetProps {
  photoUrls: string[];
  onClose: () => void;
  onSubmit: (photoUrls: string[]) => void;
}

export const PhotoUploadResetSheet = ({
  photoUrls,
  onClose,
  onSubmit,
}: PhotoUploadResetSheetProps) => {
  const {
    photoSlots,
    uploadedPhotoCount,
    handlePhotoChange,
    handlePhotoRemove,
    handlePhotoSort,
  } = usePhotoUploadSlots(photoUrls);
  const {
    isVisible: isToastVisible,
    isLeaving: isToastLeaving,
    showToast,
    hideToast,
    fadeDuration,
  } = useToast();

  const currentPhotoUrls = photoSlots
    .map((slot) => slot.previewUrl)
    .filter((previewUrl): previewUrl is string => Boolean(previewUrl));
  const isChanged = currentPhotoUrls.join('|') !== photoUrls.join('|');

  const handleSubmit = () => {
    onSubmit(currentPhotoUrls);
    showToast();
  };

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
                  onPhotoChange={(id, file) => {
                    handlePhotoChange(id, file);
                    hideToast();
                  }}
                  onPhotoRemove={(id) => {
                    handlePhotoRemove(id);
                    hideToast();
                  }}
                />
              ))}
            </div>
          </DragDropProvider>

          <p className='text-caption1-12r whitespace-pre-line text-gray-400'>
            {'JPG · PNG · HEIC 지원\n순서를 드래그로 변경할 수 있어요'}
          </p>
        </div>

        <div className='relative mt-auto pb-[2rem]'>
          {isToastVisible && (
            <div
              className={`absolute right-0 bottom-[8.2rem] left-0 z-20 transition-opacity ${
                isToastLeaving ? 'opacity-0' : 'opacity-100'
              }`}
              style={{transitionDuration: `${fadeDuration}ms`}}>
              <ToastMessage message='사진 업로드가 변경되었어요' />
            </div>
          )}

          <Button
            text='저장하기'
            description={`최근 변경일: ${MOCK_LAST_CHANGED_DATE}`}
            disabled={!isChanged || isToastVisible}
            onClick={handleSubmit}
          />
        </div>
      </div>

      <span className='sr-only'>
        업로드된 사진 {uploadedPhotoCount}/{PHOTO_SLOT_COUNT}
      </span>
    </section>
  );
};
