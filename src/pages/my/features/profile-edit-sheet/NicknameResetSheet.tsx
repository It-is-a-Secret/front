import {useState} from 'react';

import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {Input} from '@/shared/components/Input';
import {IcSvgLeft} from '@/shared/icons';

const NICKNAME_MAX_LENGTH = 12;

interface NicknameResetSheetProps {
  nickname: string;
  onClose: () => void;
}

export const NicknameResetSheet = ({
  nickname,
  onClose,
}: NicknameResetSheetProps) => {
  const [nextNickname, setNextNickname] = useState(nickname);

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
              onChange={(event) => setNextNickname(event.target.value)}
              maxLength={NICKNAME_MAX_LENGTH}
              placeholder='ex) abcde'
              rightItem={
                <button
                  type='button'
                  disabled
                  className='text-regular-10 bg-primary text-white-800 disabled:text-white-800 rounded-full px-[0.8rem] py-[0.6rem] disabled:bg-gray-200'>
                  중복확인
                </button>
              }
            />
          </div>
        </div>

        <div className='relative mt-auto pb-[2rem]'>
          <Button text='저장하기' disabled />
        </div>
      </div>
    </section>
  );
};
