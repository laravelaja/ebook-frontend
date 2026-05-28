import { apiClient } from './client';

export const categoriesApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/categories');
    return data;
  },
  create: async (name: string, order?: number) => {
    const { data } = await apiClient.post('/categories', { name, order });
    return data;
  },
  update: async (id: string, name: string) => {
    const { data } = await apiClient.put(`/categories/${id}`, { name });
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/categories/${id}`);
    return data;
  },
};
