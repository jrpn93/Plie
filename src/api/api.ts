import { client, authClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  } | null;
}

export interface User {
  usr_id: number;
  usr_fname: string;
  usr_lname: string;
  usr_username: string;
  usr_email: string;
  usr_profile: string;
  usr_email_ver_token: string;
  usr_reset_pass_token: string;
  usr_email_verified_at: string;
  usr_provider_id: string | null;
  usr_login_type: string | null;
  usr_status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role: string;
  usr_profile_img: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface DanceStyle {
  ds_id: number;
  ds_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Event {
  event_id: number;
  event_name: string;
  description: string;
  event_profile_pic: string;
  event_profile_img: string;
  event_url: string;
  event_price_from: number;
  event_price_to: number;
  readable_from_date: string;
  readable_to_date: string;
  isFavorite: number;
  city: string;
  country: string;
  keywords: string[];
  danceStyles: DanceStyle[];
  event_date_id: number;
}

export interface EventsListingResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
    total: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number | null;
}

export const Api = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    
    const response = await authClient.post('/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getEvents: async (): Promise<EventsListingResponse> => {
    const response = await client.post('/events-listing');
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await client.get('/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await client.put('/profile', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
  },
};

export const normalizeAxiosError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return {
      message: axiosError.response?.data?.message || 'An error occurred',
      status: axiosError.response?.status ?? null,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unknown error occurred' };
};

export default Api;