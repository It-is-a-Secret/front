import {mutationOptions, queryOptions} from '@tanstack/react-query';

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

const getChatRoom = (roomId: number) =>
  api.get(API_ENDPOINT.chat.room(roomId)).json<GetChatRoomResponse>();

const getRevealedImages = (roomId: number) =>
  api
    .get(API_ENDPOINT.chat.revealedImages(roomId))
    .json<GetRevealedImagesResponse>();

const getChatMessages = (roomId: number, params?: GetChatMessagesParams) =>
  api
    .get(API_ENDPOINT.chat.messages(roomId), {searchParams: params})
    .json<GetChatMessagesResponse>();

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
    }),
  REVEALED_IMAGES: (roomId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.chat.revealedImages(roomId),
      queryFn: () => getRevealedImages(roomId),
    }),
  MESSAGES: (roomId: number, params?: GetChatMessagesParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.chat.messages(roomId, params?.size),
      queryFn: () => getChatMessages(roomId, params),
    }),
};

export const CHAT_MUTATION_OPTIONS = {
  LEAVE: () => mutationOptions({mutationFn: leaveChatRoom}),
};
