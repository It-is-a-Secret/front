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

export const DEPARTMENTS = [
  '국어국문학과',
  '영어언어문화학과',
  '러시아문화학과',
  '중국언어문화학과',
  '유아교육과',
  '신학과',
  '기독교교육과',
  '공연예술학과',
  '음악학과',
  '디지털미디어디자인학과',
  '화장품발명디자인학과',
  '뷰티메디컬디자인학과',
  '글로벌경영학과',
  '행정학과',
  '관광경영학과',
  '식품영양학과',
  '컴퓨터공학과',
  '정보전기전자공학과',
  '통계데이터사이언스학과',
  '소프트웨어학과',
  '도시정보공학과',
  '환경에너지공학과',
  'AI융합학과',
  '컴퓨터공학과',
  '자율전공',
  '인문자율전공',
  '이공자율전공',
  '사회자율전공',
] as const;

export type DepartmentName = (typeof DEPARTMENTS)[number];
