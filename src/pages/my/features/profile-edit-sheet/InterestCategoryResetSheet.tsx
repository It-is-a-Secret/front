import {useState} from 'react';

import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {Chip} from '@/pages/onboarding/components/Chip';
import {
  INTEREST_CATEGORIES,
  INTEREST_STEPS,
  MAX_INTEREST_COUNT,
} from '@/pages/onboarding/constants/constants';
import type {
  InterestItem,
  InterestStep,
  SelectedInterests,
} from '@/pages/onboarding/constants/constants';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {useToast} from '@/shared/hooks/useToast';
import {IcSvgLeft} from '@/shared/icons';

const MOCK_LAST_CHANGED_DATE = '2026.00.00';

interface InterestCategoryResetSheetProps {
  selectedInterests: SelectedInterests;
  onClose: () => void;
  onSubmit: (selectedInterests: SelectedInterests) => void;
}

export const InterestCategoryResetSheet = ({
  selectedInterests,
  onClose,
  onSubmit,
}: InterestCategoryResetSheetProps) => {
  const [nextSelectedInterests, setNextSelectedInterests] =
    useState<SelectedInterests>(selectedInterests);
  const {
    isVisible: isToastVisible,
    isLeaving: isToastLeaving,
    showToast,
    hideToast,
    fadeDuration,
  } = useToast();

  const isChanged =
    JSON.stringify(nextSelectedInterests) !== JSON.stringify(selectedInterests);

  const handleToggleInterest = (
    interestStep: InterestStep,
    item: InterestItem
  ) => {
    setNextSelectedInterests((prevSelectedInterests) => {
      const currentItems = prevSelectedInterests[interestStep] ?? [];
      const isSelected = currentItems.includes(item);

      if (isSelected) {
        return {
          ...prevSelectedInterests,
          [interestStep]: currentItems.filter(
            (selectedItem) => selectedItem !== item
          ),
        };
      }

      if (currentItems.length >= MAX_INTEREST_COUNT) {
        return prevSelectedInterests;
      }

      return {
        ...prevSelectedInterests,
        [interestStep]: [...currentItems, item],
      };
    });
    hideToast();
  };

  const handleSubmit = () => {
    onSubmit(nextSelectedInterests);
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

      <div className='flex min-h-0 flex-1 flex-col'>
        <div className='mt-[1.6rem] min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[3.6rem]'>
          <div className='flex flex-col gap-[2.4rem]'>
          <h2 className='text-body4-16m text-gray-800'>관심 카테고리 재설정</h2>

          {INTEREST_CATEGORIES.map((category, index) => {
            const interestStep = INTEREST_STEPS[index];
            const currentItems = nextSelectedInterests[interestStep] ?? [];

            return (
              <section
                key={category.category}
                className='flex flex-col gap-[0.8rem]'>
                <h3 className='text-body2-15sb text-primary'>
                  {category.category}
                </h3>

                <div className='flex flex-wrap gap-[0.4rem]'>
                  {category.items.map((item) => (
                    <Chip
                      key={item}
                      value={item}
                      isSelected={currentItems.includes(item)}
                      onClick={() => handleToggleInterest(interestStep, item)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          </div>
        </div>

        <div className='bg-background relative shrink-0 pb-[2rem]'>
          {isToastVisible && (
            <div
              className={`absolute right-0 bottom-[8.2rem] left-0 z-20 transition-opacity ${
                isToastLeaving ? 'opacity-0' : 'opacity-100'
              }`}
              style={{transitionDuration: `${fadeDuration}ms`}}>
              <ToastMessage message='관심 카테고리가 변경되었어요' />
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
