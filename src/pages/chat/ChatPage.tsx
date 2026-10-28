import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useLocation, useNavigate} from 'react-router-dom';

import {CHAT_QUERY_OPTIONS} from '@/pages/chat/api/query';
import {ChatListItem} from '@/pages/chat/components/ChatListItem';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {EmptyState} from '@/shared/components/EmptyState';
import {Button} from '@/shared/components/Button';
import {Header} from '@/shared/components/Header';
import {useToast} from '@/shared/hooks/useToast';

export const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomsQuery = useQuery(CHAT_QUERY_OPTIONS.ROOMS());
  const chatRooms = roomsQuery.data?.data ?? [];
  const hasChatRooms = chatRooms.length > 0;
  const toastMessage =
    typeof location.state === 'object' &&
    location.state !== null &&
    'toastMessage' in location.state &&
    typeof location.state.toastMessage === 'string'
      ? location.state.toastMessage
      : null;
  const [visibleToastMessage] = useState<string | null>(toastMessage);
  const {
    isVisible: isToastVisible,
    isLeaving: isToastLeaving,
    showToast,
    fadeDuration,
  } = useToast();

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    showToast();
    navigate('.', {replace: true, state: null});
  }, [navigate, showToast, toastMessage]);

  return (
    <main className='relative flex min-h-dvh flex-col'>
      <Header
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
      />

      {roomsQuery.isPending ? (
        <div
          role='status'
          className='text-body1-15r flex flex-1 items-center justify-center pb-[12rem] text-gray-600'>
          채팅 목록을 불러오고 있어요.
        </div>
      ) : roomsQuery.isError ? (
        <div className='flex flex-1 flex-col items-center justify-center gap-[2.4rem] px-[2rem] pb-[12rem]'>
          <p role='alert' className='text-body1-15r text-center text-gray-600'>
            채팅 목록을 불러오지 못했어요.
          </p>
          <div className='w-full max-w-[28rem] [&>div]:h-[5.2rem]'>
            <Button
              text={roomsQuery.isFetching ? '확인 중...' : '다시 시도'}
              disabled={roomsQuery.isFetching}
              onClick={() => void roomsQuery.refetch()}
            />
          </div>
        </div>
      ) : hasChatRooms ? (
        <ul className='pb-[12rem]'>
          {chatRooms.map((chatRoom) => (
            <ChatListItem key={chatRoom.roomId} {...chatRoom} />
          ))}
        </ul>
      ) : (
        <div className='flex flex-1 items-center justify-center pb-[12rem]'>
          <EmptyState
            image={<img src='nochat.png' alt='' />}
            imageClassName='w-[18.6rem] h-[19.9rem]'
          />
        </div>
      )}

      {isToastVisible && visibleToastMessage && (
        <div
          className={`fixed right-[2rem] bottom-[13rem] left-[2rem] z-[60] mx-auto max-w-[35rem] transition-opacity ${
            isToastLeaving ? 'opacity-0' : 'opacity-100'
          }`}
          style={{transitionDuration: `${fadeDuration}ms`}}>
          <ToastMessage message={visibleToastMessage} />
        </div>
      )}
    </main>
  );
};
