import {Chip} from '@/pages/onboarding/components/Chip';
import {
  INTEREST_CATEGORIES,
  MAX_INTEREST_COUNT,
} from '@/pages/onboarding/constants/constants';
import type {InterestItem} from '@/pages/onboarding/constants/constants';

interface PersonalityConversationStepProps {
  selectedItems: readonly InterestItem[];
  onToggleInterest: (item: InterestItem) => void;
}

const CATEGORY = INTEREST_CATEGORIES[3];
const TITLE = '성격/대화 스타일';

export const PersonalityConversationStep = ({
  selectedItems,
  onToggleInterest,
}: PersonalityConversationStepProps) => {
  return (
    <div className='mt-[2.8rem] flex flex-col gap-[2.4rem]'>
      <div className='flex flex-col gap-[0.4rem]'>
        <h1 className='text-h1-22sb'>
          <span className='text-primary'>{TITLE}</span>을 선택해 주세요
        </h1>
        <p className='text-body1-15r text-gray-600'>
          최대 {MAX_INTEREST_COUNT}개까지 선택 가능 ({selectedItems.length}/
          {MAX_INTEREST_COUNT})
        </p>
      </div>

      <section className='flex flex-col gap-[1.2rem]'>
        <h2 className='text-body2-15sb text-primary'>{TITLE}</h2>

        <div className='flex flex-wrap gap-[0.4rem]'>
          {CATEGORY.items.map((item) => (
            <Chip
              key={item}
              value={item}
              isSelected={selectedItems.includes(item)}
              onClick={() => onToggleInterest(item)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
