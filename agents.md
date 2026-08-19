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
- **State Management**: Redux Toolkit + Redux Saga (not installed yet)
- **Navigation**: React Navigation (Stack + Bottom Tabs)

## Project Structure
```
Plie/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── api/              # API client & endpoints
│   │   ├── client.ts     # Axios/fetch client setup (EMPTY)
│   │   └── api.ts        # API endpoint definitions (EMPTY)
│   ├── constants/        # App constants
│   │   ├── colors.ts     # Color palette ✅
│   │   ├── fonts.ts      # Font families & weights ✅
│   │   ├── images.ts     # Image assets references ✅
│   │   ├── storage-keys.ts # AsyncStorage/MM KV keys (EMPTY)
│   │   ├── constants.ts  # General constants ✅
│   │   └── routes.ts     # Route names ✅
│   ├── store/            # Redux store
│   │   └── index.ts      # Store configuration (EMPTY)
│   ├── types/            # TypeScript types
│   │   └── index.ts      # Type definitions (EMPTY)
│   ├── components/       # Reusable components
│   │   ├── AppText.tsx   # Wrapper text component ✅
│   │   └── AppTextInput.tsx # Text input with label/eye button ✅
│   ├── screens/          # Screen components
│   │   ├── login.screen.tsx      # Login UI ✅ (no API)
│   │   ├── home.screen.tsx       # Basic placeholder ✅
│   │   └── bottom-tab/
│   │       ├── events.screen.tsx    # EMPTY
│   │       ├── search.screen.tsx    # EMPTY
│   │       ├── favourites.screen.tsx # EMPTY
│   │       └── profile.screen.tsx   # EMPTY
│   ├── router/           # Navigation configuration
│   │   ├── root.router.tsx        # Stack navigator ✅
│   │   └── bottom-tab.router.tsx  # Bottom tabs (only Home) ✅
│   ├── utils/            # Utility functions
│   │   └── RNSize.ts     # Responsive sizing helpers ✅
│   └── assets/           # Images, fonts, etc.
│       └── images/       # logo.png, dancing-girl-bg.png, eye.png, eye-off.png ✅
├── __tests__/            # Jest test files (EMPTY)
├── App.tsx               # Main app component ✅
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
- Login API integration
- Error handling & loading states
- Redirect to main app on success
- **Status: UI COMPLETE** (AppTextInput with eye button, validation pending, no API integration)

### 3. State Management: Redux + Saga
- **Redux Toolkit** for store setup
- **Redux Saga** for async API calls
- Slices: `auth`, `events`, `favourites`, `profile`
- Saga watchers for: login, fetchEvents, toggleFavourite, fetchProfile
- **Status: NOT STARTED** (dependencies not installed, store/index.ts empty)

### 4. Main App - 4 Bottom Tabs
1. **Search** - Search events with debounced input
2. **Events** - List of events with pull-to-refresh
3. **Favourites** - User's favourited events
4. **Profile** - User profile & settings
- **Status: ROUTER SETUP DONE** (bottom-tab.router.tsx exists but only has Home tab)

### 5. Events Screen
- Fetch events from API
- **Skeleton loaders** while fetching
- **Pull-to-refresh** implementation
- FlatList/SectionList for performance
- Each event card: image, title, date, location, favourite button
- **Status: NOT STARTED** (file exists but empty)

### 6. Search Screen
- Search bar with debounced API calls
- Results list with skeleton loading
- Clear search functionality
- Recent searches (optional)
- **Status: NOT STARTED** (file exists but empty)

### 7. Favourites - Optimistic UI
- Tap favourite button → immediate UI update
- Background API call to add/remove favourite
- Rollback on API failure with error toast
- Persist favourites in Redux + AsyncStorage
- **Status: NOT STARTED** (file exists but empty)

### 8. Profile Screen
- Profile picture (editable)
- Name & email display
- 5 option items (e.g., Settings, Notifications, Help, About, Logout)
- Logout clears auth & navigates to Login
- **Status: NOT STARTED** (file exists but empty)

## API Endpoints (To Be Implemented)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User login |
| `/events` | GET | Fetch events (paginated) |
| `/events/search` | GET | Search events |
| `/favourites` | GET | Get user favourites |
| `/favourites` | POST | Add to favourites |
| `/favourites/:id` | DELETE | Remove from favourites |
| `/profile` | GET | Get user profile |
| `/profile` | PUT | Update profile |

## Architecture Notes

### Component Structure
- **App.tsx**: Root with Providers (SafeArea, Navigation) - Redux Provider missing
- **Screens**: Login, Home, MainTabs (Search, Events, Favourites, Profile)
- **Shared Components**: AppText, AppTextInput, (EventCard, SkeletonLoader, SearchBar, BottomTabBar - to create)

### Redux Store Structure (Planned)
```
store/
├── index.ts              # Store configuration (EMPTY)
├── rootSaga.ts           # Root saga (to create)
├── slices/
│   ├── authSlice.ts      # User auth state (to create)
│   ├── eventsSlice.ts    # Events list, loading, error (to create)
│   ├── favouritesSlice.ts # Favourite IDs & items (to create)
│   └── profileSlice.ts   # Profile data (to create)
└── sagas/
    ├── authSaga.ts
    ├── eventsSaga.ts
    ├── favouritesSaga.ts
    └── profileSaga.ts
```

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` → `src/*`
- React Native types included

### Testing Strategy
- Unit tests for sagas, slices, utils
- Component tests for screens & shared components
- Integration tests for navigation flows
- Jest with React Native preset
- **Status: NOT STARTED**

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

# Additional dependencies needed:
npm install @reduxjs/toolkit redux-saga react-redux
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install axios react-native-mmkv @react-native-async-storage/async-storage
```

**Note:** Navigation dependencies already installed. Redux, Saga, Axios, MMKV, AsyncStorage still needed.

## Key Files for Review
- `src/store/index.ts` - Redux store with Saga middleware (EMPTY)
- `src/api/client.ts` - API client setup (EMPTY)
- `src/api/api.ts` - API endpoints (EMPTY)
- `src/types/index.ts` - TypeScript types (EMPTY)
- `src/constants/` - Constants (colors, fonts, images, routes, storage-keys partially done)
- `src/store/slices/*.ts` - Feature slices (to create)
- `src/store/sagas/*.ts` - API sagas (to create)
- `src/router/` - Navigation setup (DONE: root + bottom-tab)
- `src/screens/` - Screen components (Login & Home done, others empty)
- `src/components/` - Reusable UI components (AppText, AppTextInput done)

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
- [ ] Install Redux dependencies (@reduxjs/toolkit, redux-saga, react-redux)
- [ ] Install API/Storage dependencies (axios, react-native-mmkv, @react-native-async-storage/async-storage)
- [ ] Configure Redux store with Saga middleware
- [ ] Set up React Navigation (Stack + Bottom Tabs) ✅ (basic structure done)
- [ ] Create Splash screen with background image
- [ ] Add auto-navigation logic (auth check)

### Phase 2: Auth
- [x] Login screen UI (AppTextInput with eye toggle, styling)
- [ ] Login form validation
- [ ] Login API service (src/api/client.ts, src/api/api.ts)
- [ ] Auth slice + saga
- [ ] Token storage (AsyncStorage/MMKV)
- [ ] Protected routes / auth guard
- [ ] Add Redux Provider to App.tsx

### Phase 3: Events & Search
- [ ] Events API service
- [ ] Events slice + saga
- [ ] Events screen with FlatList
- [ ] Skeleton loader component
- [ ] Pull-to-refresh
- [ ] Search screen with debounced search
- [ ] Search API integration
- [ ] Add Search, Events, Favourites, Profile tabs to bottom-tab.router.tsx

### Phase 4: Favourites (Optimistic UI)
- [ ] Favourites slice + saga
- [ ] Optimistic update logic
- [ ] Favourite button component
- [ ] Favourites tab screen
- [ ] Persist favourites locally

### Phase 5: Profile
- [ ] Profile API service
- [ ] Profile slice + saga
- [ ] Profile screen UI
- [ ] Profile picture picker
- [ ] 5 option items + Logout

### Phase 6: Polish
- [ ] Error boundaries
- [ ] Loading states everywhere
- [ ] Empty states
- [ ] Unit/integration tests
- [ ] Lint & typecheck pass
- [ ] Platform testing (iOS/Android)