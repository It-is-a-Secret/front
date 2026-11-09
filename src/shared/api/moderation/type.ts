import type {components} from '@/shared/types/schema';

export type ReportRequest = components['schemas']['ReportRequest'];
export type BlockRequest = components['schemas']['BlockRequest'];
export type BlockedMember = components['schemas']['BlockedMemberResponse'];
export type GetBlockedMembersResponse =
  components['schemas']['DataResponseListBlockedMemberResponse'];
