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
  isSaving: boolean;
  canSave: boolean;
  changeNote: string;
  onSave: (mbti: MbtiType | null) => Promise<void>;
}

export const MbtiResetSheet = ({
  mbti,
  onClose,
  isSaving,
  canSave,
  changeNote,
  onSave,
}: MbtiResetSheetProps) => {
  const [selectedMbti, setSelectedMbti] = useState(mbti ?? undefined);

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
                disabled={isSaving || !canSave}
                onClick={() => setSelectedMbti(mbti)}
              />
            ))}
          </div>
        </div>

        <div className='relative mt-auto pb-[2rem]'>
          <Button
            text={isSaving ? '저장 중...' : '저장하기'}
            description={changeNote}
            disabled={
              isSaving || !canSave || selectedMbti === (mbti ?? undefined)
            }
            onClick={() => void onSave(selectedMbti ?? null)}
          />
        </div>
      </div>
    </section>
  );
};
