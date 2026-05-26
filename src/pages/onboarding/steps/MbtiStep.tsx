import {MbitCard} from '@/pages/onboarding/components/MbitCard';
import {
  MBTI_TYPES,
  type MbtiType,
} from '@/pages/onboarding/constants/constants';

interface MbtiStepProps {
  selectedMbti: MbtiType | null;
  onMbtiChange: (mbti: MbtiType) => void;
}

export const MbtiStep = ({selectedMbti, onMbtiChange}: MbtiStepProps) => {
  return (
    <div className='mt-[3rem] flex flex-col gap-[2.8rem]'>
      <h1 className='text-h1-22sb'>MBTI가 무엇인가요?</h1>

      <div className='grid grid-cols-4 gap-[0.8rem]'>
        {MBTI_TYPES.map((mbti) => (
          <MbitCard
            key={mbti}
            mbti={mbti}
            isSelected={selectedMbti === mbti}
            onClick={() => onMbtiChange(mbti)}
          />
        ))}
      </div>
    </div>
  );
};
