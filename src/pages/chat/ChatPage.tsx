import {
  ChatListItem,
  type ChatListItemProps,
} from '@/pages/chat/components/ChatListItem';
import {Header} from '@/shared/components/Header';

const createMockDateTime = (diffMs: number) =>
  new Date(Date.now() - diffMs).toISOString();

const MOCK_CHAT_ROOMS: ChatListItemProps[] = [
  {
    chatRoomId: 1,
    nickname: '행복한코딩러',
    lastMessage: '오늘 저녁에 시간 괜찮아?',
    lastMessageCreatedAt: createMockDateTime(30 * 1000),
    unreadCount: 2,
    publicPhotoCount: 3,
  },
  {
    chatRoomId: 2,
    nickname: '낭만개발자',
    lastMessage: '사진 하나 더 공개됐어',
    lastMessageCreatedAt: createMockDateTime(12 * 60 * 1000),
    unreadCount: 0,
    publicPhotoCount: 4,
  },
  {
    chatRoomId: 3,
    nickname: '디자인장인',
    lastMessage: '내일 학교 앞에서 볼까?',
    lastMessageCreatedAt: createMockDateTime(2 * 60 * 60 * 1000),
    unreadCount: 11,
    publicPhotoCount: 1,
  },
  {
    chatRoomId: 4,
    nickname: '느긋한산책러',
    lastMessage: '프로필 사진 하나 더 볼 수 있어?',
    lastMessageCreatedAt: createMockDateTime(26 * 60 * 60 * 1000),
    unreadCount: 1,
    publicPhotoCount: 2,
  },
  {
    chatRoomId: 5,
    nickname: '새벽감성',
    lastMessage: '이번 주말에 시간 맞춰보자',
    lastMessageCreatedAt: createMockDateTime(8 * 24 * 60 * 60 * 1000),
    unreadCount: 99,
    publicPhotoCount: 5,
  },
];

export const ChatPage = () => {
  return (
    <main>
      <Header
        title={
          <h1 className='text-bold-24 text-gray-800'>
            Blur<span className='text-primary'>Some</span>
          </h1>
        }
      />
      <ul>
        {MOCK_CHAT_ROOMS.map((chatRoom) => (
          <ChatListItem key={chatRoom.chatRoomId} {...chatRoom} />
        ))}
      </ul>
    </main>
  );
};
