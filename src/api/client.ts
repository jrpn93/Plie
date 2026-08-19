import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { CONST } from '../constants/constants';
import { store } from '../store';

export const client: AxiosInstance = axios.create({
  baseURL: CONST.API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authClient: AxiosInstance = axios.create({
  baseURL: CONST.API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

const getAuthToken = () => {
  try {
    const state = store.getState();
    return state.auth.token;
  } catch {
    return null;
  }
};

const getRefreshToken = () => {
  try {
    const state = store.getState();
    return state.auth.refreshToken;
  } catch {
    return null;
  }
};

const setAuthTokens = (accessToken: string, refreshToken?: string) => {
  store.dispatch({ type: 'auth/setTokens', payload: { accessToken, refreshToken } });
};

const clearAuthTokens = () => {
  store.dispatch({ type: 'auth/logout' });
};

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const responseInterceptor = async (response: AxiosResponse) => {
  return response;
};

const errorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthTokens();
      return Promise.reject(error);
    }

    try {
      const response = await authClient.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      setAuthTokens(accessToken, newRefreshToken);
      processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return axios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      clearAuthTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

[client, authClient].forEach((instance) => {
  instance.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
  instance.interceptors.response.use(responseInterceptor, errorInterceptor);
});

export const apiClients = {
  client,
  authClient,
};

export const setAuthHeader = (token: string | null) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
    authClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
    delete authClient.defaults.headers.common.Authorization;
  }
};

export default client;