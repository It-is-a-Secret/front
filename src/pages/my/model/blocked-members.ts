import type {BlockedMember} from '@/shared/api/moderation/type';

export const getBlockedMemberDescription = (member: BlockedMember) =>
  [
    member.birthYear != null
      ? `${String(member.birthYear).slice(-2)}년생`
      : undefined,
    member.departmentLabel ?? member.department,
    member.mbti,
  ]
    .filter(Boolean)
    .join(' · ');
