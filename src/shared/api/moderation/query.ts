import {mutationOptions} from '@tanstack/react-query';

import {api} from '@/shared/api/config/instance';
import {API_ENDPOINT} from '@/shared/api/end-point';

import type {BlockRequest, ReportRequest} from './type';

const reportMember = (body: ReportRequest) =>
  api.post(API_ENDPOINT.moderation.reports, {json: body});

const blockMember = (body: BlockRequest) =>
  api.post(API_ENDPOINT.moderation.blocks, {json: body});

const unblockMember = (targetMemberId: number) =>
  api.delete(API_ENDPOINT.moderation.unblock(targetMemberId));

export const MODERATION_MUTATION_OPTIONS = {
  REPORT: () => mutationOptions({mutationFn: reportMember}),
  BLOCK: () => mutationOptions({mutationFn: blockMember}),
  UNBLOCK: () => mutationOptions({mutationFn: unblockMember}),
};
