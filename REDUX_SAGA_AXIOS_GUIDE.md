# Redux Toolkit + Redux Saga + Axios Implementation Guide

This guide documents the patterns used in the RizeEx codebase for implementing Redux state management with Redux Saga for async operations and Axios for API calls. Use this as a reference when implementing similar architecture in other React Native CLI projects.

---

## 1. Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instances + interceptors
│   └── api.ts             # API method definitions
├── store/
│   ├── index.ts           # Store configuration + persist
│   ├── slices/            # Redux Toolkit slices (one per feature)
│   ├── reducers/          # Pure reducer functions (separated from slices)
│   ├── sagas/             # Saga files (one per feature)
│   └── channels/          # WebSocket event channels + flush scheduler
├── constants/
│   └── Constants.ts       # API URLs, WebSocket URLs, config
├── utils/
│   └── normalizeAxiosError.ts  # Error normalization utility
└── hooks/
    └── useToast.ts        # Toast notifications
```

---

## 2. Axios Client Setup (`src/api/client.ts`)

### Dual Client Pattern
Create separate Axios instances for different API hosts:

```typescript
// Main API client
export const client = axios.create({
  baseURL: CONST.API_BASE_URL,
  timeout: 60_000,
  timeoutErrorMessage: "Request timed out",
});

// Separate client for different domain (e.g., RZ5/SIP)
export const sipClient = axios.create({
  baseURL: CONST.RZ5_SAVE_API_BASE_URL,
  timeout: 60_000,
});
```

### Token Management
```typescript
export const setAuthenticatedClientTokens = (token: string | null) => {
  if (token) {
    const authorization = `Bearer ${token}`;
    client.defaults.headers.Authorization = authorization;
    sipClient.defaults.headers.Authorization = authorization;
    return;
  }
  delete client.defaults.headers.Authorization;
  delete sipClient.defaults.headers.Authorization;
};
```

### Request Interceptor (with environment switching)
```typescript
const requestInterceptor =
  (useEnvironmentBaseUrl = false, axiosInstance?: any) =>
  async (config: any) => {
    const token = store.getState().auth.token;
    
    // Track which instance made the request for retry routing
    config._client = axiosInstance;

    const isApiWithoutToken = APIS_WITHOUT_TOKEN?.[config.url || ""] === true;

    if (useEnvironmentBaseUrl) {
      config.baseURL = getApiBaseUrl(); // Reads from Redux state
    }

    if (token && !isApiWithoutToken) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers.Authorization = undefined;
    }

    // Add location params for specific APIs
    if (APIS_WITH_LOCATION.has(config.url || "")) {
      const location = store.getState().auth.location;
      config.params = { ...config.params, lat: location?.latitude, long: location?.longitude };
    }

    return config;
  };

// Apply to each client with correct instance reference
client.interceptors.request.use(requestInterceptor(true, client), ...);
sipClient.interceptors.request.use(requestInterceptor(false, sipClient), ...);
```

### Response Interceptor with Token Refresh Queue
```typescript
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => error ? prom.reject(error) : prom.resolve(token));
  failedQueue = [];
};

const responseInterceptor = async (error: any) => {
  const originalRequest = error.config;
  const retryClient = originalRequest?._client || client; // Use SAME instance

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return retryClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = store.getState().auth.refreshToken;
      const deviceId = store.getState().auth.deviceId;
      const newToken = await refreshAuthToken(refreshToken, deviceId);
      
      if (newToken) {
        store.dispatch(updateAuthToken(newToken));
        setAuthenticatedClientTokens(newToken);
        processQueue(null, newToken);
        return retryClient(originalRequest);
      } else {
        processQueue(error, null);
        if (store.getState().auth.isAuthenticated) {
          errorToast({ message: "Session expired. Please login again." });
          store.dispatch(logoutRequest({}));
        }
      }
    } catch (err) {
      processQueue(err, null);
      if (store.getState().auth.isAuthenticated) {
        errorToast({ message: "Session expired. Please login again." });
        store.dispatch(logoutRequest({}));
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
};

client.interceptors.response.use((r) => r, responseInterceptor);
sipClient.interceptors.response.use((r) => r, responseInterceptor);
```

---

## 3. API Layer (`src/api/api.ts`)

### Pattern: Wrapper Methods with Status Checking
```typescript
export const Api = {
  login: async (payload: LoginTypes): Promise<LoginResponse> => {
    return client
      .post("authentication/log-in", payload)
      .then((res) => {
        if (res.status === GET_SUCCESS_STATUS) return res.data;
        throw new Error("Unexpected API Status or response");
      })
      .catch((e) => normalizeError(e)); // Normalizes and re-throws
  },

  // GET example
  getUserProfile: async (token?: string) => {
    return client
      .get(`user/profile`, token ? { headers: { Authorization: `Bearer ${token}` } } : {})
      .then((res) => {
        if (res.status === GET_SUCCESS_STATUS) return res.data;
        throw new Error("Unexpected API Status or response");
      })
      .catch((e) => normalizeError(e));
  },

  // POST with different client
  startSIP: async (data: any) => {
    return sipClient
      .post(`sip/start-sip`, data)
      .then((res) => {
        if (res.status === POST_SUCCESS_STATUS) return res.data;
        throw new Error("Unexpected API Status or response");
      })
      .catch((e) => normalizeError(e));
  },
};
```

### Constants for Status Codes
```typescript
export const GET_SUCCESS_STATUS = 200;
export const POST_SUCCESS_STATUS = 201;
export const PUT_SUCCESS_STATUS = 200;
export const UNAUTHORIZED_STATUS = 401;
```

---

## 4. Error Normalization (`src/utils/normalizeAxiosError.ts`)

```typescript
import { isAxiosError } from "axios";

const normalizeError = (error: any) => {
  console.error("API error", error);
  if (isAxiosError(error)) {
    throw {
      isAxiosError: true,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    };
  } else {
    throw {
      isAxiosError: false,
      message: error.message || "Unknown error",
    };
  }
};

export default normalizeError;
```

---

## 5. Redux Store Configuration (`src/store/index.ts`)

### Key Configuration Points
- **Thunk disabled** — all async via Saga
- **Serializable check** ignores redux-persist actions
- **Persist only `auth` and `tabs` slices** via MMKV
- **Transform** to strip transient state (`mPin`, `isSwitchingEnvironment`, etc.)
- **Root reducer** resets entire store on `logoutSuccess`

```typescript
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { createTransform } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

// Transform to remove transient fields before persist
const resetAuthTransientState = (state: any) => state ? {
  ...state,
  mPin: null,
  isSwitchingEnvironment: false,
  switchingEnvironmentTarget: null,
  switchEnvironmentError: null,
} : state;

const authPersistTransform = createTransform(
  (inboundState) => resetAuthTransientState(inboundState),
  (outboundState) => resetAuthTransientState(outboundState),
  { whitelist: ["auth"] }
);

const PersistConfig = {
  key: "root",
  storage: reduxPersistStorage, // MMKV
  whitelist: ["auth", "tabs"],
  transforms: [authPersistTransform],
};

const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
  auth: authSlice,
  futures: futuresSlice,
  // ... other slices
});

const rootReducer = (state: any, action: any) => {
  if (action.type === logoutSuccess.type) {
    state = undefined; // Full reset
  }
  return appReducer(state, action);
};

const persistedRootReducer = persistReducer(PersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(sagaMiddleware),
});

export const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);
```

---

## 6. Slice Pattern (`src/store/slices/authSlice.ts`)

### Structure: Slice + Separate Reducers File
```typescript
// authSlice.ts — Types + Slice definition
import { createSlice } from "@reduxjs/toolkit";
import { authReducers } from "../reducers";

export interface AuthState {
  user: User | null;
  mainAccountUser: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  // ... other fields
}

const initialState: AuthState = {
  user: null,
  mainAccountUser: null,
  token: null,
  // ...
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: authReducers, // Imported from separate file
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFail,
  logoutRequest,
  logoutSuccess,
  // ...
} = authSlice.actions;

export default authSlice.reducer;
```

---

## 7. Reducers Pattern (`src/store/reducers/authReducer.ts`)

### Pure Reducer Functions (Mutating via Immer)
```typescript
import { PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../slices/authSlice";

export const authReducers = {
  loginRequest(state: AuthState, action: PayloadAction<any>) {
    state.isLoading = true;
    state.loginError = null;
  },
  
  loginSuccess(state: AuthState, action: PayloadAction<any>) {
    const user = action.payload.user;
    state.isLoading = false;
    state.user = user;
    state.mainAccountUser = user; // Snapshot for sub-account detection
    state.token = user.token;
    state.refreshToken = user.refreshToken;
    state.deviceId = user.deviceId;
    state.environment = user.environment ?? "LIVE";
    state.isAuthenticated = true;
    state.loginError = null;
  },
  
  loginFail(state: AuthState, action: PayloadAction<any>) {
    state.isLoading = false;
    state.loginError = action.payload;
  },

  updateAuthToken: (state: AuthState, action: PayloadAction<any>) => {
    state.token = action.payload;
  },

  // Async flow: Request -> Success/Fail
  getUserProfileRequest(state: AuthState) {
    state.isUserProfileLoading = true;
  },
  getUserProfileSuccess(state: AuthState, action: PayloadAction<any>) {
    state.isUserProfileLoading = false;
    state.userProfile = action.payload;
    state.isKYCVerified = computeKYC(action.payload);
  },
  getUserProfileFail(state: AuthState) {
    state.isUserProfileLoading = false;
  },
};
```

---

## 8. Saga Pattern (`src/store/sagas/authSaga.ts`)

### Generator Functions with `yield`
```typescript
import { call, put, takeLatest, takeLeading, race, take, cancelled } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

function* login(action: PayloadAction<LoginTypes>): Generator {
  const controller = new AbortController();
  try {
    // Side effects: location, notifications
    const location = yield call(getCurrentLocation);
    yield put(setLocation({ latitude: ..., longitude: ..., timestamp: ... }));
    
    const pushToken = yield call(registerForPushNotifications);
    
    // Race pattern for cancellation
    const { user, cancel } = yield race({
      user: call(Api.login, { ...action.payload, signal: controller.signal, deviceId: pushToken.token }),
      cancel: take(abortLoginRequest.type),
    });

    if (cancel) {
      controller.abort();
      return;
    }

    if (user?.requires2FA) {
      yield put(login2FARequired({}));
      yield put(setLoginRequires2FA({ twoFaToken: user.twoFaToken, rememberMe: action.payload.rememberMe }));
      yield router.replace({ pathname: "/TwoFAVerification", params: {...} });
      return;
    }

    if (user?.token) {
      yield put(loginSuccess({ user, rememberMe: action.payload.rememberMe }));
      yield put(setAppLocked(false));
      yield put(getUserProfileRequest(user.token));
    }
  } catch (e: any) {
    yield put(loginFail(e?.message));
  } finally {
    if (yield cancelled()) controller.abort();
  }
}

// Root saga: register watchers
export default function* authSaga(): Generator {
  yield takeLatest(loginRequest.type, login);
  yield takeLatest(googleSigninRequest.type, googleSignIn);
  yield takeLatest(logoutRequest.type, logout);
  yield takeLatest(placeTradeOrderRequest.type, placeTradeOrderSaga); // takeLeading for mutations
  yield takeLatest(switchEnvironmentRequest.type, switchEnvironmentSaga);
}
```

### Key Saga Patterns

| Pattern | Use Case |
|---------|----------|
| `takeLatest` | Queries, fetches — cancels previous if new action dispatched |
| `takeLeading` | Mutations (place order, transfer) — ignores subsequent while one in progress |
| `race` + `take` | Cancellation (abort login) |
| `call` | Invoke async functions (API, utilities) |
| `put` | Dispatch Redux actions |
| `select` | Read state |
| `fork` + `cancel` | Long-running tasks (WebSocket connections) |
| `yield cancelled()` | Cleanup in `finally` block |

---

## 9. WebSocket Integration with Saga

### Channel-Based Pattern (`src/store/channels/`)

```typescript
// flushScheduler.ts — Single interval + rAF for all channels
let flushTimer: ReturnType<typeof setInterval>;
let rafId: number;
const channelFlushFns: Array<() => void> = [];

export const scheduleFlush = (fn: () => void) => {
  channelFlushFns.push(fn);
  if (!flushTimer) {
    flushTimer = setInterval(() => {
      channelFlushFns.forEach((f) => f());
      channelFlushFns.length = 0;
    }, 250);
  }
};

// In channel file:
export const createFuturesChannel = (socket: WebSocket): EventChannel<any> => {
  return eventChannel((emit) => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Buffer messages, then flush via scheduler
      buffer.push(data);
      scheduleFlush(() => {
        const merged = mergeSnapshotsAndDeltas(buffer);
        buffer.length = 0;
        emit(updateFuturesStateUsingStream(merged));
      });
    };
    return () => socket.close();
  });
};
```

### Saga Consuming Channel
```typescript
function* handleWebSocket(action: any): SagaIterator {
  const environment = yield select((state) => state.auth.environment);
  const url = environment === "DEMO" ? CONST.DEMO_WS_BASE_URL : CONST.WS_BASE_URL;
  
  const socket = new WebSocket(url);
  const socketChannel: EventChannel<any> = yield call(createFuturesChannel, socket);

  try {
    while (true) {
      const action = yield take(socketChannel);
      yield put(action); // Dispatch to reducer
    }
  } finally {
    if (yield cancelled()) {
      socketChannel.close();
      socket.close();
    }
  }
}

// Watcher
yield takeLatest(connectFuturesSocket.type, function* (action) {
  futuresSocketTask = yield fork(handleWebSocket, action);
});
yield takeLatest(disconnectFuturesSocket.type, function* () {
  if (futuresSocketTask) yield cancel(futuresSocketTask);
});
```

---

## 10. Handling Business-Level Rejections

**Critical Pattern**: APIs may return HTTP 201/200 with `{ success: false }`. The Saga must throw to trigger `catch` and dispatch `Fail` action.

```typescript
// spotSaga.ts — placeSpotOrderSaga
function* placeSpotOrderSaga(action: PayloadAction<any>): Generator {
  try {
    const data = yield call(Api.placeSpotOrder, action.payload);
    
    if (data && data.success === true) {
      yield put(placeSpotOrderSuccess(data));
      yield put(getSpotAssetsRequest({ all: false }));
    } else {
      // Business rejection — MUST throw to hit catch block
      throw new Error(data?.message || data?.response?.message || "Failed to place spot order");
    }
  } catch (e: any) {
    yield put(placeSpotOrderFail({ message: e?.message }));
  } finally {
    yield tradeSpotBottomSheetRef.current?.close();
  }
}
```

**Reducer must always reset loading in both Success and Fail:**
```typescript
placeTradeOrderRequest(state) { state.isPlacingTradeOrder = true; },
placeTradeOrderSuccess(state) { state.isPlacingTradeOrder = false; },
placeTradeOrderFailure(state) { state.isPlacingTradeOrder = false; }, // Always!
```

---

## 11. Environment Switching (Demo ↔ Live)

### Flow
1. User toggles → `switchEnvironmentRequest`
2. Saga calls `Api.switchEnvironment` (hits **current** host)
3. Backend returns new tokens + user for target env
4. `switchEnvironmentSuccess` updates Redux + **refreshes `mainAccountUser`**
5. **Persist then reload**: `persistor.flush()` → `DevSettings.reload()`
6. App restarts fresh; `auth` slice rehydrated with new env

```typescript
// authSaga.ts
function* switchEnvironmentSaga(action: PayloadAction<{ environment: "DEMO" | "LIVE" }>) {
  try {
    const res = yield call(Api.switchEnvironment, { environment: action.payload.environment });
    if (res?.environment && (res?.accessToken || res?.token)) {
      yield put(switchEnvironmentSuccess(res));
      yield call(() => persistor.flush()); // Persist FIRST
      yield call(DevSettings.reload);      // Then restart
    }
  } catch (e) { yield put(switchEnvironmentFail(e?.message)); }
}

// authReducer.ts — switchEnvironmentSuccess
switchEnvironmentSuccess(state, action) {
  const data = action.payload;
  state.environment = data.environment;
  state.token = data.accessToken ?? data.token;
  state.refreshToken = data.refreshToken;
  // CRITICAL: Refresh mainAccountUser snapshot for sub-account detection
  if (data?.user) {
    state.mainAccountUser = { ...state.mainAccountUser, ...data.user };
  }
}
```

---

## 12. Sub-Account Detection Hook

```typescript
// src/hooks/useIsSubAccount.ts
import { useSelector } from "react-redux";

export const useIsSubAccount = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const mainAccountUser = useSelector((state: RootState) => state.auth.mainAccountUser);
  
  return Boolean(
    authUser?.isSubAccount ||
    authUser?.subAccountName ||
    (mainAccountUser?.id && authUser?.id && mainAccountUser.id !== authUser.id)
  );
};
```

---

## 13. Complete Feature Implementation Checklist

When adding a new feature (e.g., "Portfolio"):

### 1. Types & Constants
- [ ] Define API request/response interfaces in `src/types/apiTypes.ts`
- [ ] Add API endpoints to `CONST` in `Constants.ts`

### 2. API Method
- [ ] Add method to `src/api/api.ts` following wrapper pattern
- [ ] Use correct client (`client` vs `sipClient`)
- [ ] Handle status codes, call `normalizeError`

### 3. Slice (`src/store/slices/portfolio/portfolioSlice.ts`)
- [ ] Define `PortfolioState` interface
- [ ] Define `initialState`
- [ ] Import reducers from `../reducers/portfolio/portfolioReducer.ts`
- [ ] Export actions and reducer

### 4. Reducers (`src/store/reducers/portfolio/portfolioReducer.ts`)
- [ ] Export `portfolioReducers` object with typed reducers
- [ ] Handle Request/Success/Fail for each async action
- [ ] Handle WebSocket stream updates if applicable

### 5. Saga (`src/store/sagas/portfolio/portfolioSaga.ts`)
- [ ] Implement generator functions for each async flow
- [ ] Use `takeLatest` for queries, `takeLeading` for mutations
- [ ] Handle business-level rejections (throw on `success: false`)
- [ ] Dispatch success/fail actions, show toasts
- [ ] Export root `portfolioSaga` generator

### 6. Register
- [ ] Add slice reducer to `store/index.ts` `combineReducers`
- [ ] Add saga to `sagas/index.ts` `rootSaga`

### 7. WebSocket (if real-time)
- [ ] Add connection ID to `CONNECTION_IDS`
- [ ] Create channel in `src/store/channels/`
- [ ] Add connect/disconnect actions to slice
- [ ] Add WebSocket handler in saga

---

## 14. Common Pitfalls to Avoid

| Pitfall | Solution |
|---------|----------|
| Forgetting `takeLeading` on mutations | Use `takeLeading` for placeOrder, transfer, etc. |
| Not throwing on business rejection | Check `data.success === true`, else `throw` |
| Loading state stuck | Ensure `Fail` reducer resets loading flag |
| WebSocket not cleaning up | Use `fork` + `cancel` + `finally { if (yield cancelled()) close() }` |
| Stale token on retry | Read token from `store.getState()` in interceptor, not closure |
| Persist before reload missing | `persistor.flush()` **before** `DevSettings.reload()` |
| `mainAccountUser` not updated on env switch | Refresh in `switchEnvironmentSuccess` reducer |

---

## 15. Testing the Patterns

No automated tests exist in this codebase. Verify manually:
- [ ] Login → token stored → authenticated requests work
- [ ] 401 → token refresh → original request retries
- [ ] Logout → store reset → persisted data cleared
- [ ] Env switch → app reloads → new env active
- [ ] WebSocket connect/disconnect → no memory leaks
- [ ] Place order rejected (200 + success:false) → loading resets
- [ ] Sub-account detection works after env switch

---

## 16. Redux Persist with MMKV

### Storage Adapter (`src/utils/Storage.ts`)

MMKV provides fast, synchronous, encrypted storage. The adapter wraps MMKV to match redux-persist's async interface:

```typescript
import { Platform } from "react-native";
import { MMKV } from "react-native-mmkv";

const STORAGE_ID = "redux-encrypted-storage";
const ENCRYPTION_KEY =
  "689739ececd77a72a0dff2b075c1a6761a9dd0ec4af9334319d8f0e73e3ba1a6"; // 32-byte hex

export const storage = new MMKV({
  id: STORAGE_ID,
  encryptionKey: Platform.OS === "web" ? undefined : ENCRYPTION_KEY,
});

// redux-persist expects Promise-returning methods
export const reduxPersistStorage = {
  setItem: (key: string, value: string) => {
    try {
      storage.set(key, value);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error setting item in storage: ", error);
      return Promise.resolve(false);
    }
  },
  getItem: (key: string) => {
    try {
      const value = storage.getString(key);
      return Promise.resolve(value ?? null);
    } catch (error) {
      console.error("Error getting item from storage: ", error);
      return Promise.resolve(null);
    }
  },
  removeItem: (key: string) => {
    try {
      storage.delete(key);
      return Promise.resolve();
    } catch (error) {
      console.error("Error removing item from storage: ", error);
      return Promise.resolve(true); // Must return value for redux-persist to await
    }
  },
};
```

### Key Configuration Points

| Aspect | Implementation |
|--------|----------------|
| **Encryption** | 32-byte hex key; disabled on web (MMKV not available) |
| **Instance ID** | Unique per app (`redux-encrypted-storage`) |
| **Promise wrapping** | All methods return `Promise.resolve()` for redux-persist compatibility |
| **Error handling** | Log errors but don't throw — return safe defaults |

### Persist Config (`src/store/index.ts`)

```typescript
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { createTransform } from "redux-persist";
import { reduxPersistStorage } from "@/utils/Storage";

// Transform to strip transient state before persisting
const resetAuthTransientState = (state: any) => state ? {
  ...state,
  mPin: null,
  isSwitchingEnvironment: false,
  switchingEnvironmentTarget: null,
  switchEnvironmentError: null,
} : state;

const authPersistTransform = createTransform(
  (inboundState) => resetAuthTransientState(inboundState),   // Before save
  (outboundState) => resetAuthTransientState(outboundState), // After rehydrate
  { whitelist: ["auth"] }
);

const PersistConfig = {
  key: "root",
  storage: reduxPersistStorage,
  whitelist: ["auth", "tabs"], // Only persist these slices
  transforms: [authPersistTransform],
};

const persistedRootReducer = persistReducer(PersistConfig, rootReducer);
```

### What Gets Persisted

```typescript
const appReducer = combineReducers({
  auth: authSlice,      // ✅ Persisted (tokens, user, environment, mainAccountUser)
  tabs: tabsSlice,      // ✅ Persisted (active tab index)
  futures: futuresSlice, // ❌ Ephemeral — fresh on each boot
  trade: tradeSlice,    // ❌
  portfolio: portfolioSlice, // ❌
  // ... other slices
});
```

### Rehydration Flow

1. App starts → `persistStore(store)` begins rehydration
2. `REHYDRATE` action dispatched with persisted `auth` + `tabs`
3. Reducers receive rehydrated state
4. **No `loadUserRedux` dispatched** — auth restored purely via persist
5. Any data needed after restart **must live in persisted slices**

### Environment Switch Persist Pattern

```typescript
// In switchEnvironmentSaga (authSaga.ts)
yield put(switchEnvironmentSuccess(res));
yield call(() => persistor.flush());  // 1. Persist NEW env + tokens FIRST
yield call(DevSettings.reload);        // 2. Then restart app

// In authReducer.ts — switchEnvironmentSuccess
switchEnvironmentSuccess(state, action) {
  // ... update tokens, environment
  // CRITICAL: Refresh mainAccountUser snapshot
  if (data?.user) {
    state.mainAccountUser = { ...state.mainAccountUser, ...data.user };
  }
}
```

**Why this order matters**: If you reload before flush, the old environment rehydrates and the switch appears lost.

### Logout Clears Persist

```typescript
// In authSaga.ts logout
yield put(logoutSuccess(res));
yield call(clearAllPersistedData);     // Custom: clear MMKV + other storage
yield call(() => persistor.flush());   // Ensure purge written
yield navigate("/");                    // Navigate to login

// In store/index.ts rootReducer
const rootReducer = (state, action) => {
  if (action.type === logoutSuccess.type) {
    state = undefined; // Full in-memory reset
  }
  return appReducer(state, action);
};
```

### Common MMKV Pitfalls

| Issue | Fix |
|-------|-----|
| `removeItem` doesn't return value | Return `Promise.resolve(true)` so redux-persist awaits it |
| Web build fails | Disable encryption: `Platform.OS === "web" ? undefined : KEY` |
| TypeScript errors on `storage.set` | MMKV `set` accepts string/number/boolean; ensure string for persist |
| Stale data after env switch | Flush before reload; refresh `mainAccountUser` in reducer |

---

## 17. Key Dependencies

```json
{
  "@reduxjs/toolkit": "^2.x",
  "redux-saga": "^1.x",
  "axios": "^1.x",
  "redux-persist": "^6.x",
  "react-native-mmkv": "^2.x",
  "expo-dev-settings": "~11.x"
}
```

---

This guide captures the essential patterns. Adapt paths/names to your project structure while keeping the architectural principles consistent.