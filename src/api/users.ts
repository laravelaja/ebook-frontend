import { apiClient } from './client';

export const usersApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/users');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },
  create: async (body: { name: string; email: string; password_hash: string; role: string }) => {
    const { data } = await apiClient.post('/users', body);
    return data;
  },
  update: async (id: string, body: any) => {
    const { data } = await apiClient.put(`/users/${id}`, body);
    return data;
  },
  updateProfile: async (body: { name?: string; bio?: string; avatar_url?: string }) => {
    const { data } = await apiClient.put('/users/profile', body);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  },
};
