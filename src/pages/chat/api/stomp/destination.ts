export const CHAT_DESTINATION = {
  ERRORS: '/user/queue/errors',
  NOTIFICATIONS: '/user/queue/rooms',
  ROOM: (roomId: number) => `/topic/rooms/${roomId}`,
  SEND: (roomId: number) => `/app/rooms/${roomId}/send`,
  READ: (roomId: number) => `/app/rooms/${roomId}/read`,
} as const;
