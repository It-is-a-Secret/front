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
  | 'category'
  | 'photoUpload'
  | 'complete';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'nickname',
  'birthYear',
  'department',
  'mbti',
  'category',
  'photoUpload',
  'complete',
];

export const ONBOARDING_STEP_PROGRESS: Record<OnboardingStep, number> = {
  nickname: 16,
  birthYear: 32,
  department: 48,
  mbti: 64,
  category: 80,
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
      '러닝',
      '헬스',
      '등산',
      '자전거',
      '수영',
      '요가/필라테스',
      '클라이밍',
      '독서',
      '글쓰기',
      '공부',
      '전시/미술관',
      '사진',
      '드로잉',
      '영화',
      '드라마',
      '애니',
      '예능',
      '유튜브',
      '게임',
      '보드게임',
      '방탈출',
      'PC방',
      '음악감상',
      '공연/콘서트',
      '밴드/인디',
      'K-POP',
      '여행',
      '캠핑',
      '드라이브',
      '산책',
    ],
  },
  {
    category: '음식/카페',
    items: [
      '맛집탐방',
      '카페투어',
      '디저트',
      '빵순이/빵돌이',
      '커피러버',
      '술',
      '가성비',
      '와인',
      '맥주',
      '위스키',
      '매운맛러버',
      '고기러버',
      '회/해산물',
      '채식지향',
    ],
  },
  {
    category: '라이프스타일',
    items: [
      '집순이/집돌이',
      '밖순이/밖돌이',
      '즉흥',
      '계획형',
      '아침형',
      '밤형',
      '느긋함',
      '부지런함',
      '미니멀',
      '감성',
      '깔끔',
      '꾸준함',
    ],
  },
  {
    category: '성격/분위기',
    items: [
      '유쾌함',
      '다정함',
      '차분함',
      '솔직함',
      '배려',
      '센스',
      '수다',
      '경청',
      '리액션좋음',
      '트렌디',
      '진지토크',
      '낯가림',
      '친해지면 활발',
      '감정표현 잘함',
    ],
  },
  {
    category: '연애/데이트 취향',
    items: [
      '대화데이트',
      '카페데이트',
      '산책데이트',
      '맛집데이트',
      '활동데이트',
      '전시데이트',
      '영화데이트',
      '드라이브데이트',
      '천천히',
      '빠르게',
      '연락자주',
      '연락필요할때',
      '기념일챙김',
      '실용주의',
      '선물은 마음',
    ],
  },
  {
    category: '반려/동물',
    items: [
      '강아지',
      '고양이',
      '반려동물 있음',
      '반려동물 좋아함',
      '알레르기X',
      '강아지상',
      '고양이상',
      '여우상',
      '곰상',
      '토끼상',
      '사슴상',
    ],
  },
  {
    category: '가치관/관심사',
    items: [
      '자기계발',
      '커리어',
      '재테크',
      '취미부자',
      '환경/제로웨이스트',
      '건강관리',
      '마음챙김',
      '인간관계중시',
      '가족중시',
    ],
  },
] as const;

export type InterestCategory = (typeof INTEREST_CATEGORIES)[number];
export type InterestCategoryName = InterestCategory['category'];
export type InterestItem = InterestCategory['items'][number];
