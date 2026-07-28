const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export const formatChatRelativeTime = (dateTime: string) => {
  const targetTime = new Date(dateTime).getTime();

  if (Number.isNaN(targetTime)) {
    return '';
  }

  const diff = Date.now() - targetTime;

  if (diff < MINUTE_IN_MS) {
    return '방금 전';
  }

  if (diff < HOUR_IN_MS) {
    return `${Math.floor(diff / MINUTE_IN_MS)}분`;
  }

  if (diff < DAY_IN_MS) {
    return `${Math.floor(diff / HOUR_IN_MS)}시간`;
  }

  const diffDays = Math.floor(diff / DAY_IN_MS);

  if (diffDays < 7) {
    return `${diffDays}일`;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(dateTime));
};
