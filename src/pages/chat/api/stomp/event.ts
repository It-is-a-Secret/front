import type {ChatMessageResponse, ChatRoomSummary} from '../type';

export type ChatMessageEvent = ChatMessageResponse & {
  roomId: number;
  messageId: number;
  content: string;
  createdAt: string;
};
export interface ChatReadEvent {
  eventType: 'READ';
  roomId: number;
  readerId: number;
  lastReadMessageId: number;
}
export interface ChatProgressEvent {
  eventType: 'PROGRESS_CHANGED';
  roomId: number;
  progressStatus: NonNullable<ChatRoomSummary['progressStatus']>;
}
export interface ChatServerError {
  status: number;
  code: string;
  message: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isId = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

export const isChatMessage = (value: unknown): value is ChatMessageEvent =>
  isRecord(value) &&
  isId(value.roomId) &&
  isId(value.messageId) &&
  ['TEXT', 'IMAGE', 'SYSTEM'].includes(String(value.type)) &&
  (value.type === 'SYSTEM' || isId(value.senderId)) &&
  typeof value.content === 'string' &&
  typeof value.createdAt === 'string';

export const parseRoomEvent = (
  body: string
): ChatMessageEvent | ChatReadEvent | ChatProgressEvent | null => {
  const value: unknown = JSON.parse(body);
  if (!isRecord(value) || !isId(value.roomId)) return null;
  if (
    value.eventType === 'READ' &&
    isId(value.readerId) &&
    isId(value.lastReadMessageId)
  ) {
    return {
      eventType: 'READ',
      roomId: value.roomId,
      readerId: value.readerId,
      lastReadMessageId: value.lastReadMessageId,
    };
  }
  if (
    value.eventType === 'PROGRESS_CHANGED' &&
    [
      'MATCHED',
      'PHOTO_REVEAL_STEP_1',
      'PHOTO_REVEAL_STEP_2',
      'PHOTO_REVEAL_STEP_3',
      'PHOTO_REVEAL_STEP_4',
      'COMPLETED',
    ].includes(String(value.progressStatus))
  ) {
    return {
      eventType: 'PROGRESS_CHANGED',
      roomId: value.roomId,
      progressStatus:
        value.progressStatus as ChatProgressEvent['progressStatus'],
    };
  }
  return value.eventType == null && isChatMessage(value) ? value : null;
};

export const parseServerError = (body: string): ChatServerError | null => {
  const value: unknown = JSON.parse(body);
  return isRecord(value) &&
    typeof value.status === 'number' &&
    typeof value.code === 'string' &&
    typeof value.message === 'string'
    ? {status: value.status, code: value.code, message: value.message}
    : null;
};

export const parseNotification = (body: string) => {
  const value: unknown = JSON.parse(body);
  return isRecord(value) &&
    ['NEW_ROOM', 'NEW_MESSAGE'].includes(String(value.type)) &&
    isId(value.roomId) &&
    isChatMessage(value.message) &&
    value.message.roomId === value.roomId
    ? {roomId: value.roomId, message: value.message}
    : null;
};
