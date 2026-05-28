import type { Ebook } from '../data/EbookDummy';
import { TOP_EBOOKS } from '../data/EbookDummy';

const STORAGE_KEY = 'ebooks_db';

// Initialize ebooks list in localStorage if it doesn't exist
export const initEbooksDB = (): Ebook[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(TOP_EBOOKS));
    return TOP_EBOOKS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(TOP_EBOOKS));
    return TOP_EBOOKS;
  }
};

export const getAllEbooks = (): Ebook[] => {
  return initEbooksDB();
};

export const getEbookById = (id: number): Ebook | undefined => {
  const books = getAllEbooks();
  return books.find((b) => b.id === id);
};

export const saveEbook = (bookData: Partial<Ebook> & { id?: number }): Ebook => {
  const books = getAllEbooks();
  
  if (bookData.id) {
    // Edit existing book
    const index = books.findIndex((b) => b.id === bookData.id);
    if (index !== -1) {
      const updatedBook = {
        ...books[index],
        ...bookData,
      } as Ebook;
      books[index] = updatedBook;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      return updatedBook;
    }
  }

  // Create new book
  // Find highest ID
  const maxId = books.reduce((max, b) => (b.id > max ? b.id : max), 0);
  const newBook: Ebook = {
    id: maxId + 1,
    title: bookData.title || 'Judul Baru',
    author: bookData.author || 'Anonim',
    cover: bookData.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop',
    rating: bookData.rating || 5.0,
    views: bookData.views || '0',
    category: bookData.category || 'Semua',
    pages: bookData.pages || [],
    synopsis: bookData.synopsis || '',
    isUserCreated: true
  };

  books.push(newBook);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return newBook;
};

export const deleteEbook = (id: number): boolean => {
  const books = getAllEbooks();
  const filtered = books.filter((b) => b.id !== id);
  if (filtered.length < books.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
};
