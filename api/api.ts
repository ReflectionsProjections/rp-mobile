import { API_CONFIG } from '@/lib/config';
import createApi from './axios';

export const api = createApi(API_CONFIG.BASE_URL, () => {
  /* unauthorized callback */
});
