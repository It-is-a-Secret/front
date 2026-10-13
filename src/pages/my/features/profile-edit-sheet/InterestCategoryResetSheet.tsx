import {useState} from 'react';

import type {ProfileInterestCategory} from '@/pages/my/model/profile-edit';
import {Chip} from '@/pages/onboarding/components/Chip';
import {MAX_INTEREST_COUNT} from '@/pages/onboarding/constants/constants';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface InterestCategoryResetSheetProps {
  categories: ProfileInterestCategory[];
  selectedTagIds: number[];
  onClose: () => void;
}

export const InterestCategoryResetSheet = ({
  categories,
  selectedTagIds,
  onClose,
}: InterestCategoryResetSheetProps) => {
  const [nextSelectedTagIds, setNextSelectedTagIds] = useState(selectedTagIds);

  const handleToggleInterest = (
    category: ProfileInterestCategory,
    tagId: number
  ) => {
    setNextSelectedTagIds((selectedIds) => {
      if (selectedIds.includes(tagId)) {
        return selectedIds.filter((id) => id !== tagId);
      }

      const selectedCount = category.tags.filter((tag) =>
        selectedIds.includes(tag.id)
      ).length;
      return selectedCount >= MAX_INTEREST_COUNT
        ? selectedIds
        : [...selectedIds, tagId];
    });
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
            <h2 className='text-body4-16m text-gray-800'>
              관심 카테고리 재설정
            </h2>
            {categories.length === 0 && (
              <p className='text-body1-15r text-gray-600'>
                등록된 관심 카테고리가 없어요.
              </p>
            )}
            {categories.map((category) => (
              <section
                key={category.code}
                className='flex flex-col gap-[0.8rem]'>
                <h3 className='text-body2-15sb text-primary'>
                  {category.name}
                </h3>
                <div className='flex flex-wrap gap-[0.4rem]'>
                  {category.tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      value={tag.name}
                      isSelected={nextSelectedTagIds.includes(tag.id)}
                      aria-pressed={nextSelectedTagIds.includes(tag.id)}
                      onClick={() => handleToggleInterest(category, tag.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <div className='bg-background shrink-0 pb-[2rem]'>
          <Button text='저장하기' disabled />
        </div>
      </div>
    </section>
  );
};
