import type {paths} from '@/shared/types/schema';

export type GetChatRoomsResponse =
  paths['/api/chat/rooms']['get']['responses'][200]['content']['*/*'];

export type GetChatRoomPathParams =
  paths['/api/chat/rooms/{roomId}']['get']['parameters']['path'];

export type GetChatRoomResponse =
  paths['/api/chat/rooms/{roomId}']['get']['responses'][200]['content']['*/*'];

export type GetChatMessagesPathParams =
  paths['/api/chat/rooms/{roomId}/messages']['get']['parameters']['path'];

export type GetChatMessagesQuery =
  paths['/api/chat/rooms/{roomId}/messages']['get']['parameters']['query'];

export type GetChatMessagesResponse =
  paths['/api/chat/rooms/{roomId}/messages']['get']['responses'][200]['content']['*/*'];

export type AgreeProgressPathParams =
  paths['/api/chat/rooms/{roomId}/progress/agree']['post']['parameters']['path'];

export type AgreeProgressResponse =
  paths['/api/chat/rooms/{roomId}/progress/agree']['post']['responses'][200]['content']['*/*'];

export type LeaveChatRoomPathParams =
  paths['/api/chat/rooms/{roomId}/leave']['post']['parameters']['path'];
