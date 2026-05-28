import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../../../../data/EbookDummy';
import { getAllEbooks } from '../../../../utils/ebookStore';
import { SearchInput } from '../../components/SearchInput';
import { Chategory } from '../../components/Chategory';
import { IconSearch } from '@tabler/icons-react';
import { useMemo } from 'react';

export const EbookList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize from category parameter passed in navigate state
  const initialCategory = (location.state as any)?.category || 'Semua';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync state if navigation target changes
  useEffect(() => {
    const routeCategory = (location.state as any)?.category;
    if (routeCategory) {
      setSelectedCategory(routeCategory);
    }
  }, [location.state]);

  const ebooks = useMemo(() => getAllEbooks(), []);

  // Filter logic
  const filteredEbooks = ebooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-full w-full flex flex-col gap-6 px-5 pb-6 pt-5 text-slate-800 relative bg-white">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1"
      >
        <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest leading-none">
          Temukan Bacaan Anda
        </span>
        <h2 className="text-xl font-extrabold text-slate-800 mt-1 m-0">
          Koleksi Ebook
        </h2>
      </motion.div>

      {/* Filter & Search Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col gap-3 shrink-0"
      >
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <Chategory
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </motion.div>

      {/* Ebooks Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex-1"
      >
        {filteredEbooks.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {filteredEbooks.map((book) => (
              <div 
                key={book.id} 
                onClick={() => navigate(`/ebooks/${book.id}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-[148/210] w-full rounded-md overflow-hidden bg-slate-100 relative transition-transform duration-300 group-hover:-translate-y-1">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <IconSearch size={32} className="text-slate-300 mb-3" />
            <h4 className="text-sm font-bold text-slate-700 m-0">Ebook Tidak Ditemukan</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
