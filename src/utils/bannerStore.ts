import { BANNERS } from '../data/EbookDummy';

export interface Banner {
  id: number;
  title: string;
  image: string;
}

const STORAGE_KEY = 'banners_db';

const initBanners = (): Banner[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fallback */ }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(BANNERS));
  return BANNERS;
};

export const getAllBanners = (): Banner[] => {
  return initBanners();
};

export const getBannerById = (id: number): Banner | undefined => {
  return getAllBanners().find((b) => b.id === id);
};

export const saveBanner = (data: Omit<Banner, 'id'> & { id?: number }): Banner => {
  const banners = getAllBanners();

  if (data.id) {
    const index = banners.findIndex((b) => b.id === data.id);
    if (index !== -1) {
      const updated = { ...banners[index], ...data } as Banner;
      banners[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
      return updated;
    }
  }

  const maxId = banners.reduce((max, b) => (b.id > max ? b.id : max), 0);
  const newBanner: Banner = {
    id: maxId + 1,
    title: data.title,
    image: data.image,
  };
  banners.push(newBanner);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
  return newBanner;
};

export const deleteBanner = (id: number): boolean => {
  const banners = getAllBanners();
  const filtered = banners.filter((b) => b.id !== id);
  if (filtered.length < banners.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
};
