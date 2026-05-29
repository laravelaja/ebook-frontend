import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconArrowLeft, IconPlus, IconBook, IconFileText, IconPencil, IconSearch, IconFileTypePdf } from '@tabler/icons-react';
import { ebooksApi } from '../../../../api/ebooks';
import { useMyBooks } from '../../../../hooks/useApiData';
import { CreatorBookCard } from './components/CreatorBookCard';

export const CreatorDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: myBooks = [], isLoading: loading } = useMyBooks();

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini beserta seluruh isinya?')) {
      try {
        await ebooksApi.delete(String(id));
        queryClient.invalidateQueries({ queryKey: ['myBooks'] });
      } catch (error) {
        console.error('Error deleting ebook:', error);
        alert('Gagal menghapus ebook. Silakan coba lagi.');
      }
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = myBooks.length;
    const published = myBooks.filter((b: any) => (b.ebook_pages?.length || b.pages?.length || 0) > 0).length;
    const drafts = total - published;
    return { total, published, drafts };
  }, [myBooks]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return myBooks;
    return myBooks.filter((b: any) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.category_name || b.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [myBooks, searchQuery]);

  return (
    <div className="min-h-full w-full flex flex-col bg-slate-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-5 lg:px-8 py-5 bg-white border-b border-slate-200 shrink-0"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer border-none transition-colors"
          >
            <IconArrowLeft size={18} />
          </button>
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
              <IconPencil size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest leading-none">Studio Penulis</span>
              <h2 className="text-base font-extrabold text-slate-800 mt-0.5 m-0">Karya Saya</h2>
            </div>
          </div>
          <div className="sm:hidden flex flex-col">
            <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest leading-none">Studio Penulis</span>
            <h2 className="text-sm font-extrabold text-slate-800 mt-0.5 m-0">Karya Saya</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/creator/upload-pdf')}
            className="h-9 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer border-none flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
          >
            <IconFileTypePdf size={14} />
            <span className="hidden sm:inline">Upload PDF</span>
          </button>
          <button
            onClick={() => navigate('/creator/new')}
            className="h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg cursor-pointer border-none flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
          >
            <IconPlus size={14} />
            <span>Tulis Ebook</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Metrics Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="grid grid-cols-3 gap-4 mb-6"
            >
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
                  <IconBook size={16} className="text-slate-500" />
                </div>
                <span className="text-2xl font-black text-slate-800">{stats.total}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Total Buku</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
                  <IconFileText size={16} className="text-emerald-500" />
                </div>
                <span className="text-2xl font-black text-slate-800">{stats.published}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Terbit</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
                  <IconPencil size={16} className="text-amber-500" />
                </div>
                <span className="text-2xl font-black text-slate-800">{stats.drafts}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Draf</span>
              </div>
            </motion.div>

            {/* Search bar */}
            {myBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mb-5"
              >
                <div className="relative">
                  <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari judul atau kategori..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* Book List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col gap-3"
            >
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book: any) => (
                  <CreatorBookCard
                    key={book.id}
                    book={book}
                    onDelete={handleDelete}
                  />
                ))
              ) : myBooks.length > 0 && searchQuery ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                  <IconSearch size={32} className="text-slate-300 mb-3" />
                  <h4 className="text-sm font-bold text-slate-600 m-0">Tidak Ditemukan</h4>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Tidak ada buku yang cocok dengan pencarian "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <IconPencil size={24} className="text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 m-0">Belum Ada Karya</h4>
                  <p className="text-xs text-slate-400 mt-2 max-w-[240px] leading-relaxed">
                    Mulai bagikan pengetahuan atau ceritamu sekarang dengan menulis ebook pertamamu!
                  </p>
                  <button
                    onClick={() => navigate('/creator/new')}
                    className="mt-5 px-5 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-900 border-none transition-colors"
                  >
                    Mulai Menulis
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
