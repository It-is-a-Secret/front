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

export type GenderType = 'male' | 'female';

export type InterestStep =
  | 'hobby'
  | 'foodStyle'
  | 'lifeStyle'
  | 'personalityConversation'
  | 'dateStyle'
  | 'contactRelationship'
  | 'pet'
  | 'valueInterest';

export type OnboardingStep =
  | 'nickname'
  | 'gender'
  | 'birthYear'
  | 'department'
  | 'mbti'
  | InterestStep
  | 'photoUpload'
  | 'complete';

export const INTEREST_STEPS: InterestStep[] = [
  'hobby',
  'foodStyle',
  'lifeStyle',
  'personalityConversation',
  'dateStyle',
  'contactRelationship',
  'pet',
  'valueInterest',
];

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'nickname',
  'gender',
  'birthYear',
  'department',
  'mbti',
  ...INTEREST_STEPS,
  'photoUpload',
  'complete',
];

export const ONBOARDING_STEP_PROGRESS: Record<OnboardingStep, number> = {
  nickname: 7,
  gender: 14,
  birthYear: 21,
  department: 28,
  mbti: 35,
  hobby: 42,
  foodStyle: 49,
  lifeStyle: 56,
  personalityConversation: 63,
  dateStyle: 70,
  contactRelationship: 77,
  pet: 84,
  valueInterest: 91,
  photoUpload: 100,
  complete: 100,
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

export const INTEREST_CATEGORIES = [
  {
    category: '취미/여가',
    items: [
      '운동',
      '산책',
      '독서/글쓰기',
      '전시/영화',
      'OTT',
      '게임',
      '여행/캠핑',
      '공연/콘서트',
    ],
  },
  {
    category: '음식 스타일',
    items: [
      '디저트러버',
      '매운맛러버',
      '고기러버',
      '해산물러버',
      '한식',
      '양식',
      '일식',
      '가벼운음주',
    ],
  },
  {
    category: '라이프 스타일',
    items: [
      '집순이/집돌이',
      '밖순이/밖돌이',
      '아침형',
      '야행형',
      '즉흥',
      '계획형',
      '미니멀',
      '맥시멈',
      '깔끔함',
    ],
  },
  {
    category: '성격/대화 스타일',
    items: [
      '다정함',
      '유쾌함',
      '차분함',
      '활발함',
      '솔직함',
      '센스있음',
      '수다쟁이',
      '경청형',
      '장난많음',
      '낯가림',
      '진지토크',
    ],
  },
  {
    category: '데이트 취향',
    items: [
      '카페데이트',
      '맛집데이트',
      '영화/전시데이트',
      '액티비티데이트',
      '즉흥데이트',
      '계획데이트',
      '집데이트',
      '드라이브',
    ],
  },
  {
    category: '연락/관계 스타일',
    items: [
      '연락자주',
      '연락필요할때',
      '빠른답장',
      '느긋한답장',
      '천천히친해짐',
      '빠르게친해짐',
      '표현많음',
      '편안한관계',
      '기념일챙김',
    ],
  },
  {
    category: '반려동물',
    items: [
      '강아지좋아함',
      '고양이좋아함',
      '반려동물있음',
      '반려동물없음',
      '동물좋아함',
    ],
  },
  {
    category: '가치관/관심사',
    items: [
      '자기계발',
      '커리어',
      '재테크',
      '건강관리',
      '안정감',
      '도전적인',
      '가족중시',
      '인간관계중시',
    ],
  },
] as const;

export type InterestCategory = (typeof INTEREST_CATEGORIES)[number];
export type InterestCategoryName = InterestCategory['category'];
export type InterestItem = InterestCategory['items'][number];
export type SelectedInterests = Partial<Record<InterestStep, InterestItem[]>>;

export const MAX_INTEREST_COUNT = 3;
