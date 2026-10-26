import {mutationOptions, queryOptions} from '@tanstack/react-query';

import {api, API_ENDPOINT, QUERY_KEYS} from '@/shared/api';

import type {
  GetMyProfileResponse,
  NicknameAvailabilityResponse,
  UpdateProfileRequest,
} from './type';

const getMyProfile = () =>
  api.get(API_ENDPOINT.profile.me).json<GetMyProfileResponse>();

const updateProfile = (body: UpdateProfileRequest) =>
  api
    .put(API_ENDPOINT.profile.update, {json: body})
    .json<GetMyProfileResponse>();

const checkNickname = (nickName: string) =>
  api
    .get(API_ENDPOINT.profile.nicknameAvailability, {
      searchParams: {nickName},
    })
    .json<NicknameAvailabilityResponse>();

export const MY_MUTATION_OPTIONS = {
  UPDATE_PROFILE: () => mutationOptions({mutationFn: updateProfile}),
  CHECK_NICKNAME: () => mutationOptions({mutationFn: checkNickname}),
};

export const MY_QUERY_OPTIONS = {
  PROFILE: () =>
    queryOptions({
      queryKey: QUERY_KEYS.profile.me(),
      queryFn: getMyProfile,
    }),
};
