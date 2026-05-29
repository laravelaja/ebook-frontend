import { apiClient } from './client';
import { supabase } from './supabaseClient';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    bio: string;
    avatar_url: string;
  };
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },
  register: async (name: string, email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/auth/register', { name, email, password });
    return data;
  },
  getMe: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
  loginWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });
    if (error) throw error;
    return data;
  },
  // Handle the callback after Google redirects back
  handleGoogleCallback: async (): Promise<LoginResponse | null> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;

    // Use the Supabase session to login/register in our backend
    const { data } = await apiClient.post('/auth/google', {
      email: session.user.email,
      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
      avatar_url: session.user.user_metadata?.avatar_url || '',
      google_id: session.user.id,
    });
    return data;
  },
};
