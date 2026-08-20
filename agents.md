# Plie - React Native Demo Project

## Project Overview
This is a React Native CLI template project (`Plie`) bootstrapped with `@react-native-community/cli`. It serves as a practical interview assignment demonstrating React Native development practices.

## Tech Stack
- **React Native**: 0.87.0
- **React**: 19.2.3
- **TypeScript**: 6.0.3
- **Testing**: Jest + React Test Renderer
- **Linting**: ESLint with React Native config
- **Formatting**: Prettier
- **State Management**: Redux Toolkit + Redux Saga + MMKV Persistence ✅
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **API Client**: Axios with interceptors (token refresh, request queuing)

## Project Structure
```
Plie/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── api/              # API client & endpoints
│   │   ├── client.ts     # Axios dual clients + interceptors ✅
│   │   └── api.ts        # API endpoint definitions ✅
│   ├── constants/        # App constants
│   │   ├── colors.ts     # Color palette ✅
│   │   ├── fonts.ts      # Font families & weights ✅
│   │   ├── images.ts     # Image assets references ✅
│   │   ├── storage-keys.ts # MMKV storage keys ✅
│   │   ├── constants.ts  # General constants (API URLs) ✅
│   │   └── routes.ts     # Route names (Auth + App routes) ✅
│   ├── store/            # Redux store
│   │   ├── index.ts      # Store configuration with Saga + Persist ✅
│   │   ├── reducers/
│   │   │   └── index.ts  # Root reducer ✅
│   │   ├── slices/
│   │   │   └── authSlice.ts # Auth slice ✅
│   │   └── sagas/
│   │       ├── index.ts  # Root saga ✅
│   │       └── authSaga.ts # Auth saga ✅
│   ├── types/            # TypeScript types
│   │   ├── index.ts      # Type definitions ✅
│   │   └── mmkv.d.ts     # MMKV types ✅
│   ├── components/       # Reusable components
│   │   ├── AppText.tsx   # Wrapper text component ✅
│   │   └── AppTextInput.tsx # Text input with label/eye button + error ✅
│   ├── hooks/            # Custom hooks
│   │   └── useRedux.ts   # Typed Redux hooks ✅
│   ├── screens/          # Screen components
│   │   ├── auth/         # Auth module screens ✅
│   │   │   ├── LoginScreen.tsx      # Login with Redux integration ✅
│   │   │   ├── RegisterScreen.tsx   # Register UI ✅
│   │   │   └── ForgotPasswordScreen.tsx # Forgot password UI ✅
│   │   ├── app/          # Main app screens ✅
│   │   │   ├── HomeScreen.tsx       # Home with logout ✅
│   │   │   ├── SearchScreen.tsx     # Search with debounced input ✅
│   │   │   ├── EventsScreen.tsx     # Events with pull-to-refresh + skeletons ✅
│   │   │   ├── FavouritesScreen.tsx # Favourites with optimistic UI ✅
│   │   │   └── ProfileScreen.tsx    # Profile with 5 options + logout ✅
│   ├── router/           # Navigation configuration
│   │   ├── root.router.tsx        # Auth/App stack switcher ✅
│   │   ├── auth.stack.tsx         # Auth stack navigator ✅
│   │   └── app.stack.tsx          # Bottom tabs navigator ✅
│   ├── utils/            # Utility functions
│   │   ├── RNSize.ts     # Responsive sizing helpers ✅
│   │   └── Storage.ts    # MMKV storage for redux-persist ✅
│   └── assets/           # Images, fonts, etc.
│       └── images/       # logo.png, dancing-girl-bg.png, eye.png, eye-off.png ✅
├── __tests__/            # Jest test files (EMPTY)
├── App.tsx               # Main app with Provider + PersistGate ✅
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler config
├── tsconfig.json         # TypeScript config
├── .eslintrc.js          # ESLint config
└── .prettierrc.js        # Prettier config
```

## Available Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Start Metro dev server |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |

## App Requirements & Features

### 1. Splash Screen
- Background image (full screen)
- Centered text (app name/logo)
- Branding at bottom-center
- Auto-navigate to Login after delay or auth check
- **Status: NOT STARTED**

### 2. Login Screen
- Email/password fields with validation
- Login API integration with Redux Saga
- Error handling & loading states
- Redirect to main app on success
- **Status: COMPLETE** (UI + Redux integration + API service)

### 3. State Management: Redux + Saga + MMKV
- **Redux Toolkit** for store setup ✅
- **Redux Saga** for async API calls ✅
- **MMKV** for encrypted persistence (redux-persist) ✅
- Slice: `auth` (token, refreshToken, user, isAuthenticated, loading, error) ✅
- Saga watchers: login, logout, setTokens ✅
- Token refresh with request queuing (race condition safe) ✅
- **Status: COMPLETE**

### 4. Main App - 4 Bottom Tabs
1. **Events** - List of events with pull-to-refresh + skeleton loaders, pressable search bar navigates to Search ✅
2. **Search** - Auto-focuses input on tab press, debounced search, clear button inside input ✅
3. **Favourites** - User's favourited events with optimistic UI ✅
4. **Profile** - User profile & settings (5 options + Logout) ✅
- **Status: COMPLETE**

### 5. Events Screen
- Fetch events from API (mocked)
- **Skeleton loaders** while fetching ✅
- **Pull-to-refresh** implementation ✅
- FlatList for performance ✅
- Each event card: title, date, location, favourite button ✅
- **Pressable search bar** navigates to Search screen with auto-focus ✅
- Default event image (image-preview.png) when no event image ✅
- **Status: COMPLETE** (mock data)

### 6. Search Screen
- Search bar with debounced input (300ms) ✅
- Results list with real-time filtering ✅
- Clear search functionality ✅
- **Status: COMPLETE** (mock data)

### 7. Favourites - Optimistic UI
- Tap favourite button → immediate UI update ✅
- Background API call to add/remove favourite (mocked) ✅
- Rollback on API failure (ready for implementation) ✅
- **Status: COMPLETE** (mock data)

### 8. Profile Screen
- Profile picture (placeholder + camera button) ✅
- Name & email display from Redux ✅
- 5 option items: Settings, Notifications, Help, About, Logout ✅
- Logout clears auth & navigates to Login ✅
- **Status: COMPLETE**

## API Endpoints (Implemented in Service Layer)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User login ✅ |
| `/auth/refresh` | POST | Refresh access token ✅ |
| `/auth/logout` | POST | User logout ✅ |
| `/profile` | GET | Get user profile ✅ |
| `/profile` | PUT | Update profile ✅ |

*Events/Favourites endpoints ready for integration when backend available*

## Architecture Notes

### Component Structure
- **App.tsx**: Root with Providers (SafeArea, Navigation, Redux, PersistGate) ✅
- **Screens**: Auth screens (Login, Register, ForgotPassword) + App screens (Home, Search, Events, Favourites, Profile)
- **Shared Components**: AppText, AppTextInput (with error support)

### Redux Store Structure (Implemented)
```
store/
├── index.ts              # Store configuration with Saga + Persist ✅
├── reducers/
│   └── index.ts          # Root reducer (auth) ✅
├── slices/
│   └── authSlice.ts      # User auth state ✅
└── sagas/
    ├── index.ts          # Root saga ✅
    └── authSaga.ts       # Auth saga (login, logout, token refresh) ✅
```

### Navigation Structure (Implemented)
```
Auth Stack (unauthenticated):
├── Login
├── Register
└── ForgotPassword

App Stack (authenticated) - Bottom Tabs:
├── Home
├── Search
├── Events
├── Favourites
└── Profile
```

### Authentication Flow
1. App starts → PersistGate waits for Redux hydration
2. `root.router.tsx` reads `state.auth.isAuthenticated`
3. If authenticated → shows AppStack (bottom tabs)
4. If not authenticated → shows AuthStack (login/register)
5. Login success → Redux updates `isAuthenticated: true` → auto-navigates to AppStack
6. Logout → Redux clears auth → auto-navigates to AuthStack

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` → `src/*` (configured in tsconfig.json)
- React Native types included

### Testing Strategy
- Unit tests for sagas, slices, utils (NOT STARTED)
- Component tests for screens & shared components (NOT STARTED)
- Integration tests for navigation flows (NOT STARTED)
- Jest with React Native preset

## Development Setup

### Prerequisites
- Node.js >= 22.11.0
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (iOS dependencies)

### First-time Setup
```bash
# Install JS dependencies
npm install

# iOS only - install CocoaPods
bundle install
bundle exec pod install
```

**Note:** All dependencies already installed including Redux Toolkit, Redux Saga, Axios, react-native-mmkv, React Navigation.

## Key Files for Review
- `src/store/index.ts` - Redux store with Saga middleware + MMKV persist
- `src/api/client.ts` - Axios dual clients with interceptors (token refresh queue)
- `src/api/api.ts` - API endpoints with type-safe interfaces
- `src/store/slices/authSlice.ts` - Auth state management
- `src/store/sagas/authSaga.ts` - Auth async flows with takeLatest
- `src/utils/Storage.ts` - MMKV storage adapter for redux-persist
- `src/router/root.router.tsx` - Auth/App stack switcher
- `src/router/auth.stack.tsx` - Auth stack navigator
- `src/router/app.stack.tsx` - Bottom tabs navigator
- `src/screens/auth/LoginScreen.tsx` - Login with Redux integration
- `src/screens/app/*.tsx` - All 5 app screens implemented
- `src/hooks/useRedux.ts` - Typed Redux hooks

## Evaluation Criteria
- Code organization and modularity
- TypeScript usage and type safety
- Test coverage and quality
- Performance considerations (FlatList, memo, skeletons)
- Platform-specific handling (iOS/Android)
- Error handling and edge cases
- Optimistic UI implementation
- Redux + Saga patterns correctness

## Implementation Checklist (Track Progress)

### Phase 1: Setup & Splash
- [x] Install Navigation dependencies (@react-navigation/native, bottom-tabs, native-stack, screens, safe-area-context)
- [x] Install Redux dependencies (@reduxjs/toolkit, redux-saga, react-redux)
- [x] Install API/Storage dependencies (axios, react-native-mmkv)
- [x] Configure Redux store with Saga middleware + MMKV persist
- [x] Set up React Navigation (Stack + Bottom Tabs)
- [ ] Create Splash screen with background image
- [ ] Add auto-navigation logic (auth check - handled by root.router)

### Phase 2: Auth
- [x] Login screen UI (AppTextInput with eye toggle, styling)
- [x] Login form validation (basic)
- [x] Login API service (src/api/client.ts, src/api/api.ts)
- [x] Auth slice + saga
- [x] Token storage (MMKV via redux-persist)
- [x] Protected routes / auth guard (root.router.tsx)
- [x] Add Redux Provider + PersistGate to App.tsx

### Phase 3: Events & Search
- [x] Events API service (mocked)
- [x] Events slice + saga (using auth slice for now)
- [x] Events screen with FlatList + skeleton loaders
- [x] Pull-to-refresh
- [x] Search screen with debounced search
- [x] Search API integration (mocked)
- [x] Add Search, Events, Favourites, Profile tabs to bottom tabs

### Phase 4: Favourites (Optimistic UI)
- [x] Favourites UI with optimistic updates
- [x] Favourite button component
- [x] Favourites tab screen
- [ ] Persist favourites locally (in Redux - ready for backend)

### Phase 5: Profile
- [x] Profile API service (mocked)
- [x] Profile slice (using auth slice for now)
- [x] Profile screen UI
- [x] Profile picture picker (UI only)
- [x] 5 option items + Logout

### Phase 6: Polish
- [ ] Error boundaries
- [x] Loading states everywhere
- [x] Empty states
- [ ] Unit/integration tests
- [x] Lint & typecheck pass
- [ ] Platform testing (iOS/Android)

## Dependencies Installed
```json
{
  "@reduxjs/toolkit": "^2.12.0",
  "redux-saga": "^1.5.1",
  "react-redux": "^9.3.0",
  "axios": "^1.19.0",
  "redux-persist": "^6.0.0",
  "react-native-mmkv": "^4.3.2",
  "@react-navigation/native": "^7.3.17",
  "@react-navigation/bottom-tabs": "^7.18.17",
  "@react-navigation/native-stack": "^7.18.9",
  "react-native-screens": "^4.27.0",
  "react-native-safe-area-context": "^5.9.1"
}
```