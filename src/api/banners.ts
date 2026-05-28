import { apiClient } from './client';

export const bannersApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/banners');
    return data;
  },
  create: async (title: string, image_url: string) => {
    const { data } = await apiClient.post('/banners', { title, image_url });
    return data;
  },
  update: async (id: string, updates: { title?: string; image_url?: string }) => {
    const { data } = await apiClient.put(`/banners/${id}`, updates);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/banners/${id}`);
    return data;
  },
};
