import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import App from '@/app/App';
import {
  canRegisterAppServiceWorker,
  registerAppServiceWorker,
} from '@/shared/pwa/service-worker';
import '@/shared/styles/global.css';

if (canRegisterAppServiceWorker()) {
  registerAppServiceWorker().catch((error: unknown) => {
    console.warn('서비스 워커를 등록하지 못했습니다.', error);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
