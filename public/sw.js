// 활성화 후 현재 페이지를 제어하며, 별도 캐싱은 적용하지 않습니다.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const getChatPath = (value, roomId) => {
  if (typeof value !== 'string') return '/';

  try {
    const url = new URL(value, self.location.origin);
    const match = /^\/chat\/([1-9]\d*)$/.exec(url.pathname);
    if (
      url.origin !== self.location.origin ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !match
    ) {
      return '/';
    }

    const targetRoomId = Number(match[1]);
    if (
      !Number.isSafeInteger(targetRoomId) ||
      (roomId !== undefined && roomId !== targetRoomId)
    ) {
      return '/';
    }

    return url.pathname;
  } catch {
    return '/';
  }
};

const getNotificationText = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value : fallback;

self.addEventListener('push', (event) => {
  let payload;
  try {
    payload = event.data?.json();
  } catch {
    // 푸시 본문을 읽을 수 없어도 기본 알림은 표시합니다.
  }

  event.waitUntil(
    self.registration.showNotification(
      getNotificationText(payload?.title, 'BlurSome'),
      {
        body: getNotificationText(payload?.body, '새 메시지가 도착했어요'),
        icon: '/icon-192.png',
        data: {
          url: getChatPath(payload?.url, payload?.roomId),
          roomId: payload?.roomId,
        },
      }
    )
  );
});

const openNotificationTarget = async (data) => {
  const path = getChatPath(data?.url, data?.roomId);
  const url = new URL(path, self.location.origin);
  const windows = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  const existing = windows.find((client) => client.url === url.href);
  const available = windows.find((client) => {
    const currentUrl = new URL(client.url);
    return (
      client !== existing &&
      currentUrl.origin === url.origin &&
      currentUrl.pathname !== '/auth/callback'
    );
  });

  try {
    if (existing) {
      await existing.focus();
      return;
    }

    const navigated = await available?.navigate(url.href);
    if (navigated) {
      await navigated.focus();
      return;
    }
  } catch {
    // 기존 창이 닫혔거나 이동할 수 없으면 새 창을 엽니다.
  }

  await self.clients.openWindow(url.href);
};

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(openNotificationTarget(event.notification.data));
});

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.clients.matchAll({type: 'window'}).then((windows) => {
      for (const client of windows) {
        client.postMessage({type: 'CHAT_PUSH_SUBSCRIPTION_CHANGED'});
      }
    })
  );
});
