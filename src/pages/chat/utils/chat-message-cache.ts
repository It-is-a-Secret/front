import type {InfiniteData, QueryClient} from '@tanstack/react-query';

import type {
  ChatMessageResponse,
  GetChatMessagesResponse,
  GetChatRoomResponse,
} from '../api/type';
import {QUERY_KEYS} from '@/shared/api/config/query-key';
import {getRevealedPhotoCount} from './get-revealed-photo-count';

export const preserveRoomProgress = (
  previous: unknown,
  incoming: unknown
): GetChatRoomResponse => {
  const old = previous as GetChatRoomResponse | undefined;
  const next = incoming as GetChatRoomResponse;
  if (!old?.data || !next.data) return next;
  return {
    ...next,
    data: {
      ...next.data,
      ...(old.data.lastMessageId != null &&
      old.data.lastMessageId > (next.data.lastMessageId ?? 0)
        ? {
            lastMessageId: old.data.lastMessageId,
            lastMessage: old.data.lastMessage,
          }
        : {}),
      partnerLastReadMessageId:
        Math.max(
          old.data.partnerLastReadMessageId ?? 0,
          next.data.partnerLastReadMessageId ?? 0
        ) || undefined,
      progressStatus:
        getRevealedPhotoCount(old.data.progressStatus) >
        getRevealedPhotoCount(next.data.progressStatus)
          ? old.data.progressStatus
          : next.data.progressStatus,
    },
  };
};

export type ChatMessagePages = InfiniteData<
  GetChatMessagesResponse,
  number | undefined
>;

// REST 응답이 도착하는 사이 수신한 더 최신 메시지를 잃지 않게 합니다.
export const preserveRealtimeMessages = (
  previous: unknown,
  incoming: unknown
): ChatMessagePages => {
  const next = incoming as ChatMessagePages;
  const old = previous as ChatMessagePages | undefined;
  if (!old?.pages[0] || !next.pages[0]) return next;
  const firstPage = next.pages[0];
  const newestId = Math.max(
    0,
    ...(firstPage.data ?? []).map((message) => message.messageId ?? 0)
  );
  const newerMessages = (old.pages[0].data ?? []).filter(
    (message) => (message.messageId ?? 0) > newestId
  );
  if (!newerMessages.length) return next;
  return {
    ...next,
    pages: [
      {...firstPage, data: [...newerMessages, ...(firstPage.data ?? [])]},
      ...next.pages.slice(1),
    ],
  };
};

export const appendChatMessage = (
  queryClient: QueryClient,
  roomId: number,
  message: ChatMessageResponse
) => {
  const prefix = [...QUERY_KEYS.chat.room(roomId), 'messages'];
  const queries = queryClient.getQueriesData<ChatMessagePages>({
    queryKey: prefix,
  });
  for (const [key] of queries) {
    queryClient.setQueryData<ChatMessagePages>(key, (old) => {
      if (!old?.pages.length)
        return {pages: [{data: [message]}], pageParams: [undefined]};
      if (
        old.pages.some((page) =>
          page.data?.some((item) => item.messageId === message.messageId)
        )
      )
        return old;
      return {
        ...old,
        pages: [
          {
            ...old.pages[0],
            data: [message, ...(old.pages[0].data ?? [])].sort(
              (a, b) => (b.messageId ?? 0) - (a.messageId ?? 0)
            ),
          },
          ...old.pages.slice(1),
        ],
      };
    });
  }
};
