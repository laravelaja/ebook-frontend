import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconArrowLeft, IconCalendar } from '@tabler/icons-react';
import { useAnnouncements } from '../../../../hooks/useApiData';

export const Info = () => {
  const navigate = useNavigate();
  const { data: announcements = [], isLoading: loading } = useAnnouncements();

  return (
    <div className="min-h-full w-full flex flex-col gap-5 px-5 pb-6 pt-5 text-slate-800 relative bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 shrink-0"
      >
        <button 
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <IconArrowLeft size={18} />
        </button>
        <div className="flex flex-col">
          <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest leading-none">Info & Update</span>
          <h2 className="text-base font-extrabold text-slate-800 mt-1 m-0">Pengumuman</h2>
        </div>
      </motion.div>

      {/* Announcements List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : announcements.length > 0 ? (
          announcements.map((ann: any) => (
            <div
              key={ann.id}
              onClick={() => navigate(`/info/${ann.id}`)}
              className="bg-white border border-slate-200/80 rounded-md overflow-hidden flex flex-col cursor-pointer hover:border-slate-300 transition-all active:scale-[0.99]"
            >
              <div className="w-full aspect-[21/9] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                <img
                  src={ann.image_url || ann.image}
                  alt={ann.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <IconCalendar size={12} />
                  <span className="text-[10px] font-bold">{ann.date}</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 line-clamp-1 m-0 leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 m-0 leading-relaxed mt-0.5">
                  {ann.excerpt}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <p className="text-xs">Belum ada pengumuman.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
