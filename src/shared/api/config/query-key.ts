export const QUERY_KEYS = {
  profile: {
    all: ['profile'] as const,
    me: () => [...QUERY_KEYS.profile.all, 'me'] as const,
  },
  chat: {
    all: ['chat'] as const,
    rooms: () => [...QUERY_KEYS.chat.all, 'rooms'] as const,
    room: (roomId: number) => [...QUERY_KEYS.chat.all, 'room', roomId] as const,
    messages: (roomId: number, size = 30) =>
      [...QUERY_KEYS.chat.room(roomId), 'messages', {size}] as const,
  },
  common: {
    all: ['common'] as const,
    ping: () => [...QUERY_KEYS.common.all, 'ping'] as const,
  },
} as const;
