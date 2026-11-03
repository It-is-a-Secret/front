import type {components} from '@/shared/types/schema';

export const getChatEntryPath = (
  feedId: number,
  chatRoom: components['schemas']['DiscoveryChatRoom'] | null | undefined
) => {
  const roomId = chatRoom?.roomId;
  return typeof roomId === 'number' &&
    Number.isSafeInteger(roomId) &&
    roomId > 0
    ? `/chat/${roomId}`
    : `/chat/new/${feedId}`;
};

export const getStartChatDraft = (
  created: boolean | undefined,
  message: string
) => (created === false ? message : '');

export const readChatDraft = (state: unknown) =>
  typeof state === 'object' &&
  state !== null &&
  'draftMessage' in state &&
  typeof state.draftMessage === 'string'
    ? state.draftMessage
    : '';
