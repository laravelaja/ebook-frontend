import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconArrowLeft, IconStar, IconBook, IconEye, IconWorld, IconBookmark } from '@tabler/icons-react';
import { TOP_EBOOKS } from '../../../../data/EbookDummy';

export const EbookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const book = TOP_EBOOKS.find((b) => b.id === Number(id));

  const [isBookmarked, setIsBookmarked] = useState(() => {
    const saved = localStorage.getItem('saved_ebooks');
    if (!saved) return false;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.map(Number).includes(Number(id));
    } catch {
      return false;
    }
  });

  const toggleBookmark = () => {
    const saved = localStorage.getItem('saved_ebooks');
    let list: number[] = [];
    try {
      list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
    
    if (list.includes(Number(id))) {
      list = list.filter((bookId) => bookId !== Number(id));
      setIsBookmarked(false);
    } else {
      list.push(Number(id));
      setIsBookmarked(true);
    }
    localStorage.setItem('saved_ebooks', JSON.stringify(list));
  };

  if (!book) {
    return (
      <div className="min-h-full w-full flex flex-col items-center justify-center p-5 text-center bg-white text-slate-800">
        <h3 className="text-lg font-bold">Ebook tidak ditemukan</h3>
        <button 
          onClick={() => navigate('/ebooks')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-sky-700 transition-colors"
        >
          Kembali ke Daftar Ebook
        </button>
      </div>
    );
  }

  // Fallback synopsis based on title
  const synopsis = `Buku "${book.title}" karya ${book.author} adalah salah satu karya terbaik di kategori ${book.category}. Buku ini menawarkan pandangan mendalam, analisis praktis, serta inspirasi berharga yang dapat langsung diterapkan dalam kehidupan sehari-hari. Cocok bagi pembaca yang ingin memperluas cakrawala berpikir dan meningkatkan kapasitas diri di bidang ini.`;

  return (
    <div className="min-h-full w-full flex flex-col bg-white text-slate-800 relative">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 bg-white sticky top-0 z-10 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <IconArrowLeft size={18} />
        </button>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detail Ebook</span>
        <button 
          onClick={toggleBookmark}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
            isBookmarked 
              ? 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100' 
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <IconBookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {/* Cover Image container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-40 mx-auto mt-4 aspect-[148/210] rounded-md overflow-hidden bg-slate-100 relative"
        >
          <img 
            src={book.cover} 
            alt={book.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Text Info */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mt-6 flex flex-col gap-1.5"
        >
          <span className="px-2.5 py-0.5 self-center rounded-lg bg-sky-50 text-sky-700 text-[9px] font-extrabold uppercase tracking-wider border border-sky-100/50">
            {book.category}
          </span>
          <h2 className="text-lg font-black tracking-tight text-slate-800 leading-snug m-0 px-2">
            {book.title}
          </h2>
          <p className="text-xs text-slate-500 font-semibold m-0">
            Oleh {book.author}
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 mt-6"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            {/* <IconStar size={16} className="text-amber-500" fill="currentColor" /> */}
            <span className="text-[11px] font-bold text-slate-800 leading-none mt-0.5">{book.rating}</span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Rating</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center border-l border-slate-200">
            {/* <IconEye size={16} className="text-sky-600" /> */}
            <span className="text-[11px] font-bold text-slate-800 leading-none mt-0.5">{book.views}</span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Dilihat</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center border-l border-slate-200">
            {/* <IconBook size={16} className="text-emerald-600" /> */}
            <span className="text-[11px] font-bold text-slate-800 leading-none mt-0.5">280 p.</span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Halaman</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center border-l border-slate-200">
            {/* <IconWorld size={16} className="text-indigo-600" /> */}
            <span className="text-[11px] font-bold text-slate-800 leading-none mt-0.5">IDN</span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Bahasa</span>
          </div>
        </motion.div>

        {/* Synopsis Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 flex flex-col gap-2.5"
        >
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest m-0">Sinopsis</h3>
          <p className="text-xs text-justify leading-relaxed m-0 font-medium">
            {synopsis}
          </p>
        </motion.div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-white/80 border-t border-slate-100 flex items-center justify-center z-10">
        <button 
          onClick={() => navigate(`/ebooks/${book.id}/read`)}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3.5 rounded-md border-none cursor-pointer active:scale-[0.98] transition-all"
        >
          Mulai Baca
        </button>
      </div>
    </div>
  );
};
