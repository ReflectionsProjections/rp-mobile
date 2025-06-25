import { API_CONFIG } from '@/app/lib/config';
import createApi from './axios';

export const api = createApi(API_CONFIG.BASE_URL, () => {
  /* unauthorized callback */
});
