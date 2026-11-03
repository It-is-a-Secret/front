export const API_ENDPOINT = {
  auth: {
    kakaoAuthorize: '/api/auth/oauth/kakao/authorize',
    kakaoCallback: '/api/auth/oauth/kakao/callback',
    refreshToken: '/api/auth/token/refresh',
    logout: '/api/auth/logout',
    sendSchoolEmailCode: '/api/members/me/school-email/verification-codes',
    verifySchoolEmail: '/api/members/me/school-email/verifications',
  },
  onboarding: {
    complete: '/api/members/me/onboarding',
    keywords: '/api/keywords',
    images: '/api/feeds/me/images',
    presignedUrls: '/api/feeds/me/images/presigned-urls',
  },
  profile: {
    me: '/api/members/me',
    images: (feedId: number) => `/api/feeds/${feedId}/images`,
  },
  discovery: {
    list: '/api/discovery',
    detail: (feedId: number) => `/api/discovery/feeds/${feedId}`,
    startChat: (feedId: number) => `/api/discovery/feeds/${feedId}/chat`,
  },
  chat: {
    rooms: '/api/chat/rooms',
    room: (roomId: number) => `/api/chat/rooms/${roomId}`,
    messages: (roomId: number) => `/api/chat/rooms/${roomId}/messages`,
    revealedImages: (roomId: number) =>
      `/api/chat/rooms/${roomId}/revealed-images`,
    leaveRoom: (roomId: number) => `/api/chat/rooms/${roomId}/leave`,
  },
  moderation: {
    reports: '/api/reports',
    blocks: '/api/blocks',
    unblock: (targetMemberId: number) => `/api/blocks/${targetMemberId}`,
  },
  common: {
    ping: '/api/ping',
  },
} as const;
