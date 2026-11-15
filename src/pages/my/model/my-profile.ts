import type {MemberProfile} from '@/pages/my/api/type';

const DEPARTMENT_LABELS = {
  THEOLOGY: '신학과',
  CHRISTIAN_EDUCATION: '기독교교육과',
  KOREAN_LANGUAGE: '국어국문학과',
  ENGLISH: '영어언어문화학과',
  RUSSIAN: '러시아문화학과',
  CHINESE: '중국언어문화학과',
  EARLY_CHILDHOOD_EDUCATION: '유아교육과',
  PERFORMING_ARTS: '공연예술학과',
  MUSIC: '음악학과',
  DIGITAL_MEDIA_DESIGN: '디지털미디어디자인학과',
  COSMETIC_INVENTION_DESIGN: '화장품발명디자인학과',
  BEAUTY_MEDICAL_DESIGN: '뷰티메디컬디자인학과',
  GAME_CONTENT: '게임콘텐츠학과',
  PRACTICAL_MUSIC: '실용음악과',
  SPORTS_SCIENCE: '스포츠과학과',
  SPORTS_APPLIED_INDUSTRY: '스포츠응용산업학과',
  GLOBAL_BUSINESS: '글로벌경영학과',
  PUBLIC_ADMINISTRATION: '행정학과',
  TOURISM_MANAGEMENT: '관광경영학과',
  PUBLIC_GOVERNANCE: '공공행정학과',
  TOURISM: '관광학과',
  FOOD_NUTRITION: '식품영양학과',
  COMPUTER_ENGINEERING: '컴퓨터공학과',
  INFORMATION_ELECTRICAL_ELECTRONIC: '정보전기전자공학과',
  STATISTICS_DATA_SCIENCE: '통계데이터사이언스학과',
  SOFTWARE: '소프트웨어학과',
  URBAN_INFORMATION_ENGINEERING: '도시정보공학과',
  ENVIRONMENTAL_ENERGY_ENGINEERING: '환경에너지공학과',
  AI_CONVERGENCE: 'AI융합학과',
  SMART_CITY_ENGINEERING: '스마트시티공학과',
  MARINE_BIO_ENGINEERING: '해양바이오공학과',
  CONVERGENCE_SOFTWARE: '융합소프트웨어학과',
} satisfies Record<NonNullable<MemberProfile['department']>, string>;

export const getMyProfileDescription = (profile: MemberProfile): string => {
  const birthYear =
    profile.birthYear != null
      ? `${String(profile.birthYear).slice(-2)}년생`
      : undefined;
  const gender =
    profile.gender === 'MALE'
      ? '남'
      : profile.gender === 'FEMALE'
        ? '여'
        : undefined;
  const personal = birthYear
    ? `${birthYear}${gender ? `(${gender})` : ''}`
    : gender;
  const department =
    profile.department != null
      ? DEPARTMENT_LABELS[profile.department]
      : undefined;

  return [personal, department].filter(Boolean).join('·');
};
