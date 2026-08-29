import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {
  ChatListItem,
  type ChatListItemProps,
} from '@/pages/chat/components/ChatListItem';
import {ToastMessage} from '@/pages/my/components/ToastMessage';
import {EmptyState} from '@/shared/components/EmptyState';
import {Header} from '@/shared/components/Header';
import {useToast} from '@/shared/hooks/useToast';

const MOCK_CHAT_ROOMS: ChatListItemProps[] = [
  {
    chatRoomId: 1,
    nickname: '행복한코딩러',
    lastMessage: '오 좋다. 그럼 다음에 추천곡 공유해줘요',
    lastMessageCreatedAt: '2026-08-29T15:53:00',
    unreadCount: 1,
    publicPhotoCount: 2,
  },
];

export const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasChatRooms = MOCK_CHAT_ROOMS.length > 0;
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

      {hasChatRooms ? (
        <ul>
          {MOCK_CHAT_ROOMS.map((chatRoom) => (
            <ChatListItem key={chatRoom.chatRoomId} {...chatRoom} />
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
