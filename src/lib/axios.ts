import axios, { type AxiosError } from 'axios';
import i18n from '@/i18n/index';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise error shape: extract server message when available,
// otherwise fall back to an i18n string keyed on the HTTP status code.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;

      // 1. Server returned a structured error body → use its message directly
      const serverMessage = axiosError.response?.data?.message;
      if (typeof serverMessage === 'string' && serverMessage.trim()) {
        return Promise.reject(new Error(serverMessage));
      }

      // 2. No network response (CORS, timeout, offline)
      if (!axiosError.response) {
        return Promise.reject(new Error(i18n.t('errors.network')));
      }

      // 3. Map well-known HTTP status codes to localised messages
      const statusMap: Record<number, string> = {
        400: i18n.t('errors.badRequest'),
        401: i18n.t('errors.unauthorized'),
        403: i18n.t('errors.forbidden'),
        404: i18n.t('errors.notFound'),
        409: i18n.t('errors.conflict'),
        422: i18n.t('errors.validation'),
        500: i18n.t('errors.serverError'),
        502: i18n.t('errors.serverError'),
        503: i18n.t('errors.serverError'),
      };

      const message =
        statusMap[axiosError.response.status] ?? i18n.t('errors.generic');

      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);
