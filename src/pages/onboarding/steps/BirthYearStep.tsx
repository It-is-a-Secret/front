import {BirthYearScroll} from '@/pages/onboarding/components/BirthYearScroll';

interface BirthYearStepProps {
  birthYear: number;
  onBirthYearChange: (year: number) => void;
}

export const BirthYearStep = ({
  birthYear,
  onBirthYearChange,
}: BirthYearStepProps) => {
  return (
    <div className='mt-[3rem] flex flex-col justify-center gap-[7.3rem]'>
      <p className='text-h1-22sb'>몇 년도에 태어나셨나요?</p>
      <BirthYearScroll value={birthYear} onChange={onBirthYearChange} />
    </div>
  );
};
