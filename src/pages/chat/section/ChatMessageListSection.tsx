import {ChatMessage} from '@/pages/chat/components/ChatMessage';

const MOCK_MESSAGES = [
  {
    id: 1,
    content: '최근엔 빌 에반스 자주 들어요',
    sentAt: '15:45',
    isMine: false,
  },
  {
    id: 2,
    content: '헐 그러시구나',
    sentAt: '15:50',
    isMine: true,
    isRead: false,
  },
  {
    id: 3,
    content: '저는 요즘 쳇 베이커 많이 들어요',
    sentAt: '15:51',
    isMine: true,
    isRead: true,
  },
  {
    id: 4,
    content: '오 좋다. 그럼 다음에 추천곡 공유해줘요',
    sentAt: '15:53',
    isMine: false,
  },
];

export const ChatMessageListSection = () => {
  return (
    <section className='min-h-0 flex-1 overflow-y-auto px-[2rem] py-[2.4rem]'>
      <ul className='flex flex-col gap-[1.6rem]'>
        {MOCK_MESSAGES.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            sentAt={message.sentAt}
            isMine={message.isMine}
            isRead={message.isRead}
          />
        ))}
      </ul>
    </section>
  );
};
