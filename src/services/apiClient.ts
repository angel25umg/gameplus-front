import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s timeout
});

// Simple retry interceptor: retry on network errors, timeouts or 5xx (up to maxRetries)
const maxRetries = 1;

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { __retryCount?: number };
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;

    const shouldRetry =
      (!error.response || (error.response && error.response.status >= 500)) ||
      error.code === 'ECONNABORTED';

    if (shouldRetry && config.__retryCount < maxRetries) {
      config.__retryCount += 1;
      const delay = 500 * config.__retryCount; // small backoff
      await new Promise((r) => setTimeout(r, delay));
      return instance(config);
    }

    return Promise.reject(error);
  }
);

export default instance;
