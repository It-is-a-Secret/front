import {Link} from 'react-router-dom';

import type {ChatRoomSummary} from '@/pages/chat/api/type';
import {formatChatRelativeTime} from '@/pages/chat/utils/format-chat-time';
import {getRevealedPhotoCount} from '@/pages/chat/utils/get-revealed-photo-count';

export const ChatListItem = ({
  roomId,
  partnerNickname,
  lastMessage,
  unreadCount = 0,
  progressStatus,
}: ChatRoomSummary) => {
  const hasUnread = unreadCount > 0;
  const publicPhotoCount = getRevealedPhotoCount(progressStatus);
  const sentAt = lastMessage?.createdAt
    ? formatChatRelativeTime(lastMessage.createdAt)
    : '';
  const preview = !lastMessage
    ? '아직 메시지가 없어요'
    : lastMessage.type === 'IMAGE'
      ? '사진을 보냈어요'
      : lastMessage.content;

  if (!roomId || !Number.isSafeInteger(roomId) || roomId < 0) {
    return null;
  }

  return (
    <li>
      <Link className='flex h-[7.3rem] gap-2 py-[1rem]' to={`/chat/${roomId}`}>
        <div className='flex w-full justify-between gap-[10px]'>
          <div className=''>
            <div className='flex items-center gap-[0.5rem]'>
              <p className='text-body2-15sb'>
                {partnerNickname?.trim() || '상대방'}
              </p>
              <span className='text-button2-10r bg-primary text-white-800 h-[1.6rem] w-[2.7rem] rounded-[12px] px-[0.6rem] py-[0.1px] text-center'>
                {publicPhotoCount}/5
              </span>
            </div>
            <p className='text-input1-14r w-[24.6rem] truncate text-gray-600'>
              {preview}
            </p>
          </div>

          <div className='flex flex-col items-end text-center'>
            {sentAt && (
              <time className='self-center' dateTime={lastMessage?.createdAt}>
                {sentAt}
              </time>
            )}

            {hasUnread && (
              <span
                aria-label={`읽지 않은 메시지 ${unreadCount}개`}
                className='bg-primary text-caption1-12r text-white-800 flex h-[2.1rem] min-w-[2.1rem] items-center justify-center rounded-full px-[0.5rem]'>
                {unreadCount >= 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
