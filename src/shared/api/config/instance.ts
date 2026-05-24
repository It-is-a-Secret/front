import ky from 'ky';

export const api = ky.create({
  prefix: import.meta.env.VITE_BASE_URL,
  retry: 0,
});
