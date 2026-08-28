import {useState} from 'react';

import {FieldErrorMessage} from '@/shared/components/FieldErrorMessage';
import {Input} from '@/shared/components/Input';

const NICKNAME_MAX_LENGTH = 12;
const MOCK_DUPLICATED_NICKNAMES = ['행복한코딩러'];

interface NicknameStepProps {
  nickname: string;
  onNicknameChange: (nickname: string) => void;
}

export const NicknameStep = ({
  nickname,
  onNicknameChange,
}: NicknameStepProps) => {
  const hasNickname = nickname.length > 0;
  const [nicknameStatus, setNicknameStatus] = useState<
    'idle' | 'duplicated' | 'available'
  >('idle');

  const isDuplicated = nicknameStatus === 'duplicated';
  const isAvailable = nicknameStatus === 'available';

  const handleCheckDuplicate = () => {
    setNicknameStatus(
      MOCK_DUPLICATED_NICKNAMES.includes(nickname) ? 'duplicated' : 'available'
    );
  };

  const handleNicknameChange = (value: string) => {
    onNicknameChange(value);
    setNicknameStatus('idle');
  };

  return (
    <div className='mt-[1.6rem] flex flex-col gap-[0.4rem]'>
      <h1 className='text-h1-22sb whitespace-pre-line'>
        {'닉네임을 설정해 주세요'}
      </h1>

      <div className='flex flex-col gap-[0.8rem]'>
        <div className='text-body1-15r flex items-end justify-between text-gray-400'>
          <div className='flex flex-col'>
            <span className='text-caption1-12r'>
              {'2~12자 (한글/영문/숫자 가능)'}
            </span>
          </div>

          <span className='text-caption1-12r'>
            {nickname.length}/{NICKNAME_MAX_LENGTH}
          </span>
        </div>

        <Input
          value={nickname}
          onChange={(event) => handleNicknameChange(event.target.value)}
          maxLength={NICKNAME_MAX_LENGTH}
          isError={isDuplicated}
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

        {isDuplicated && (
          <FieldErrorMessage
            message='이미 사용 중인 닉네임이에요'
            className='pl-[0.2rem]'
          />
        )}

        {isAvailable && (
          <FieldErrorMessage
            message='사용 가능한 닉네임이에요'
            variant='default'
            className='pl-[0.2rem]'
          />
        )}
      </div>
    </div>
  );
};
