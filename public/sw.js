// 활성화 후 현재 페이지를 제어하며, 별도 캐싱은 적용하지 않습니다.
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
