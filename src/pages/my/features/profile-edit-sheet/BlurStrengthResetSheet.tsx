import {useState} from 'react';

import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {BlurStrengthScroll} from '@/pages/onboarding/components/BlurStrengthScroll';
import type {BlurStrength} from '@/pages/onboarding/constants/constants';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {useToast} from '@/shared/hooks/useToast';
import {IcSvgLeft} from '@/shared/icons';

const MOCK_LAST_CHANGED_DATE = '2026.00.00';

interface BlurStrengthResetSheetProps {
  blurStrength: BlurStrength;
  onClose: () => void;
  onSubmit: (blurStrength: BlurStrength) => void;
}

export const BlurStrengthResetSheet = ({
  blurStrength,
  onClose,
  onSubmit,
}: BlurStrengthResetSheetProps) => {
  const [selectedBlurStrength, setSelectedBlurStrength] =
    useState<BlurStrength>(blurStrength);
  const {
    isVisible: isToastVisible,
    isLeaving: isToastLeaving,
    showToast,
    hideToast,
    fadeDuration,
  } = useToast();

  const isChanged = selectedBlurStrength !== blurStrength;

  const handleBlurStrengthChange = (nextBlurStrength: BlurStrength) => {
    setSelectedBlurStrength(nextBlurStrength);
    hideToast();
  };

  const handleSubmit = () => {
    onSubmit(selectedBlurStrength);
    showToast();
  };

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
            onChange={handleBlurStrengthChange}
          />
        </div>

        <div className='relative mt-auto pb-[2rem]'>
          {isToastVisible && (
            <div
              className={`absolute right-0 bottom-[8.2rem] left-0 z-20 transition-opacity ${
                isToastLeaving ? 'opacity-0' : 'opacity-100'
              }`}
              style={{transitionDuration: `${fadeDuration}ms`}}>
              <ToastMessage message='사진 블러 강도가 변경되었어요' />
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
    </section>
  );
};
