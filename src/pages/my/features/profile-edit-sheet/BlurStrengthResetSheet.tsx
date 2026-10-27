import {useState} from 'react';

import type {ProfilePhoto} from '@/pages/my/model/profile-edit';
import {BlurStrengthScroll} from '@/pages/onboarding/components/BlurStrengthScroll';
import {
  BLUR_STRENGTHS,
  type BlurStrength,
} from '@/pages/onboarding/constants/constants';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface BlurStrengthResetSheetProps {
  photos: ProfilePhoto[];
  onClose: () => void;
  isSaving: boolean;
  onSave: (strength: BlurStrength) => Promise<void>;
}

export const BlurStrengthResetSheet = ({
  photos,
  onClose,
  isSaving,
  onSave,
}: BlurStrengthResetSheetProps) => {
  const [selectedBlurStrength, setSelectedBlurStrength] = useState<
    BlurStrength | undefined
  >(() => {
    const currentLevel = photos[0]?.blurLevel;
    const hasCommonStrength =
      photos.length > 0 &&
      photos.every((photo) => photo.blurLevel === currentLevel);
    return hasCommonStrength
      ? BLUR_STRENGTHS.find((level) => level === currentLevel)
      : undefined;
  });

  return (
    <section className='flex min-h-dvh flex-col'>
      <Header
        title={<h1 className='text-title-18b text-gray-800'>프로필 수정</h1>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={onClose}
      />
      <div className='mt-[1.6rem] flex flex-1 flex-col'>
        <div className='flex flex-col gap-[7.3rem]'>
          <h2 className='text-body4-16m text-gray-800'>
            사진 블러 강도 재설정
          </h2>
          <BlurStrengthScroll
            value={selectedBlurStrength}
            onChange={setSelectedBlurStrength}
            disabled={isSaving}
          />
        </div>
        <div className='relative mt-auto pb-[2rem]'>
          <Button
            text={isSaving ? '저장 중...' : '저장하기'}
            disabled={
              isSaving ||
              photos.length === 0 ||
              selectedBlurStrength === undefined ||
              photos.every((photo) => photo.blurLevel === selectedBlurStrength)
            }
            onClick={() => {
              if (selectedBlurStrength !== undefined)
                void onSave(selectedBlurStrength);
            }}
          />
        </div>
      </div>
    </section>
  );
};
