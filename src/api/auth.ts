import { apiClient } from './client';

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
};
