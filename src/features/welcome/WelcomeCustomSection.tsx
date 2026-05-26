import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconCalendar, IconChevronRight } from '@tabler/icons-react';
import { TOP_EBOOKS, ANNOUNCEMENTS } from '../../data/EbookDummy';

export const WelcomeCustomSection = () => {
  const navigate = useNavigate();
  const [lastReadBook, setLastReadBook] = useState<any>(null);

  useEffect(() => {
    const historyStr = localStorage.getItem('reading_history');
    if (!historyStr) return;

    try {
      const history = JSON.parse(historyStr);
      if (history && typeof history === 'object' && !Array.isArray(history)) {
        const entries = Object.entries(history);
        if (entries.length === 0) return;

        const sorted = entries.sort((a: any, b: any) => {
          const timeA = new Date(a[1].updatedAt).getTime();
          const timeB = new Date(b[1].updatedAt).getTime();
          return timeB - timeA;
        });

        const latestEntry = sorted[0];
        const bookId = parseInt(latestEntry[0]);
        const progress = latestEntry[1] as any;

        const ebookDetail = TOP_EBOOKS.find((book) => book.id === bookId);
        if (ebookDetail) {
          setLastReadBook({
            ...ebookDetail,
            page: progress.page,
            totalPages: progress.totalPages || 3
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const progressPercent = useMemo(() => {
    if (!lastReadBook) return 0;
    return Math.min(
      100,
      Math.round((lastReadBook.page / lastReadBook.totalPages) * 100)
    );
  }, [lastReadBook]);

  // Show top 2 announcements
  const latestAnnouncements = useMemo(() => {
    return ANNOUNCEMENTS.slice(0, 2);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex flex-col gap-5"
    >
      {/* Continue Reading Widget (Dynamic, hides when empty) */}
      {lastReadBook && (
        <div className="bg-white border border-slate-200 p-3 rounded-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src={lastReadBook.cover} 
              alt={lastReadBook.title} 
              className="w-11 h-14 object-cover rounded-md border border-slate-200 shrink-0" 
            />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider">Sedang Dibaca</span>
              <h4 className="text-xs font-extrabold text-slate-800 mt-0.5 line-clamp-1 m-0">{lastReadBook.title}</h4>
              <p className="text-[10px] text-slate-400 m-0 mt-0.5">Halaman {lastReadBook.page} dari {lastReadBook.totalPages} • {progressPercent}% Selesai</p>
              {/* Progress Bar (Flat, No Gradient, Rounded-MD) */}
              <div className="w-28 h-1.5 bg-slate-100 rounded-md mt-1.5 overflow-hidden">
                <div className="h-full bg-sky-600 rounded-md" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/ebooks/${lastReadBook.id}/read`)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] px-3 py-2 rounded-md border-none cursor-pointer transition-all shrink-0 active:scale-95"
          >
            Lanjut
          </button>
        </div>
      )}

      {/* Pengumuman Terbaru Widget */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Pengumuman Terbaru</span>
          <span 
            onClick={() => navigate('/info')}
            className="text-xs font-bold text-sky-600 cursor-pointer hover:text-sky-700 transition-colors flex items-center gap-0.5"
          >
            Lihat Semua
            <IconChevronRight size={14} />
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {latestAnnouncements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => navigate(`/info/${ann.id}`)}
              className="bg-white border border-slate-200/80 rounded-md p-3 flex gap-3.5 items-center cursor-pointer hover:border-slate-300 transition-all active:scale-[0.99]"
            >
              <img
                src={ann.image}
                alt={ann.title}
                className="w-14 h-14 rounded-md object-cover border border-slate-200 shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1 text-slate-400">
                  <IconCalendar size={10} />
                  <span className="text-[9px] font-bold">{ann.date}</span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-800 mt-1 line-clamp-1 m-0 leading-snug">
                  {ann.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 m-0 leading-relaxed">
                  {ann.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
