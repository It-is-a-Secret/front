import {isHTTPError} from 'ky';

export const isAuthenticationError = (error: unknown) =>
  isHTTPError(error) && [401, 403].includes(error.response.status);
