import {useState} from 'react';

import {BlockedUserItem} from '@/pages/my/components/BlockedUserItem';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface BlockedUsersSheetProps {
  onClose: () => void;
}

const MOCK_BLOCKED_USERS = [
  {
    userName: '새벽별별별별별별별별별별별',
    description: '03년생· 정보전기전자공학과·ENTP',
    blockTime: '2026.00.00',
  },
  {
    userName: '새벽별',
    description: '03년생· 컴퓨터공학과·ENTP',
    blockTime: '2026.00.00',
  },
  {
    userName: '행복한코딩러',
    description: '00년생· 소프트웨어학과·INFP',
    blockTime: '2026.00.00',
  },
];

export const BlockedUsersSheet = ({onClose}: BlockedUsersSheetProps) => {
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  const handleCloseUnblockSheet = () => {
    setSelectedUserName(null);
  };

  return (
    <section>
      <Header
        title={<h2 className='text-title-18b text-gray-800'>차단 목록</h2>}
        leftItem={
          <IcSvgLeft width={24} height={24} className='text-gray-800' />
        }
        onClickLeft={onClose}
      />
      <div className='mt-[2.7rem] divide-y divide-gray-200 overflow-hidden rounded-[16px] border border-gray-200'>
        {MOCK_BLOCKED_USERS.map((user) => (
          <BlockedUserItem
            key={user.userName}
            {...user}
            onClick={() => setSelectedUserName(user.userName)}
          />
        ))}
      </div>
      <BottomSheet
        open={Boolean(selectedUserName)}
        ariaLabel='차단 해제 확인'
        onClose={handleCloseUnblockSheet}>
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img src='blockedUser.png' className='mb-[1.2rem] size-[9.2rem]' />
          <h2 className='text-title-22b text-primary mb-[0.8rem] whitespace-pre-line'>
            {`${selectedUserName ?? ''}님을\n차단 해제할까요?`}
          </h2>
          <p className='text-body1-15r mb-[2.8rem] text-gray-600'>
            해제 후에는 서로에게 다시 노출될 수 있어요
          </p>
          <div className='flex w-full gap-[0.8rem]'>
            <div className='flex-[1]'>
              <Button
                text='취소'
                className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
                onClick={handleCloseUnblockSheet}
              />
            </div>
            <div className='flex-[1.8]'>
              <Button
                text='차단 해제'
                className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                onClick={handleCloseUnblockSheet}
              />
            </div>
          </div>
        </div>
      </BottomSheet>
    </section>
  );
};
