import {INTEREST_STEPS} from '@/pages/onboarding/constants/constants';
import type {
  DepartmentName,
  InterestItem,
  InterestStep,
} from '@/pages/onboarding/constants/constants';
import type {
  CompleteOnboardingRequest,
  GetKeywordCatalogResponse,
} from '@/pages/onboarding/api/type';
import type {OnboardingDraft} from '@/pages/onboarding/model/onboarding-draft';

type DepartmentCode = CompleteOnboardingRequest['department'];

const DEPARTMENT_CODES: Record<DepartmentName, DepartmentCode> = {
  국어국문학과: 'KOREAN_LANGUAGE',
  영어언어문화학과: 'ENGLISH',
  러시아문화학과: 'RUSSIAN',
  중국언어문화학과: 'CHINESE',
  유아교육과: 'EARLY_CHILDHOOD_EDUCATION',
  신학과: 'THEOLOGY',
  기독교교육과: 'CHRISTIAN_EDUCATION',
  공연예술학과: 'PERFORMING_ARTS',
  음악학과: 'MUSIC',
  디지털미디어디자인학과: 'DIGITAL_MEDIA_DESIGN',
  화장품발명디자인학과: 'COSMETIC_INVENTION_DESIGN',
  뷰티메디컬디자인학과: 'BEAUTY_MEDICAL_DESIGN',
  글로벌경영학과: 'GLOBAL_BUSINESS',
  행정학과: 'PUBLIC_ADMINISTRATION',
  관광경영학과: 'TOURISM_MANAGEMENT',
  식품영양학과: 'FOOD_NUTRITION',
  컴퓨터공학과: 'COMPUTER_ENGINEERING',
  정보전기전자공학과: 'INFORMATION_ELECTRICAL_ELECTRONIC',
  통계데이터사이언스학과: 'STATISTICS_DATA_SCIENCE',
  소프트웨어학과: 'SOFTWARE',
  도시정보공학과: 'URBAN_INFORMATION_ENGINEERING',
  환경에너지공학과: 'ENVIRONMENTAL_ENERGY_ENGINEERING',
  AI융합학과: 'AI_CONVERGENCE',
};

const CATEGORY_CODES: Record<InterestStep, string> = {
  hobby: 'HOBBY',
  foodStyle: 'FOOD',
  lifeStyle: 'LIFESTYLE',
  personalityConversation: 'PERSONALITY',
  dateStyle: 'DATE',
  contactRelationship: 'CONTACT',
  pet: 'PET',
  valueInterest: 'VALUES',
};

const TAG_NAME_ALIASES: Partial<Record<InterestItem, string>> = {
  가벼운음주: '가벼운 음주',
  즉흥: '즉흥형',
};

export const buildCompleteOnboardingRequest = (
  draft: OnboardingDraft,
  catalog: GetKeywordCatalogResponse
): CompleteOnboardingRequest => {
  const nickName = draft.nickname.trim();
  const department = DEPARTMENT_CODES[draft.department as DepartmentName];

  if (!nickName || !draft.selectedGender || !department) {
    throw new Error('기본 정보를 다시 확인해 주세요.');
  }

  const categories = catalog.data;
  if (!categories) {
    throw new Error('관심사 정보를 불러오지 못했어요. 다시 시도해 주세요.');
  }

  const keywordTagIds = INTEREST_STEPS.flatMap((step) => {
    const selectedItems = draft.selectedInterests[step] ?? [];
    const category = categories.find(
      (item) => item.code === CATEGORY_CODES[step]
    );

    return selectedItems.map((item) => {
      const tagName = TAG_NAME_ALIASES[item] ?? item;
      const ids = [
        ...new Set(
          (category?.tags ?? []).flatMap((tag) =>
            tag.name === tagName && typeof tag.id === 'number' ? [tag.id] : []
          )
        ),
      ];

      if (ids.length !== 1) {
        throw new Error('관심사 정보를 확인하지 못했어요. 다시 시도해 주세요.');
      }

      return ids[0];
    });
  });

  return {
    nickName,
    birthYear: draft.birthYear,
    department,
    ...(draft.selectedMbti ? {mbti: draft.selectedMbti} : {}),
    gender: draft.selectedGender === 'male' ? 'MALE' : 'FEMALE',
    keywordTagIds: [...new Set(keywordTagIds)],
  };
};
