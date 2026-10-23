import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {api, API_ENDPOINT, QUERY_KEYS} from '@/shared/api';
import {
  preserveRealtimeMessages,
  preserveRoomProgress,
} from '../utils/chat-message-cache';

import type {
  GetChatMessagesParams,
  GetChatMessagesResponse,
  GetChatRoomResponse,
  GetChatRoomsResponse,
  GetRevealedImagesResponse,
} from './type';

const getChatRooms = (signal?: AbortSignal) =>
  api.get(API_ENDPOINT.chat.rooms, {signal}).json<GetChatRoomsResponse>();

const getChatRoom = async (roomId: number) => {
  const response = await api
    .get(API_ENDPOINT.chat.room(roomId))
    .json<GetChatRoomResponse>();
  if (!response.data) {
    throw new Error('채팅방 정보가 없습니다.');
  }
  return response;
};

const getRevealedImages = async (roomId: number, signal?: AbortSignal) => {
  const response = await api
    .get(API_ENDPOINT.chat.revealedImages(roomId), {signal})
    .json<GetRevealedImagesResponse>();
  if (!Array.isArray(response.data?.images))
    throw new Error('사진 목록 응답이 올바르지 않습니다.');
  return response;
};

const getChatMessages = async (
  roomId: number,
  params?: GetChatMessagesParams
) => {
  const response = await api
    .get(API_ENDPOINT.chat.messages(roomId), {searchParams: params})
    .json<GetChatMessagesResponse>();
  if (!Array.isArray(response.data)) {
    throw new Error('메시지 목록 응답이 올바르지 않습니다.');
  }
  return response;
};

const leaveChatRoom = (roomId: number) =>
  api.post(API_ENDPOINT.chat.leaveRoom(roomId));

export const CHAT_QUERY_OPTIONS = {
  ROOMS: () =>
    queryOptions({
      queryKey: QUERY_KEYS.chat.rooms(),
      queryFn: ({signal}) => getChatRooms(signal),
      staleTime: 0,
      refetchOnMount: 'always',
    }),
  ROOM: (roomId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.chat.room(roomId),
      queryFn: () => getChatRoom(roomId),
      structuralSharing: preserveRoomProgress,
      staleTime: 0,
      refetchOnMount: 'always',
    }),
  REVEALED_IMAGES: (roomId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.chat.revealedImages(roomId),
      queryFn: ({signal}) => getRevealedImages(roomId, signal),
      staleTime: 60000,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      refetchInterval: (query) =>
        query.state.status === 'error' ? false : 4 * 60 * 1000,
      retry: (failureCount, error) => {
        if (
          isHTTPError(error) &&
          [403, 404, 409].includes(error.response.status)
        )
          return false;
        return failureCount < 1;
      },
    }),
  MESSAGES: (roomId: number, {size = 30}: {size?: number} = {}) =>
    infiniteQueryOptions({
      queryKey: QUERY_KEYS.chat.messages(roomId, size),
      queryFn: ({pageParam}) =>
        getChatMessages(roomId, {size, cursor: pageParam}),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => {
        const messages = lastPage.data ?? [];
        if (messages.length < size) return undefined;
        return messages.at(-1)?.messageId;
      },
      staleTime: 5000,
      structuralSharing: preserveRealtimeMessages,
    }),
};

export const CHAT_MUTATION_OPTIONS = {
  LEAVE: () => mutationOptions({mutationFn: leaveChatRoom}),
};
