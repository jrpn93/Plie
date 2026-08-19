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
- **State Management**: Redux Toolkit + Redux Saga
- **Navigation**: React Navigation (Bottom Tabs)

## Project Structure
```
Plie/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── api/              # API client & endpoints
│   │   ├── client.ts     # Axios/fetch client setup
│   │   └── api.ts        # API endpoint definitions
│   ├── constants/        # App constants
│   │   ├── colors.ts     # Color palette
│   │   ├── fonts.ts      # Font families & weights
│   │   ├── images.ts     # Image assets references
│   │   ├── storage-keys.ts # AsyncStorage/MM KV keys
│   │   └── constants.ts  # General constants
│   ├── store/            # Redux store (created)
│   │   └── index.ts      # Store configuration (empty)
│   ├── types/            # TypeScript types
│   │   └── index.ts      # Type definitions (empty)
│   ├── components/       # Reusable components (to create)
│   ├── screens/          # Screen components (to create)
│   ├── navigation/       # Navigation configuration (to create)
│   ├── utils/            # Utility functions (to create)
│   └── assets/           # Images, fonts, etc. (to create)
├── __tests__/            # Jest test files
├── App.tsx               # Main app component
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

### 2. Login Screen
- Email/password fields with validation
- Login API integration
- Error handling & loading states
- Redirect to main app on success

### 3. State Management: Redux + Saga
- **Redux Toolkit** for store setup
- **Redux Saga** for async API calls
- Slices: `auth`, `events`, `favourites`, `profile`
- Saga watchers for: login, fetchEvents, toggleFavourite, fetchProfile

### 4. Main App - 4 Bottom Tabs
1. **Search** - Search events with debounced input
2. **Events** - List of events with pull-to-refresh
3. **Favourites** - User's favourited events
4. **Profile** - User profile & settings

### 5. Events Screen
- Fetch events from API
- **Skeleton loaders** while fetching
- **Pull-to-refresh** implementation
- FlatList/SectionList for performance
- Each event card: image, title, date, location, favourite button

### 6. Search Screen
- Search bar with debounced API calls
- Results list with skeleton loading
- Clear search functionality
- Recent searches (optional)

### 7. Favourites - Optimistic UI
- Tap favourite button → immediate UI update
- Background API call to add/remove favourite
- Rollback on API failure with error toast
- Persist favourites in Redux + AsyncStorage

### 8. Profile Screen
- Profile picture (editable)
- Name & email display
- 5 option items (e.g., Settings, Notifications, Help, About, Logout)
- Logout clears auth & navigates to Login

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
- **App.tsx**: Root with Providers (Redux, Navigation, SafeArea)
- **Screens**: Splash, Login, MainTabs (Search, Events, Favourites, Profile)
- **Shared Components**: EventCard, SkeletonLoader, SearchBar, BottomTabBar

### Redux Store Structure (Planned)
```
store/
├── index.ts              # Store configuration (created, empty)
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

## Key Files for Review
- `src/store/index.ts` - Redux store with Saga middleware (created, empty)
- `src/api/client.ts` - API client setup (created, empty)
- `src/api/api.ts` - API endpoints (created, empty)
- `src/types/index.ts` - TypeScript types (created, empty)
- `src/constants/` - Constants (colors, fonts, images, storage keys)
- `src/store/slices/*.ts` - Feature slices (to create)
- `src/store/sagas/*.ts` - API sagas (to create)
- `src/navigation/` - Navigation setup (to create)
- `src/screens/` - All screen components (to create)
- `src/components/` - Reusable UI components (to create)

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
- [ ] Install dependencies (Redux, Navigation, Saga, etc.)
- [ ] Configure Redux store with Saga middleware
- [ ] Set up React Navigation (Stack + Bottom Tabs)
- [ ] Create Splash screen with background image
- [ ] Add auto-navigation logic (auth check)

### Phase 2: Auth
- [ ] Login screen UI
- [ ] Login API service
- [ ] Auth slice + saga
- [ ] Token storage (AsyncStorage/MMKV)
- [ ] Protected routes / auth guard

### Phase 3: Events & Search
- [ ] Events API service
- [ ] Events slice + saga
- [ ] Events screen with FlatList
- [ ] Skeleton loader component
- [ ] Pull-to-refresh
- [ ] Search screen with debounced search
- [ ] Search API integration

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