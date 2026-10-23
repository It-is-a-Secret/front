import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query';

import {api, API_ENDPOINT, QUERY_KEYS} from '@/shared/api';

import type {
  GetChatMessagesParams,
  GetChatMessagesResponse,
  GetChatRoomResponse,
  GetChatRoomsResponse,
  GetRevealedImagesResponse,
} from './type';

const getChatRooms = () =>
  api.get(API_ENDPOINT.chat.rooms).json<GetChatRoomsResponse>();

const getChatRoom = async (roomId: number) => {
  const response = await api
    .get(API_ENDPOINT.chat.room(roomId))
    .json<GetChatRoomResponse>();
  if (!response.data) {
    throw new Error('채팅방 정보가 없습니다.');
  }
  return response;
};

const getRevealedImages = (roomId: number) =>
  api
    .get(API_ENDPOINT.chat.revealedImages(roomId))
    .json<GetRevealedImagesResponse>();

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
      queryFn: getChatRooms,
      staleTime: 0,
      refetchOnMount: 'always',
    }),
  ROOM: (roomId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.chat.room(roomId),
      queryFn: () => getChatRoom(roomId),
      staleTime: 0,
      refetchOnMount: 'always',
    }),
  REVEALED_IMAGES: (roomId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.chat.revealedImages(roomId),
      queryFn: () => getRevealedImages(roomId),
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
    }),
};

export const CHAT_MUTATION_OPTIONS = {
  LEAVE: () => mutationOptions({mutationFn: leaveChatRoom}),
};
