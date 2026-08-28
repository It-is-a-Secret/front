import {
  ChatListItem,
  type ChatListItemProps,
} from '@/pages/chat/components/ChatListItem';
import {EmptyState} from '@/shared/components/EmptyState';
import {Header} from '@/shared/components/Header';

const MOCK_CHAT_ROOMS: ChatListItemProps[] = [];

export const ChatPage = () => {
  const hasChatRooms = MOCK_CHAT_ROOMS.length > 0;

  return (
    <main className='flex min-h-dvh flex-col'>
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
    </main>
  );
};
