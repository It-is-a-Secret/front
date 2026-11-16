let registrationPromise: Promise<ServiceWorkerRegistration> | undefined;

export const canRegisterAppServiceWorker = () =>
  import.meta.env.PROD && window.isSecureContext && 'serviceWorker' in navigator;

export const registerAppServiceWorker = () => {
  registrationPromise ??= navigator.serviceWorker
    .register('/sw.js')
    .then(() => navigator.serviceWorker.ready)
    .catch((error: unknown) => {
      registrationPromise = undefined;
      throw error;
    });
  return registrationPromise;
};
