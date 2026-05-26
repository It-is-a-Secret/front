import {useState} from 'react';

import {BirthYearScroll} from '@/pages/onboarding/components/BirthYearScroll';

export const BirthYearStep = () => {
  const [birthYear, setBirthYear] = useState(2005);

  const handleBirthYearChange = (year: number) => {
    console.log('selected birth year:', year);
    setBirthYear(year);
  };

  return (
    <div className='mt-[3rem] flex flex-col justify-center gap-[7.3rem]'>
      <p className='text-h1-22sb'>몇 년도에 태어나셨나요?</p>
      <BirthYearScroll value={birthYear} onChange={handleBirthYearChange} />
    </div>
  );
};
