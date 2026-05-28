import { apiClient } from './client';

export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
  },
};
