import {useState} from 'react';

import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {Button} from '@/shared/components/Button';
import {FieldErrorMessage} from '@/shared/components/FieldErrorMessage';
import {Header} from '@/shared/components/Header';
import {Input} from '@/shared/components/Input';
import {useToast} from '@/shared/hooks/useToast';
import {IcSvgLeft} from '@/shared/icons';

const NICKNAME_MAX_LENGTH = 12;
const MOCK_LAST_CHANGED_DATE = '2026.00.00';

interface NicknameResetSheetProps {
  nickname: string;
  onClose: () => void;
  onSubmit: (nickname: string) => void;
}

export const NicknameResetSheet = ({
  nickname,
  onClose,
  onSubmit,
}: NicknameResetSheetProps) => {
  const [nextNickname, setNextNickname] = useState(nickname);
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'available'>(
    'idle'
  );
  const {
    isVisible: isToastVisible,
    isLeaving: isToastLeaving,
    showToast,
    hideToast,
    fadeDuration,
  } = useToast();

  const hasNickname = nextNickname.length > 0;
  const isAvailable = nicknameStatus === 'available';

  const handleCheckDuplicate = () => {
    setNicknameStatus('available');
  };

  const handleNicknameChange = (value: string) => {
    setNextNickname(value);
    setNicknameStatus('idle');
    hideToast();
  };

  const handleSubmit = () => {
    onSubmit(nextNickname);
    showToast();
  };

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
        <div className='flex flex-col gap-[0.4rem]'>
          <h2 className='text-body4-16m'>닉네임 재설정</h2>

          <div className='flex flex-col gap-[0.8rem]'>
            <div className='text-body1-15r flex items-end justify-between text-gray-400'>
              <span className='text-caption1-12r'>
                2~12자 (한글/영문/숫자 가능)
              </span>
              <span className='text-caption1-12r'>
                {nextNickname.length}/{NICKNAME_MAX_LENGTH}
              </span>
            </div>

            <Input
              value={nextNickname}
              onChange={(event) => handleNicknameChange(event.target.value)}
              maxLength={NICKNAME_MAX_LENGTH}
              placeholder='ex) abcde'
              rightItem={
                <button
                  type='button'
                  disabled={!hasNickname}
                  className='text-regular-10 bg-primary text-white-800 disabled:text-white-800 rounded-full px-[0.8rem] py-[0.6rem] disabled:bg-gray-200'
                  onClick={handleCheckDuplicate}>
                  중복확인
                </button>
              }
            />

            {isAvailable && (
              <FieldErrorMessage
                message='사용 가능한 닉네임이에요'
                variant='default'
                className='pl-[0.2rem]'
              />
            )}
          </div>
        </div>

        <div className='relative mt-auto pb-[2rem]'>
          {isToastVisible && (
            <div
              className={`absolute right-0 bottom-[8.2rem] left-0 z-20 transition-opacity ${
                isToastLeaving ? 'opacity-0' : 'opacity-100'
              }`}
              style={{transitionDuration: `${fadeDuration}ms`}}>
              <ToastMessage message='닉네임이 변경되었어요' />
            </div>
          )}

          <Button
            text='저장하기'
            description={`최근 변경일: ${MOCK_LAST_CHANGED_DATE}`}
            disabled={!isAvailable || isToastVisible}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
};
