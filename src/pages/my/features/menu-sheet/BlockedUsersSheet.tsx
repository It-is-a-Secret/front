import {useRef, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {
  MODERATION_MUTATION_OPTIONS,
  MODERATION_QUERY_OPTIONS,
} from '@/shared/api/moderation/query';
import type {
  BlockedMember,
  GetBlockedMembersResponse,
} from '@/shared/api/moderation/type';
import {QUERY_KEYS} from '@/shared/api';
import {getProfileErrorMessage} from '@/pages/my/model/profile-edit';
import {getBlockedMemberDescription} from '@/pages/my/model/blocked-members';

import {BlockedUserItem} from '@/pages/my/components/BlockedUserItem';
import {BottomSheet} from '@/shared/components/BottomSheet';
import {Button} from '@/shared/components/Button';
import {EmptyState} from '@/shared/components/EmptyState';
import {Header} from '@/shared/components/Header';
import {IcSvgLeft} from '@/shared/icons';

interface BlockedUsersSheetProps {
  onClose: () => void;
}

export const BlockedUsersSheet = ({onClose}: BlockedUsersSheetProps) => {
  const queryClient = useQueryClient();
  const blockedQuery = useQuery(MODERATION_QUERY_OPTIONS.BLOCKS());
  const users = blockedQuery.data?.data ?? [];
  const [selectedUser, setSelectedUser] = useState<BlockedMember | null>(null);
  const submittingRef = useRef(false);
  const unblock = useMutation({
    ...MODERATION_MUTATION_OPTIONS.UNBLOCK(),
    onSuccess: async (_, memberId) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.moderation.blocks(),
      });
      queryClient.setQueryData<GetBlockedMembersResponse>(
        QUERY_KEYS.moderation.blocks(),
        (old) =>
          old
            ? {
                ...old,
                data: old.data?.filter(
                  (user) => user.blockedMemberId !== memberId
                ),
              }
            : old
      );
      setSelectedUser(null);
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.moderation.blocks(),
      });
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.discovery.all});
      void queryClient.invalidateQueries({queryKey: QUERY_KEYS.chat.all});
    },
    onSettled: () => {
      submittingRef.current = false;
    },
  });

  const handleCloseUnblockSheet = () => {
    if (submittingRef.current) return;
    setSelectedUser(null);
    unblock.reset();
  };
  const handleUnblock = () => {
    const memberId = selectedUser?.blockedMemberId;
    if (
      !memberId ||
      !Number.isSafeInteger(memberId) ||
      memberId <= 0 ||
      submittingRef.current
    )
      return;
    submittingRef.current = true;
    unblock.mutate(memberId);
  };
  const formatBlockedAt = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ''
      : new Intl.DateTimeFormat('ko-KR', {
          timeZone: 'Asia/Seoul',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(date);
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
      {blockedQuery.isPending ? (
        <p
          role='status'
          className='text-body1-15r mt-[2.7rem] text-center text-gray-600'>
          차단 목록을 불러오는 중...
        </p>
      ) : blockedQuery.isError ? (
        <div className='mt-[2.7rem] flex flex-col gap-[1.6rem]'>
          <p role='alert' className='text-body1-15r text-center text-gray-600'>
            차단 목록을 불러오지 못했어요.
          </p>
          <Button
            text='다시 시도'
            disabled={blockedQuery.isFetching}
            onClick={() => void blockedQuery.refetch()}
          />
        </div>
      ) : users.length > 0 ? (
        <div className='mt-[2.7rem] divide-y divide-gray-200 overflow-hidden rounded-[16px] border border-gray-200'>
          {users.map((user, index) => (
            <BlockedUserItem
              key={user.blockedMemberId ?? index}
              userName={user.nickName ?? '알 수 없는 사용자'}
              description={getBlockedMemberDescription(user)}
              blockTime={formatBlockedAt(user.blockedAt)}
              disabled={
                unblock.isPending ||
                !user.blockedMemberId ||
                !Number.isSafeInteger(user.blockedMemberId) ||
                user.blockedMemberId <= 0
              }
              onClick={() => {
                unblock.reset();
                setSelectedUser(user);
              }}
            />
          ))}
        </div>
      ) : (
        <div className='flex min-h-[calc(100dvh_-_5.2rem)] items-center justify-center pb-[5.2rem]'>
          <EmptyState
            image={<img src='/block.png' alt='' />}
            imageClassName='size-[15.6rem]'
            highlightTitle='차단한 사용자가 없어요'
            description='차단한 사용자는 여기서 확인할 수 있어요'
          />
        </div>
      )}
      <BottomSheet
        open={selectedUser !== null}
        ariaLabel='차단 해제 확인'
        onClose={handleCloseUnblockSheet}>
        <div className='flex flex-col items-center px-[1.2rem] pb-[3.6rem] text-center'>
          <img
            src='/blockedUser.png'
            alt=''
            className='mb-[1.2rem] size-[9.2rem]'
          />
          <h2 className='text-title-22b text-primary mb-[0.8rem] whitespace-pre-line'>
            {`${selectedUser?.nickName ?? '알 수 없는 사용자'}님을\n차단 해제할까요?`}
          </h2>
          <p className='text-body1-15r mb-[2.8rem] text-gray-600'>
            해제 후에는 서로에게 다시 노출될 수 있어요
          </p>
          {unblock.isError && (
            <p role='alert' className='text-body1-15r text-error mb-[1.2rem]'>
              {getProfileErrorMessage(
                unblock.error,
                '차단 해제에 실패했어요. 다시 시도해 주세요.'
              )}
            </p>
          )}
          <div className='flex w-full gap-[0.8rem]'>
            <div className='flex-[1]'>
              <Button
                text='취소'
                disabled={unblock.isPending}
                className='border-primary text-button1-14b text-primary h-[5.6rem] rounded-[28px] border'
                onClick={handleCloseUnblockSheet}
              />
            </div>
            <div className='flex-[1.8]'>
              <Button
                text={unblock.isPending ? '해제 중...' : '차단 해제'}
                disabled={unblock.isPending}
                className='bg-primary text-button1-14b text-white-800 h-[5.6rem] rounded-[28px] shadow-[0_8px_10px_0_rgba(194,30,86,0.25)]'
                onClick={handleUnblock}
              />
            </div>
          </div>
        </div>
      </BottomSheet>
    </section>
  );
};
