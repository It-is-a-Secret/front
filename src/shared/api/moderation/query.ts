import {mutationOptions, queryOptions} from '@tanstack/react-query';

import {api} from '@/shared/api/config/instance';
import {API_ENDPOINT} from '@/shared/api/end-point';
import {QUERY_KEYS} from '@/shared/api/config/query-key';

import type {
  BlockRequest,
  ReportRequest,
  GetBlockedMembersResponse,
} from './type';

const getBlockedMembers = async (signal: AbortSignal) => {
  const response = await api
    .get(API_ENDPOINT.moderation.blocks, {signal})
    .json<GetBlockedMembersResponse>();
  if (!Array.isArray(response.data)) {
    throw new Error('차단 목록을 확인하지 못했어요. 다시 시도해 주세요.');
  }
  return response;
};

export const MODERATION_QUERY_OPTIONS = {
  BLOCKS: () =>
    queryOptions({
      queryKey: QUERY_KEYS.moderation.blocks(),
      queryFn: ({signal}) => getBlockedMembers(signal),
      staleTime: 0,
      refetchOnMount: 'always',
    }),
};

const reportMember = (body: ReportRequest) =>
  api.post(API_ENDPOINT.moderation.reports, {json: body});

const blockMember = (body: BlockRequest) =>
  api.post(API_ENDPOINT.moderation.blocks, {json: body});

const unblockMember = (targetMemberId: number) =>
  api.delete(API_ENDPOINT.moderation.unblock(targetMemberId));

export const MODERATION_MUTATION_OPTIONS = {
  REPORT: () => mutationOptions({mutationFn: reportMember}),
  BLOCK: () => mutationOptions({mutationFn: blockMember}),
  UNBLOCK: () => mutationOptions({mutationFn: unblockMember, retry: false}),
};
