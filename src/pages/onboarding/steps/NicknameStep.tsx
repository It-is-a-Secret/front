import {useState} from 'react';

import {Input} from '@/shared/components/Input';

const NICKNAME_MAX_LENGTH = 12;

export const NicknameStep = () => {
  const [nickname, setNickname] = useState('');
  const hasNickname = nickname.length > 0;

  const handleCheckDuplicate = () => {
    alert('사용 가능한 닉네임입니다.');
  };

  return (
    <div className='mt-[1.6rem] flex flex-col gap-[2.4rem]'>
      <h1 className='text-h1-22sb whitespace-pre-line'>
        {'어떻게\n불러드릴까요?'}
      </h1>

      <div className='flex flex-col gap-[0.8rem]'>
        <div className='text-body1-15r flex items-end justify-between text-gray-400'>
          <div className='flex flex-col'>
            <span>2~12자</span>
            <span>한글/영문/숫자 가능</span>
          </div>

          <span>
            {nickname.length}/{NICKNAME_MAX_LENGTH}
          </span>
        </div>

        <Input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={NICKNAME_MAX_LENGTH}
          placeholder='ex) abcde'
          rightItem={
            <button
              type='button'
              disabled={!hasNickname}
              className='text-regular-10 rounded-full bg-primary px-[0.8rem] py-[0.6rem] text-white-800 disabled:bg-gray-200 disabled:text-white-800'
              onClick={handleCheckDuplicate}>
              중복확인
            </button>
          }
        />
      </div>
    </div>
  );
};
