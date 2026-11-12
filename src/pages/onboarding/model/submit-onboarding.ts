import type {
  CompleteOnboardingRequest,
  GetKeywordCatalogResponse,
} from '../api/type';
import {buildCompleteOnboardingRequest} from './complete-onboarding';
import type {OnboardingDraft} from './onboarding-draft';

interface SubmitOnboardingApi {
  isOnboardingComplete: () => Promise<boolean>;
  getKeywordCatalog: () => Promise<GetKeywordCatalogResponse>;
  completeOnboarding: (body: CompleteOnboardingRequest) => Promise<unknown>;
  uploadImages: (draft: OnboardingDraft) => Promise<unknown>;
}

export const submitOnboarding = async (
  draft: OnboardingDraft,
  api: SubmitOnboardingApi
) => {
  // Completion creates the feed required by image storage. Recheck the server
  // on retries because completion may have succeeded before an upload failed.
  if (!(await api.isOnboardingComplete())) {
    const catalog = await api.getKeywordCatalog();
    const body = buildCompleteOnboardingRequest(draft, catalog);
    await api.completeOnboarding(body);
  }

  await api.uploadImages(draft);
};
