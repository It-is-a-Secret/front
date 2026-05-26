export const MBTI_TYPES = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
] as const;

export type MbtiType = (typeof MBTI_TYPES)[number];

export type OnboardingStep =
  | 'nickname'
  | 'birthYear'
  | 'department'
  | 'mbti'
  | 'category';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'nickname',
  'birthYear',
  'department',
  'mbti',
  'category',
];

export const ONBOARDING_STEP_PROGRESS: Record<OnboardingStep, number> = {
  nickname: 20,
  birthYear: 40,
  department: 60,
  mbti: 80,
  category: 100,
};

export const BIRTH_YEARS = Array.from(
  {length: 2007 - 2000 + 1},
  (_, index) => 2007 - index
);
