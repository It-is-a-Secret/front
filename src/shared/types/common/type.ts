import type {paths} from '@/shared/types/schema';

export type PingResponse =
  paths['/api/ping']['get']['responses'][200]['content']['*/*'];
