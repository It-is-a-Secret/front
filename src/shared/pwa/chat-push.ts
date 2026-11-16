import {useEffect} from 'react';
import {queryOptions, useQuery, useQueryClient} from '@tanstack/react-query';

import {api, API_ENDPOINT, publicApi} from '@/shared/api';
import type {components} from '@/shared/types/schema';

import {
  canRegisterAppServiceWorker,
  registerAppServiceWorker,
} from './service-worker';

const CHAT_PUSH_DISABLED_KEY = 'blursome:chat-push-disabled';
let pendingOperation: Promise<unknown> = Promise.resolve();
let chatPushDisableMarker: string | null = null;

export const runChatPushOperation = <T>(operation: () => Promise<T>) => {
  if (navigator.locks) {
    return navigator.locks.request(CHAT_PUSH_DISABLED_KEY, operation);
  }
  const result = pendingOperation.then(operation);
  pendingOperation = result.catch(() => undefined);
  return result;
};

export const getChatPushDisableMarker = () => {
  try {
    return localStorage.getItem(CHAT_PUSH_DISABLED_KEY);
  } catch {
    return chatPushDisableMarker;
  }
};

export const setChatPushDisabledOnDevice = (disabled: boolean) => {
  chatPushDisableMarker = disabled
    ? (crypto.randomUUID?.() ?? String(Date.now()))
    : null;
  try {
    if (chatPushDisableMarker) {
      localStorage.setItem(CHAT_PUSH_DISABLED_KEY, chatPushDisableMarker);
    } else localStorage.removeItem(CHAT_PUSH_DISABLED_KEY);
  } catch {
    // 저장소를 사용할 수 없는 탭에서는 메모리 상태를 사용합니다.
  }
};

export const supportsChatPush = () =>
  canRegisterAppServiceWorker() &&
  'Notification' in window &&
  'PushManager' in window;

export const getCurrentChatPushSubscription = async () => {
  if (!supportsChatPush()) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  return (await registration?.pushManager.getSubscription()) ?? null;
};

export const saveChatPushSubscription = async (
  subscription: PushSubscription,
  signal?: AbortSignal
) => {
  const json = subscription.toJSON();
  const {endpoint, keys} = json;
  if (!endpoint || !keys?.p256dh || !keys.auth) {
    throw new Error('브라우저 알림 구독 정보가 올바르지 않아요.');
  }
  await api.put(API_ENDPOINT.push.subscriptions, {
    json,
    signal,
    context: {skipAuthRedirect: true},
  });
};

export const deleteChatPushSubscription = (endpoint: string) =>
  api.delete(API_ENDPOINT.push.subscriptions, {
    json: {endpoint},
    context: {skipAuthRedirect: true},
  });

export const chatPushSubscriptionOptions = (memberId: number | null) =>
  queryOptions({
    queryKey: ['push', 'subscription', memberId] as const,
    queryFn: async ({signal}) => {
      if (
        !supportsChatPush() ||
        Notification.permission !== 'granted' ||
        getChatPushDisableMarker() !== null
      ) {
        return null;
      }
      const registration = await registerAppServiceWorker();
      return runChatPushOperation(async () => {
        signal.throwIfAborted();
        if (getChatPushDisableMarker() !== null) {
          return null;
        }
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          signal.throwIfAborted();
          await saveChatPushSubscription(subscription, signal);
        }
        return subscription;
      });
    },
    enabled: memberId !== null,
    staleTime: Infinity,
    retry: false,
    retryOnMount: false,
  });

export const chatPushSetupOptions = () =>
  queryOptions({
    queryKey: ['push', 'setup'] as const,
    queryFn: async () => {
      const [registration, {data}] = await Promise.all([
        registerAppServiceWorker(),
        publicApi
          .get(API_ENDPOINT.push.publicKey)
          .json<components['schemas']['DataResponsePushPublicKeyResponse']>(),
      ]);
      if (!data?.publicKey) throw new Error('알림 공개 키를 받지 못했어요.');
      const base64 = data.publicKey.replace(/-/g, '+').replace(/_/g, '/');
      const applicationServerKey = Uint8Array.from(
        atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')),
        (character) => character.charCodeAt(0)
      );
      return {registration, applicationServerKey};
    },
    enabled: supportsChatPush(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

export const useSyncChatPush = (memberId: number | null) => {
  const queryClient = useQueryClient();
  useQuery(chatPushSubscriptionOptions(memberId));

  useEffect(() => {
    if (memberId === null || !supportsChatPush()) return;

    const sync = () => {
      void queryClient.invalidateQueries({
        queryKey: chatPushSubscriptionOptions(memberId).queryKey,
        exact: true,
      });
    };
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CHAT_PUSH_SUBSCRIPTION_CHANGED') sync();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CHAT_PUSH_DISABLED_KEY) sync();
    };
    navigator.serviceWorker.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [memberId, queryClient]);
};
