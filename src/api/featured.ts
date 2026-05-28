import { apiClient } from './client';

export const featuredApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/featured');
    return data;
  },
  set: async (items: { ebook_id: string; position: number }[]) => {
    const { data } = await apiClient.post('/featured', { items });
    return data;
  },
};
