import {mutationOptions, queryOptions} from '@tanstack/react-query';

import {api, API_ENDPOINT, QUERY_KEYS} from '@/shared/api';

import type {
  GetDiscoveryParams,
  GetDiscoveryResponse,
  StartChatRequest,
  StartChatResponse,
} from './type';

interface StartChatVariables {
  feedId: number;
  body: StartChatRequest;
}

const getDiscovery = (params?: GetDiscoveryParams) =>
  api
    .get(API_ENDPOINT.discovery.list, {searchParams: params})
    .json<GetDiscoveryResponse>();

const startChat = async ({feedId, body}: StartChatVariables) => {
  const response = await api
    .post(API_ENDPOINT.discovery.startChat(feedId), {json: body})
    .json<StartChatResponse>();

  const roomId = response.data?.roomId;
  if (!roomId || !Number.isSafeInteger(roomId) || roomId <= 0) {
    throw new Error('채팅방 정보를 확인하지 못했어요. 다시 시도해 주세요.');
  }

  return {...response, data: {...response.data, roomId}};
};

export const HOME_QUERY_OPTIONS = {
  DISCOVERY: (params?: GetDiscoveryParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.discovery.list(params?.page, params?.size),
      queryFn: () => getDiscovery(params),
    }),
};

export const HOME_MUTATION_OPTIONS = {
  START_CHAT: () => mutationOptions({mutationFn: startChat, retry: false}),
};
