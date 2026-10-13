import {useState} from 'react';

import {MbitCard} from '@/pages/onboarding/components/MbitCard';
import {
  MBTI_TYPES,
  type MbtiType,
} from '@/pages/onboarding/constants/constants';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface MbtiResetSheetProps {
  mbti?: MbtiType;
  onClose: () => void;
}

export const MbtiResetSheet = ({mbti, onClose}: MbtiResetSheetProps) => {
  const [selectedMbti, setSelectedMbti] = useState(mbti);

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
        <div className='flex flex-col gap-[1.6rem]'>
          <h2 className='text-body4-16m text-gray-800'>MBTI 재설정</h2>

          <div className='grid grid-cols-4 gap-[0.8rem]'>
            {MBTI_TYPES.map((mbti) => (
              <MbitCard
                key={mbti}
                mbti={mbti}
                isSelected={selectedMbti === mbti}
                aria-pressed={selectedMbti === mbti}
                onClick={() => setSelectedMbti(mbti)}
              />
            ))}
          </div>
        </div>

        <div className='relative mt-auto pb-[2rem]'>
          <Button text='저장하기' disabled />
        </div>
      </div>
    </section>
  );
};
