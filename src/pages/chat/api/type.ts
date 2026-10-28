import type {components, operations} from '@/shared/types/schema';

export type ChatRoomSummary = components['schemas']['ChatRoomSummaryResponse'];
export type ChatMessageResponse = components['schemas']['ChatMessageResponse'];

export type GetChatRoomsResponse =
  components['schemas']['DataResponseListChatRoomSummaryResponse'];
export type GetChatRoomResponse =
  components['schemas']['DataResponseChatRoomSummaryResponse'];
export type GetRevealedImagesResponse =
  components['schemas']['DataResponseRevealedFeedImagesResponse'];
export type RevealedImage = components['schemas']['RevealedFeedImageItem'];

export type GetChatMessagesParams =
  operations['getMessages']['parameters']['query'];
export type GetChatMessagesResponse =
  components['schemas']['DataResponseListChatMessageResponse'];
