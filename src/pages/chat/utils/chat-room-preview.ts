import type {QueryClient} from '@tanstack/react-query';
import type {
  ChatMessageResponse,
  ChatRoomSummary,
  GetChatRoomsResponse,
} from '../api/type';
import {QUERY_KEYS} from '@/shared/api/config/query-key';

const messageId = (room: ChatRoomSummary) =>
  Math.max(room.lastMessageId ?? 0, room.lastMessage?.messageId ?? 0);

export const sortChatRooms = (rooms: ChatRoomSummary[]) =>
  [...rooms].sort((a, b) => {
    const timeA = Date.parse(a.lastMessage?.createdAt ?? '') || 0;
    const timeB = Date.parse(b.lastMessage?.createdAt ?? '') || 0;
    return timeB - timeA || messageId(b) - messageId(a);
  });

export const preserveChatRoomPreviews = (
  previous: unknown,
  incoming: unknown
): GetChatRoomsResponse => {
  const old = previous as GetChatRoomsResponse | undefined;
  const next = incoming as GetChatRoomsResponse;
  const previousRooms = new Map(old?.data?.map((room) => [room.roomId, room]));
  return {
    ...next,
    data: sortChatRooms(
      (next.data ?? []).map((room) => {
        const cached = previousRooms.get(room.roomId);
        return cached?.lastMessage &&
          (messageId(cached) > messageId(room) ||
            (!room.lastMessage && messageId(cached) === messageId(room)))
          ? {
              ...room,
              lastMessageId: messageId(cached),
              lastMessage: cached.lastMessage,
            }
          : room;
      })
    ),
  };
};

export const updateChatRoomPreview = (
  queryClient: QueryClient,
  roomId: number,
  message: ChatMessageResponse,
  newRoom?: ChatRoomSummary
) => {
  queryClient.setQueryData<GetChatRoomsResponse>(
    QUERY_KEYS.chat.rooms(),
    (old) => {
      const rooms = old?.data ?? [];
      const existing = rooms.find((room) => room.roomId === roomId);
      if (!existing && !newRoom) return old;
      if (
        existing?.lastMessage &&
        messageId(existing) >= (message.messageId ?? 0)
      )
        return old;
      return {
        ...old,
        data: sortChatRooms([
          ...rooms.filter((room) => room.roomId !== roomId),
          {
            ...(existing ?? newRoom),
            roomId,
            lastMessageId: message.messageId,
            lastMessage: message,
          },
        ]),
      };
    }
  );
};
