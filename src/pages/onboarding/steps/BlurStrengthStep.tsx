import {BlurStrengthScroll} from '@/pages/onboarding/components/BlurStrengthScroll';
import type {BlurStrength} from '@/pages/onboarding/constants/constants';

interface BlurStrengthStepProps {
  blurStrength: BlurStrength;
  onBlurStrengthChange: (strength: BlurStrength) => void;
}

export const BlurStrengthStep = ({
  blurStrength,
  onBlurStrengthChange,
}: BlurStrengthStepProps) => {
  return (
    <div className='mt-[3rem] flex flex-col justify-center gap-[7.3rem]'>
      <p className='text-h1-22sb'>사진 블러 강도를 설정해 주세요</p>
      <BlurStrengthScroll
        value={blurStrength}
        onChange={onBlurStrengthChange}
      />
    </div>
  );
};
