import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {isHTTPError} from 'ky';

import {detectPwaPlatform} from '@/pages/home/model/pwa-install-prompt';
import {authSessionQueryOptions} from '@/shared/auth/session-query';
import {useAuthSession} from '@/shared/auth/useAuthSession';
import {
  chatPushSetupOptions,
  chatPushSubscriptionOptions,
  deleteChatPushSubscription,
  getChatPushDisableMarker,
  getCurrentChatPushSubscription,
  runChatPushOperation,
  saveChatPushSubscription,
  setChatPushDisabledOnDevice,
  supportsChatPush,
} from '@/shared/pwa/chat-push';

interface EnableChatPush {
  subscription: Promise<PushSubscription>;
  memberId: number;
  disableMarker: string | null;
}

export const useChatPushSettings = () => {
  const queryClient = useQueryClient();
  const {memberId} = useAuthSession();
  const subscriptionOptions = chatPushSubscriptionOptions(memberId);
  const subscription = useQuery(subscriptionOptions);
  const setup = useQuery(chatPushSetupOptions());
  const supported = supportsChatPush();
  const permissionBlocked = supported && Notification.permission === 'denied';
  const notConfigured =
    isHTTPError(setup.error) && setup.error.response.status === 503;

  const mutation = useMutation({
    mutationFn: async (enable: EnableChatPush | null) => {
      const activeSubscription = await enable?.subscription;
      return runChatPushOperation(async () => {
        if (enable && activeSubscription) {
          const session = queryClient.getQueryData(
            authSessionQueryOptions().queryKey
          );
          if (
            session?.memberId !== enable.memberId ||
            getChatPushDisableMarker() !== enable.disableMarker
          ) {
            throw new Error('로그인 또는 알림 설정이 바뀌었어요.');
          }
          await saveChatPushSubscription(activeSubscription);
          setChatPushDisabledOnDevice(false);
          return activeSubscription;
        }

        const current = await getCurrentChatPushSubscription();
        const endpoint = current?.endpoint ?? subscription.data?.endpoint;
        if (endpoint) await deleteChatPushSubscription(endpoint);
        setChatPushDisabledOnDevice(true);
        await current?.unsubscribe().catch(() => undefined);
        return null;
      });
    },
    onSuccess: (nextSubscription) => {
      queryClient.setQueryData(subscriptionOptions.queryKey, nextSubscription);
    },
  });

  const checked = Boolean(subscription.data) && !permissionBlocked;
  const pending =
    memberId === null ||
    subscription.isPending ||
    mutation.isPending ||
    (!checked && setup.isLoading);
  const disabled =
    pending ||
    !supported ||
    (!checked && (!setup.data || permissionBlocked || notConfigured));

  const setEnabled = (enabled: boolean) => {
    if (disabled) return;
    if (!enabled) {
      mutation.mutate(null);
      return;
    }
    if (!setup.data || memberId === null) return;

    // 브라우저의 권한 요청은 토글을 누른 이벤트에서 바로 시작합니다.
    const {registration, applicationServerKey} = setup.data;
    const disableMarker = getChatPushDisableMarker();
    const nextSubscription = registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    void nextSubscription.catch(() => undefined);
    mutation.mutate({subscription: nextSubscription, memberId, disableMarker});
  };

  const unsupportedMessage =
    detectPwaPlatform(navigator.userAgent, navigator.maxTouchPoints) === 'ios'
      ? 'iPhone·iPad에서는 홈 화면에 추가한 앱에서 알림을 켤 수 있어요.'
      : '현재 환경에서는 채팅 알림을 켤 수 없어요.';
  const availabilityMessage = !supported
    ? unsupportedMessage
    : permissionBlocked
      ? '기기나 브라우저 설정에서 알림을 허용해 주세요.'
      : notConfigured
        ? '현재 서버에서 알림을 사용할 수 없어요.'
        : null;
  const errorMessage =
    !availabilityMessage && (mutation.isError || subscription.isError)
      ? '알림 설정을 저장하지 못했어요. 다시 시도해 주세요.'
      : !availabilityMessage && setup.isError
        ? '알림 설정을 불러오지 못했어요.'
        : null;

  const retrySetup =
    supported && !permissionBlocked && setup.isError && !notConfigured
      ? () => void setup.refetch()
      : null;

  return {
    checked,
    disabled,
    setEnabled,
    availabilityMessage,
    errorMessage,
    retrySetup,
  };
};
