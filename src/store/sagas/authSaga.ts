import { call, put, takeLatest } from 'redux-saga/effects';
import { AnyAction } from '@reduxjs/toolkit';
import { Api, LoginRequest, LoginResponse, normalizeAxiosError } from '../../api/api';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setTokens,
} from '../slices/authSlice';
import { setAuthHeader } from '../../api/client';

interface LoginRequestAction extends AnyAction {
  payload: LoginRequest;
}

function* loginSaga(action: LoginRequestAction) {
  try {
    const data: LoginRequest = action.payload;
    const response: LoginResponse = yield call(Api.login, data);
    
    if (!response.success || !response.data) {
      yield put(loginFailure(response.message || 'Login failed'));
      return;
    }
    
    const accessToken = response.data.token;
    const user = response.data.user;
    
    setAuthHeader(accessToken);
    yield put(loginSuccess({ accessToken, user }));
  } catch (error) {
    const normalizedError = normalizeAxiosError(error);
    yield put(loginFailure(normalizedError.message));
  }
}

function* logoutSaga() {
  try {
    yield call(Api.logout);
  } catch {
    // Ignore logout simulation errors
  } finally {
    setAuthHeader(null);
    yield put(logout());
  }
}

function* setTokensSaga(action: ReturnType<typeof setTokens>) {
  const { accessToken } = action.payload;
  setAuthHeader(accessToken);
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logout.type, logoutSaga);
  yield takeLatest(setTokens.type, setTokensSaga);
}