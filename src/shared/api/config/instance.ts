import ky from 'ky';

import {
  handleCheckAndSetToken,
  handleUnauthorizedResponse,
} from '@/shared/api/config/interceptor';

export const publicApi = ky.create({
  // /api 요청은 프론트 서버의 프록시를 거쳐 RT 쿠키를 같은 출처에 보관합니다.
  credentials: 'include',
  retry: 0,
});

export const api = ky.create({
  credentials: 'include',
  retry: {
    limit: 1,
    methods: [],
    statusCodes: [],
  },

  hooks: {
    beforeRequest: [
      ({request}) => {
        handleCheckAndSetToken(request);
      },
    ],
    afterResponse: [handleUnauthorizedResponse],
  },
});
