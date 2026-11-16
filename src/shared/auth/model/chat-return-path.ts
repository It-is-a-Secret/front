export const KAKAO_CHAT_RETURN_PATH_KEY = 'kakaoChatReturnPath';

export const getChatReturnPath = (pathname: string | null) => {
  const match = pathname?.match(/^\/chat\/([1-9]\d*)$/);
  if (!match || !Number.isSafeInteger(Number(match[1]))) return null;

  return `/chat/${match[1]}`;
};

export const getChatLoginPath = (pathname: string | null) => {
  const returnPath = getChatReturnPath(pathname);
  return returnPath
    ? `/auth?returnTo=${encodeURIComponent(returnPath)}`
    : '/auth';
};
