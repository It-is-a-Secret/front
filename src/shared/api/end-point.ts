export const API_ENDPOINT = {
  auth: {
    kakaoAuthorize: '/api/auth/oauth/kakao/authorize',
    kakaoCallback: '/api/auth/oauth/kakao/callback',
    refreshToken: '/api/auth/token/refresh',
    logout: '/api/auth/logout',
    sendSchoolEmailCode:
      '/api/members/me/school-email/verification-codes',
    verifySchoolEmail: '/api/members/me/school-email/verifications',
  },
  onboarding: {
    complete: '/api/members/me/onboarding',
  },
  profile: {
    me: '/api/members/me',
  },
  chat: {
    rooms: '/api/chat/rooms',
    room: (roomId: number) => `/api/chat/rooms/${roomId}`,
    messages: (roomId: number) => `/api/chat/rooms/${roomId}/messages`,
    agreeProgress: (roomId: number) =>
      `/api/chat/rooms/${roomId}/progress/agree`,
    leaveRoom: (roomId: number) => `/api/chat/rooms/${roomId}/leave`,
  },
  common: {
    ping: '/api/ping',
  },
} as const;
