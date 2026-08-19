export const ROUTES = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  SEARCH: 'Search',
  EVENTS: 'Events',
  FAVOURITES: 'Favourites',
  PROFILE: 'Profile',
} as const;

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD] as const;
export const APP_ROUTES = [ROUTES.SEARCH, ROUTES.EVENTS, ROUTES.FAVOURITES, ROUTES.PROFILE] as const;