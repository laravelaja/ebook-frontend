import { CATEGORIES } from '../data/EbookDummy';

const STORAGE_KEY = 'categories_db';

const initCategories = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fallback */ }
  }
  const defaults = CATEGORIES.filter((c) => c !== 'Semua');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
};

export const getAllCategories = (): string[] => {
  return initCategories();
};

export const addCategory = (name: string): string[] => {
  const categories = getAllCategories();
  if (categories.includes(name.trim())) {
    return categories;
  }
  const updated = [...categories, name.trim()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateCategory = (index: number, newName: string): string[] => {
  const categories = getAllCategories();
  if (index < 0 || index >= categories.length) return categories;
  const updated = [...categories];
  updated[index] = newName.trim();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteCategory = (index: number): string[] => {
  const categories = getAllCategories();
  if (index < 0 || index >= categories.length) return categories;
  const updated = categories.filter((_, i) => i !== index);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
