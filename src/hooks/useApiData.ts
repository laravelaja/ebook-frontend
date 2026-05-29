import { useQuery } from '@tanstack/react-query';
import { ebooksApi } from '../api/ebooks';
import { categoriesApi } from '../api/categories';
import { bannersApi } from '../api/banners';
import { announcementsApi } from '../api/announcements';
import { usersApi } from '../api/users';
import { featuredApi } from '../api/featured';

export const useEbooks = (category?: string) => {
  return useQuery({
    queryKey: ['ebooks', category || 'all'],
    queryFn: () => ebooksApi.getAll(category),
  });
};

export const useEbookById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['ebook', id],
    queryFn: () => ebooksApi.getById(id!),
    enabled: !!id,
  });
};

export const useMyBooks = () => {
  return useQuery({
    queryKey: ['myBooks'],
    queryFn: () => ebooksApi.getMyBooks(),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });
};

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => bannersApi.getAll(),
  });
};

export const useAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsApi.getAll(),
  });
};

export const useAnnouncementById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => announcementsApi.getById(id!),
    enabled: !!id,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });
};


export const useFeaturedEbooks = () => {
  return useQuery({
    queryKey: ['featured'],
    queryFn: () => featuredApi.getAll(),
  });
};

export const useBookmarks = () => {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => ebooksApi.getBookmarks(),
  });
};

export const useReadingHistory = () => {
  return useQuery({
    queryKey: ['readingHistory'],
    queryFn: () => ebooksApi.getReadingHistory(),
  });
};
