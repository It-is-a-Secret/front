import ky from 'ky';

import {
  handleCheckAndSetToken,
  handleUnauthorizedResponse,
} from '@/shared/api/config/interceptor';

export const publicApi = ky.create({
  prefix: import.meta.env.VITE_BASE_URL,
  credentials: 'include',
  retry: 0,
});

export const api = ky.create({
  prefix: import.meta.env.VITE_BASE_URL,
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
