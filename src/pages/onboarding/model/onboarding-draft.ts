import type {
  BlurStrength,
  GenderType,
  MbtiType,
  OnboardingStep,
  SelectedInterests,
} from '@/pages/onboarding/constants/constants';
import {
  createInitialPhotoSlots,
  type PhotoSlot,
} from '@/pages/onboarding/hooks/usePhotoUploadSlots';

export interface OnboardingDraft {
  step: OnboardingStep;
  nickname: string;
  selectedGender: GenderType | null;
  birthYear: number;
  department: string;
  selectedMbti: MbtiType | null;
  selectedInterests: SelectedInterests;
  blurStrength: BlurStrength;
  photoSlots: PhotoSlot[];
}

export const createInitialOnboardingDraft = (): OnboardingDraft => ({
  step: 'nickname',
  nickname: '',
  selectedGender: null,
  birthYear: 2005,
  department: '',
  selectedMbti: null,
  selectedInterests: {},
  blurStrength: 70,
  photoSlots: createInitialPhotoSlots(),
});
