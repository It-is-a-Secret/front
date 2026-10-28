export const QUERY_KEYS = {
  onboarding: {
    all: ['onboarding'] as const,
    keywords: () => [...QUERY_KEYS.onboarding.all, 'keywords'] as const,
    images: () => [...QUERY_KEYS.onboarding.all, 'images'] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: () => [...QUERY_KEYS.profile.all, 'me'] as const,
    images: (feedId: number) =>
      [...QUERY_KEYS.profile.all, feedId, 'images'] as const,
  },
  discovery: {
    all: ['discovery'] as const,
    detail: (feedId: number) =>
      [...QUERY_KEYS.discovery.all, 'detail', feedId] as const,
    list: (page = 0, size = 20) =>
      [...QUERY_KEYS.discovery.all, 'list', {page, size}] as const,
  },
  chat: {
    all: ['chat'] as const,
    rooms: () => [...QUERY_KEYS.chat.all, 'rooms'] as const,
    room: (roomId: number) => [...QUERY_KEYS.chat.all, 'room', roomId] as const,
    revealedImages: (roomId: number) =>
      [...QUERY_KEYS.chat.room(roomId), 'revealed-images'] as const,
    messages: (roomId: number, size = 30) =>
      [...QUERY_KEYS.chat.room(roomId), 'messages', {size}] as const,
  },
  common: {
    all: ['common'] as const,
    ping: () => [...QUERY_KEYS.common.all, 'ping'] as const,
  },
} as const;
