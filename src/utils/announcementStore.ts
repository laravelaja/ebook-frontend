import { ANNOUNCEMENTS } from '../data/EbookDummy';
import type { Announcement } from '../data/EbookDummy';

export type { Announcement };

const STORAGE_KEY = 'announcements_db';

const initAnnouncements = (): Announcement[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fallback */ }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ANNOUNCEMENTS));
  return ANNOUNCEMENTS;
};

export const getAllAnnouncements = (): Announcement[] => {
  return initAnnouncements();
};

export const getAnnouncementById = (id: number): Announcement | undefined => {
  return getAllAnnouncements().find((a) => a.id === id);
};

export const saveAnnouncement = (data: Omit<Announcement, 'id'> & { id?: number }): Announcement => {
  const announcements = getAllAnnouncements();

  if (data.id) {
    const index = announcements.findIndex((a) => a.id === data.id);
    if (index !== -1) {
      const updated = { ...announcements[index], ...data } as Announcement;
      announcements[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
      return updated;
    }
  }

  const maxId = announcements.reduce((max, a) => (a.id > max ? a.id : max), 0);
  const newAnnouncement: Announcement = {
    id: maxId + 1,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    date: data.date,
    image: data.image,
  };
  announcements.push(newAnnouncement);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
  return newAnnouncement;
};

export const deleteAnnouncement = (id: number): boolean => {
  const announcements = getAllAnnouncements();
  const filtered = announcements.filter((a) => a.id !== id);
  if (filtered.length < announcements.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
};
