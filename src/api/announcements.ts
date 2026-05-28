import { apiClient } from './client';

export const announcementsApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/announcements');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/announcements/${id}`);
    return data;
  },
  create: async (body: { title: string; excerpt: string; content: string; date: string; image_url?: string }) => {
    const { data } = await apiClient.post('/announcements', body);
    return data;
  },
  update: async (id: string, body: any) => {
    const { data } = await apiClient.put(`/announcements/${id}`, body);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/announcements/${id}`);
    return data;
  },
};
