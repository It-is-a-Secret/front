export const isValidNickname = (nickname: string) =>
  /^[가-힣a-zA-Z0-9]{2,12}$/.test(nickname);
