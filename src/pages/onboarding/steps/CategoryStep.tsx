import {useState} from 'react';

import {Chip} from '@/pages/onboarding/components/Chip';
import {
  INTEREST_CATEGORIES,
  type InterestCategoryName,
  type InterestItem,
} from '@/pages/onboarding/constants/constants';

const MAX_INTEREST_COUNT = 5;

type SelectedInterests = Partial<Record<InterestCategoryName, InterestItem[]>>;

export const CategoryStep = () => {
  const [selectedInterests, setSelectedInterests] = useState<SelectedInterests>(
    {}
  );

  const handleToggleInterest = (
    category: InterestCategoryName,
    item: InterestItem
  ) => {
    setSelectedInterests((prevSelectedInterests) => {
      const currentItems = prevSelectedInterests[category] ?? [];
      const isSelected = currentItems.includes(item);

      if (isSelected) {
        return {
          ...prevSelectedInterests,
          [category]: currentItems.filter(
            (selectedItem) => selectedItem !== item
          ),
        };
      }

      if (currentItems.length >= MAX_INTEREST_COUNT) {
        return prevSelectedInterests;
      }

      return {
        ...prevSelectedInterests,
        [category]: [...currentItems, item],
      };
    });
  };

  return (
    <div className='mt-[3rem] flex flex-col gap-[3.2rem]'>
      <div className='flex flex-col gap-[0.4rem]'>
        <h1 className='text-h1-22sb'>관심사를 선택해주세요</h1>
        <p className='text-body1-15r text-gray-600'>
          분야별로 최대 5개까지 선택 가능
        </p>
      </div>

      <div className='flex flex-col gap-[3.2rem]'>
        {INTEREST_CATEGORIES.map(({category, items}) => (
          <section key={category} className='flex flex-col gap-[1.6rem]'>
            <h2 className='text-body2-15sb text-primary'>{category}</h2>

            <div className='flex flex-wrap gap-[0.8rem]'>
              {items.map((item) => {
                const isSelected =
                  selectedInterests[category]?.includes(item) ?? false;

                return (
                  <Chip
                    key={item}
                    value={item}
                    isSelected={isSelected}
                    onClick={() => handleToggleInterest(category, item)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
