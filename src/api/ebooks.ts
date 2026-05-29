import { apiClient } from './client';

export const ebooksApi = {
  getAll: async (category?: string) => {
    const params = category && category !== 'Semua' ? { category } : {};
    const { data } = await apiClient.get('/ebooks', { params });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/ebooks/${id}`);
    return data;
  },
  getMyBooks: async () => {
    const { data } = await apiClient.get('/ebooks/my/books');
    return data;
  },
  create: async (body: any) => {
    const { data } = await apiClient.post('/ebooks', body);
    return data;
  },
  update: async (id: string, body: any) => {
    const { data } = await apiClient.put(`/ebooks/${id}`, body);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/ebooks/${id}`);
    return data;
  },
  incrementView: async (id: string) => {
    await apiClient.post(`/ebooks/${id}/view`);
  },
  // Pages
  getPages: async (ebookId: string) => {
    const { data } = await apiClient.get(`/ebooks/${ebookId}/pages`);
    return data;
  },
  savePage: async (ebookId: string, page: any) => {
    const { data } = await apiClient.post(`/ebooks/${ebookId}/pages`, page);
    return data;
  },
  deletePage: async (ebookId: string, pageId: string) => {
    const { data } = await apiClient.delete(`/ebooks/${ebookId}/pages/${pageId}`);
    return data;
  },
  // Bookmarks
  getBookmarks: async () => {
    const { data } = await apiClient.get('/ebooks/user/bookmarks');
    return data;
  },
  addBookmark: async (id: string) => {
    const { data } = await apiClient.post(`/ebooks/${id}/bookmark`);
    return data;
  },
  removeBookmark: async (id: string) => {
    const { data } = await apiClient.delete(`/ebooks/${id}/bookmark`);
    return data;
  },
  // Reading History
  getReadingHistory: async () => {
    const { data } = await apiClient.get('/ebooks/user/history');
    return data;
  },
  updateReadingHistory: async (id: string, currentPage: number, totalPages: number) => {
    const { data } = await apiClient.post(`/ebooks/${id}/history`, { currentPage, totalPages });
    return data;
  },
};
