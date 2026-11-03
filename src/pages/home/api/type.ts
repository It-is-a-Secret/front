import type {components, operations} from '@/shared/types/schema';

export type GetDiscoveryParams =
  operations['getDiscovery']['parameters']['query'];
export type GetDiscoveryResponse =
  components['schemas']['DataResponseListDiscoveryCardResponse'];

// 서버는 생성 스키마의 optional 표시와 달리 빈 메시지를 허용하지 않습니다.
export type StartChatRequest = components['schemas']['ChatStartRequest'] & {
  message: string;
};
export type StartChatResponse =
  components['schemas']['DataResponseChatStartResponse'];
