import {useEffect, useMemo} from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {CHAT_QUERY_OPTIONS} from '@/pages/chat/api/query';
import {getRevealedPhotoCount} from '@/pages/chat/utils/get-revealed-photo-count';
import {useAuthSession} from '@/shared/auth/useAuthSession';
import {updateChatRoomPreview} from '@/pages/chat/utils/chat-room-preview';

export const useChatRoomQuery = (roomId: number) => {
  const queryClient = useQueryClient();
  const {memberId} = useAuthSession();
  const roomQuery = useQuery({
    ...CHAT_QUERY_OPTIONS.ROOM(roomId),
    enabled: memberId !== null,
  });
  const messagesQuery = useInfiniteQuery({
    ...CHAT_QUERY_OPTIONS.MESSAGES(roomId),
    enabled: memberId !== null,
  });
  const room = roomQuery.data?.data;
  const messages = useMemo(() => {
    const fetchedMessages =
      messagesQuery.data?.pages.flatMap((page) => page.data ?? []) ?? [];
    return [
      ...new Map(
        fetchedMessages.map((item) => [item.messageId, item])
      ).values(),
    ].sort((a, b) => (a.messageId ?? 0) - (b.messageId ?? 0));
  }, [messagesQuery.data]);
  const latestMessage = messages.at(-1);
  useEffect(() => {
    if (room && latestMessage) {
      updateChatRoomPreview(queryClient, roomId, latestMessage, room);
    }
  }, [queryClient, roomId, room, latestMessage]);

  const error = roomQuery.isError
    ? roomQuery.error
    : messagesQuery.isError && !messagesQuery.data
      ? messagesQuery.error
      : null;

  const retry = () => {
    void roomQuery.refetch();
    void messagesQuery.refetch();
  };

  return {
    memberId,
    room,
    messages,
    messagesQuery,
    partnerNickname: room?.partnerNickname?.trim() || '상대방',
    publicPhotoCount: getRevealedPhotoCount(room?.progressStatus),
    isLoading:
      roomQuery.isPending || messagesQuery.isPending || memberId === null,
    error,
    isUnavailable:
      isHTTPError(error) && [403, 404].includes(error.response.status),
    isRetrying: roomQuery.isFetching || messagesQuery.isFetching,
    retry,
  };
};
