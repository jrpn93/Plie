import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../api/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
      state.isLoading = false;
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setTokens,
  updateProfile,
  clearError,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;