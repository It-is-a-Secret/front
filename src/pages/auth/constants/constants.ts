export const AUTH_TEXTAREA_CONTENT = {
  email: {
    title: `학교 이메일을\n입력해 주세요`,
    descriptionPrefix: '안양대 재학생 인증을 위해',
    domain: '@gs.anyang.ac.kr',
    descriptionSuffix: ' 도메인만 가능합니다',
  },
  code: {
    title: `인증 코드를\n입력해 주세요`,
    descriptionSuffix: `로 6자리 코드를 보냈습니다`,
  },
} as const;
