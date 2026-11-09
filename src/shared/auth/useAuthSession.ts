import {useQuery} from '@tanstack/react-query';

import {authSessionQueryOptions} from './session-query';

export const useAuthSession = () => {
  const sessionQuery = useQuery(authSessionQueryOptions());

  return {
    ...sessionQuery,
    memberId: sessionQuery.isSuccess ? sessionQuery.data.memberId : null,
    isAuthenticated: sessionQuery.isSuccess,
  };
};
