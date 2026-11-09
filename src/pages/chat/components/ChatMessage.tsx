import type {ChatMessageResponse} from '@/pages/chat/api/type';
import {formatChatTime} from '@/pages/chat/utils/format-chat-time';

interface ChatMessageProps extends Pick<
  ChatMessageResponse,
  'content' | 'createdAt' | 'type'
> {
  isMine: boolean;
  isRead?: boolean;
}

export const ChatMessage = ({
  content,
  createdAt,
  type,
  isMine,
  isRead,
}: ChatMessageProps) => {
  const meta = (
    <span className='text-caption1-12r text-gray-800'>
      {isMine && (isRead ? '' : '안읽음•')}
      <time dateTime={createdAt}>{formatChatTime(createdAt)}</time>
    </span>
  );

  const bubbleClassName = isMine
    ? 'rounded-[2rem] rounded-tr'
    : 'rounded-[2rem] rounded-tl';

  const bubble = (
    <p
      className={`text-input1-14r bg-primary-400 max-w-[24rem] px-[1.6rem] py-[0.8rem] break-words ${bubbleClassName}`}>
      {type === 'IMAGE' ? '사진 메시지' : content}
    </p>
  );

  return (
    <li className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className='flex items-end gap-[0.4rem]'>
        {isMine && meta}
        {bubble}
        {!isMine && meta}
      </div>
    </li>
  );
};
