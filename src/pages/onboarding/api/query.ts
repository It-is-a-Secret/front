import {mutationOptions, queryOptions} from '@tanstack/react-query';

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

const completeOnboarding = (body: CompleteOnboardingRequest) =>
  api
    .post(API_ENDPOINT.onboarding.complete, {json: body})
    .json<CompleteOnboardingResponse>();

const getKeywordCatalog = () =>
  api.get(API_ENDPOINT.onboarding.keywords).json<GetKeywordCatalogResponse>();

const getMyImages = () =>
  api.get(API_ENDPOINT.onboarding.images).json<GetMyImagesResponse>();

const issuePresignedUrls = (body: IssuePresignedUrlsRequest) =>
  api
    .post(API_ENDPOINT.onboarding.presignedUrls, {json: body})
    .json<IssuePresignedUrlsResponse>();

const saveImages = (body: SaveImagesRequest) =>
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
