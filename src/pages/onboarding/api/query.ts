import {mutationOptions, queryOptions} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {api, API_ENDPOINT, QUERY_KEYS} from '@/shared/api';

import type {
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
  GetKeywordCatalogResponse,
  GetMyImagesResponse,
  IssuePresignedUrlsRequest,
  IssuePresignedUrlsResponse,
  SaveImagesRequest,
  SaveImagesResponse,
} from './type';

const completeOnboarding = async (body: CompleteOnboardingRequest) => {
  try {
    return await api
      .post(API_ENDPOINT.onboarding.complete, {json: body})
      .json<CompleteOnboardingResponse>();
  } catch (error) {
    if (isHTTPError(error)) {
      const data = error.data as {message?: string} | undefined;
      throw new Error(data?.message || '온보딩을 완료하지 못했어요.', {
        cause: error,
      });
    }

    throw new Error('네트워크 연결을 확인한 뒤 다시 시도해 주세요.', {
      cause: error,
    });
  }
};

const getKeywordCatalog = () =>
  api.get(API_ENDPOINT.onboarding.keywords).json<GetKeywordCatalogResponse>();

const getMyImages = () =>
  api.get(API_ENDPOINT.onboarding.images).json<GetMyImagesResponse>();

export const issuePresignedUrls = (body: IssuePresignedUrlsRequest) =>
  api
    .post(API_ENDPOINT.onboarding.presignedUrls, {json: body})
    .json<IssuePresignedUrlsResponse>();

export const saveImages = (body: SaveImagesRequest) =>
  api
    .post(API_ENDPOINT.onboarding.images, {json: body})
    .json<SaveImagesResponse>();

export const ONBOARDING_QUERY_OPTIONS = {
  KEYWORDS: () =>
    queryOptions({
      queryKey: QUERY_KEYS.onboarding.keywords(),
      queryFn: getKeywordCatalog,
    }),
  IMAGES: () =>
    queryOptions({
      queryKey: QUERY_KEYS.onboarding.images(),
      queryFn: getMyImages,
    }),
};

export const ONBOARDING_MUTATION_OPTIONS = {
  COMPLETE: () => mutationOptions({mutationFn: completeOnboarding}),
  ISSUE_PRESIGNED_URLS: () => mutationOptions({mutationFn: issuePresignedUrls}),
  SAVE_IMAGES: () => mutationOptions({mutationFn: saveImages}),
};
