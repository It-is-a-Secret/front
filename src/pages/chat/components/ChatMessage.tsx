interface ChatMessageProps {
  content: string;
  sentAt: string;
  isMine: boolean;
  isRead?: boolean;
}

export const ChatMessage = ({
  content,
  sentAt,
  isMine,
  isRead,
}: ChatMessageProps) => {
  const meta = (
    <span className='text-caption1-12r text-gray-800'>
      {isMine && (isRead ? '' : '안읽음·')}
      {sentAt}
    </span>
  );

  const bubbleClassName = isMine
    ? 'rounded-[2rem] rounded-tr'
    : 'rounded-[2rem] rounded-tl';

  const bubble = (
    <p
      className={`text-input1-14r bg-primary-400 max-w-[24rem] px-[1.6rem] py-[0.8rem] break-words ${bubbleClassName}`}>
      {content}
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
