import type {components, operations} from '@/shared/types/schema';

export type GetDiscoveryParams =
  operations['getDiscovery']['parameters']['query'];
export type GetDiscoveryResponse =
  components['schemas']['DataResponseListDiscoveryCardResponse'];

export type StartChatRequest = components['schemas']['ChatStartRequest'];
export type StartChatResponse =
  components['schemas']['DataResponseChatStartResponse'];
