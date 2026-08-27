import {MbitCard} from '@/pages/onboarding/components/MbitCard';
import type {GenderType} from '@/pages/onboarding/constants/constants';

interface GenderStepProps {
  selectedGender: GenderType | null;
  onGenderChange: (gender: GenderType) => void;
}

const GENDER_OPTIONS: Array<{label: string; value: GenderType}> = [
  {label: '남성', value: 'male'},
  {label: '여성', value: 'female'},
];

export const GenderStep = ({
  selectedGender,
  onGenderChange,
}: GenderStepProps) => {
  return (
    <div className='mt-[3rem] flex flex-col gap-[2.4rem]'>
      <h1 className='text-h1-22sb'>성별을 선택해 주세요</h1>

      <div className='grid grid-cols-2 gap-[1.6rem]'>
        {GENDER_OPTIONS.map(({label, value}) => (
          <MbitCard
            key={value}
            mbti={label}
            isSelected={selectedGender === value}
            textClassName='text-h1-22sb'
            className='aspect-auto h-[16rem] rounded-[1.6rem]'
            onClick={() => onGenderChange(value)}
          />
        ))}
      </div>
    </div>
  );
};
