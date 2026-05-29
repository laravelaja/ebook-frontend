import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconBookmark, 
  IconStar, 
  IconTrash
} from '@tabler/icons-react';
import { useEbooks, useBookmarks, useReadingHistory } from '../../../../hooks/useApiData';
import { ebooksApi } from '../../../../api/ebooks';
import { SearchInput } from '../../components/SearchInput';
import { Chategory } from '../../components/Chategory';
import { BookmarkTabs } from '../../components/BookmarkTabs';
import { ReadingHistory } from './ReadingHistory';
import { ReadingStats } from './ReadingStats';
import { DeleteModal } from '../../components/modal/Delete';

type TabType = 'saved' | 'history' | 'stats';

interface ReadingProgress {
  page: number;
  totalPages: number;
  updatedAt: string;
}

export const SaveList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal delete validation states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  // State for dynamic items from localStorage
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<Record<string, ReadingProgress>>({});

  const loggedIn = !!localStorage.getItem('logged_in_user');

  // Fetch all books from API using react-query
  const { data: allBooks = [] } = useEbooks();

  // Fetch bookmarks and history from API if logged in
  const { data: remoteBookmarks } = useBookmarks();
  const { data: remoteHistory } = useReadingHistory();

  // Sync and load data
  useEffect(() => {
    // 1. Sync remote bookmarks to local storage
    if (loggedIn && remoteBookmarks && Array.isArray(remoteBookmarks)) {
      const ids = remoteBookmarks.map((b: any) => String(b.id));
      localStorage.setItem('saved_ebooks', JSON.stringify(ids));
      setSavedBookIds(ids);
    } else {
      // Fallback/Initial load from local storage
      const saved = localStorage.getItem('saved_ebooks');
      let parsedSaved: string[] = [];
      if (saved) {
        try {
          const val = JSON.parse(saved);
          if (Array.isArray(val)) {
            parsedSaved = val.map(String);
          }
        } catch (e) {}
      }
      setSavedBookIds(parsedSaved);
    }
  }, [remoteBookmarks, loggedIn]);

  useEffect(() => {
    // 2. Sync remote history to local storage
    if (loggedIn && remoteHistory && Array.isArray(remoteHistory)) {
      const historyObj: Record<string, ReadingProgress> = {};
      remoteHistory.forEach((h: any) => {
        if (h.ebook_id && h.progress) {
          historyObj[h.ebook_id] = {
            page: h.progress.page,
            totalPages: h.progress.totalPages,
            updatedAt: h.progress.updatedAt
          };
        }
      });
      localStorage.setItem('reading_history', JSON.stringify(historyObj));
      setReadingHistory(historyObj);
    } else {
      // Fallback/Initial load from local storage
      const history = localStorage.getItem('reading_history');
      let parsedHistory: Record<string, ReadingProgress> = {};
      if (history) {
        try {
          const val = JSON.parse(history);
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            parsedHistory = val;
          }
        } catch (e) {}
      }
      setReadingHistory(parsedHistory);
    }
  }, [remoteHistory, loggedIn]);

  // Filter bookmarked books
  const savedBooks = useMemo(() => {
    return allBooks.filter((book: any) => savedBookIds.includes(String(book.id)));
  }, [savedBookIds, allBooks]);

  // Categories in bookmarked books
  const categories = useMemo(() => {
    const cats = ['Semua'];
    savedBooks.forEach((book: any) => {
      if (!cats.includes(book.category)) {
        cats.push(book.category);
      }
    });
    return cats;
  }, [savedBooks]);

  // Lookup target book title for delete confirmation
  const targetBookTitle = useMemo(() => {
    if (bookToDelete === null) return '';
    const found = savedBooks.find((b: any) => String(b.id) === String(bookToDelete));
    return found ? found.title : '';
  }, [bookToDelete, savedBooks]);

  // Filtered bookmarked list
  const filteredSavedBooks = useMemo(() => {
    return savedBooks.filter((book: any) => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [savedBooks, searchQuery, selectedCategory]);

  // History list (sorted by last updated)
  const historyBooks = useMemo(() => {
    const historyObj = (readingHistory && typeof readingHistory === 'object' && !Array.isArray(readingHistory))
      ? readingHistory
      : {};
    return Object.entries(historyObj)
      .map(([idStr, progress]) => {
        const book = allBooks.find((b: any) => String(b.id) === idStr);
        return {
          book,
          progress: progress as ReadingProgress
        };
      })
      .filter((item): item is { book: any; progress: ReadingProgress } => !!item.book && !!item.progress)
      .sort((a, b) => new Date(b.progress.updatedAt).getTime() - new Date(a.progress.updatedAt).getTime());
  }, [readingHistory, allBooks]);

  const removeBookmark = async (id: string) => {
    const newList = savedBookIds.filter((bookId) => bookId !== id);
    setSavedBookIds(newList);
    localStorage.setItem('saved_ebooks', JSON.stringify(newList));
    
    if (loggedIn) {
      try {
        await ebooksApi.removeBookmark(id);
      } catch (err) {
        console.error('Error removing bookmark from backend:', err);
      }
    }
  };



  return (
    <div className="min-h-full w-full flex flex-col bg-slate-50 text-slate-800">
      
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-6 pb-4 sticky top-0 z-20 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 tracking-tight m-0">Bookmark Saya</h1>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md border border-sky-100">
            Koleksi
          </span>
        </div>

        {/* Tab Controls */}
        <div className="mt-5">
          <BookmarkTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: SAVED (BOOKMARKS) */}
          {activeTab === 'saved' && (
            <motion.div
              key="saved-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Search Bar */}
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Cari buku tersimpan..."
              />

              {/* Category Filter Chips */}
              {categories.length > 1 && (
                <Chategory
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              )}

              {/* Saved Books List */}
              {filteredSavedBooks.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredSavedBooks.map((book: any) => (
                    <div
                      key={book.id}
                      onClick={() => navigate(`/ebooks/${book.id}`)}
                      className="bg-white border border-slate-200/80 rounded-md p-3 flex gap-3.5 items-center cursor-pointer hover:border-slate-300 active:scale-[0.99] transition-all group relative"
                    >
                      {/* Cover */}
                      <div className="w-14 aspect-[148/210] rounded-md overflow-hidden bg-slate-100 shrink-0">
                        <img src={book.cover_url || book.cover} alt={book.title} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-center min-w-0 pr-6">
                        <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-wider mb-0.5">
                          {book.category}
                        </span>
                        <h4 className="text-xs font-black text-slate-800 tracking-tight leading-snug truncate m-0">
                          {book.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold m-0 mt-0.5 truncate">
                          {book.author}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2">
                          <IconStar size={12} className="text-amber-500" fill="currentColor" />
                          <span className="text-[10px] font-extrabold text-slate-700 leading-none">{book.rating}</span>
                        </div>
                      </div>

                      {/* Remove Bookmark Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookToDelete(book.id);
                          setIsDeleteOpen(true);
                        }}
                        className="absolute right-3 top-3 w-8 h-8 rounded-md bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Hapus Bookmark"
                      >
                        <IconTrash size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200/50">
                    <IconBookmark size={28} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 m-0">Belum ada buku tersimpan</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px] leading-relaxed">
                    Simpan buku favorit Anda dari halaman detail untuk dibaca nanti.
                  </p>
                  <button
                    onClick={() => navigate('/ebooks')}
                    className="mt-5 px-5 py-2.5 bg-sky-600 text-white text-xs font-extrabold rounded-md cursor-pointer hover:bg-sky-700 transition-colors border-none"
                  >
                    Jelajahi Ebook
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: HISTORY */}
          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReadingHistory historyBooks={historyBooks} />
            </motion.div>
          )}

          {/* TAB 3: STATS (READING ANALYTICS) */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReadingStats savedBookIds={savedBookIds} readingHistory={readingHistory} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setBookToDelete(null);
        }}
        onConfirm={() => {
          if (bookToDelete !== null) {
            removeBookmark(bookToDelete);
          }
        }}
        title="Hapus Bookmark"
        message={
          targetBookTitle 
            ? `Apakah Anda yakin ingin menghapus "${targetBookTitle}" dari daftar bookmark Anda?`
            : 'Apakah Anda yakin ingin menghapus buku ini dari daftar bookmark Anda?'
        }
      />

    </div>
  );
};
