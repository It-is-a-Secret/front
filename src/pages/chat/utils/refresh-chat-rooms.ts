import type {QueryClient} from '@tanstack/react-query';
import {QUERY_KEYS} from '@/shared/api/config/query-key';

export const refreshChatRooms = async (queryClient: QueryClient) => {
  const filters = {queryKey: QUERY_KEYS.chat.rooms()};
  // 이벤트 이전에 시작된 조회 결과로 최신 안 읽은 수가 덮이지 않도록 합니다.
  await queryClient.cancelQueries(filters);
  await queryClient.invalidateQueries(filters);
};
