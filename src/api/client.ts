import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
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

const getAuthToken = () => {
  try {
    const state = store.getState();
    return state.auth.token;
  } catch {
    return null;
  }
};

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

[client, authClient].forEach((instance) => {
  instance.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
});

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