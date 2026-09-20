import type {components} from '@/shared/types/schema';

export type CompleteOnboardingRequest =
  components['schemas']['OnboardingRequest'];
export type CompleteOnboardingResponse =
  components['schemas']['DataResponseMemberProfileResponse'];

export type GetKeywordCatalogResponse =
  components['schemas']['DataResponseListKeywordCategoryResponse'];
export type GetMyImagesResponse =
  components['schemas']['DataResponseMyFeedImagesResponse'];

export type IssuePresignedUrlsRequest =
  components['schemas']['PresignedUrlRequest'];
export type IssuePresignedUrlsResponse =
  components['schemas']['DataResponsePresignedUrlResponse'];
export type SaveImagesRequest = components['schemas']['FeedImageSaveRequest'];
export type SaveImagesResponse =
  components['schemas']['DataResponseFeedImageResponse'];
