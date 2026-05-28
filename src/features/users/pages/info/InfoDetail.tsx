import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconArrowLeft, IconCalendar, IconBell } from '@tabler/icons-react';
import { useAnnouncementById } from '../../../../hooks/useApiData';

export const InfoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: announcement, isLoading: loading, isError: error } = useAnnouncementById(id);

  if (loading) {
    return (
      <div className="min-h-full w-full flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-full w-full flex flex-col items-center justify-center p-5 text-center text-slate-400 bg-white">
        <IconBell size={32} className="text-slate-300 mb-3" />
        <h4 className="text-sm font-bold text-slate-700 m-0">Pengumuman Tidak Ditemukan</h4>
        <button
          onClick={() => navigate('/info')}
          className="mt-4 px-4 py-2 bg-slate-800 text-white text-xs font-extrabold rounded-md cursor-pointer hover:bg-slate-900 border-none"
        >
          Kembali ke Pengumuman
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full flex flex-col bg-white text-slate-800">
      {/* Hero Image area */}
      <div className="relative w-full aspect-[16/9] bg-slate-100 border-b border-slate-200">
        <img
          src={announcement.image_url || announcement.image}
          alt={announcement.title}
          className="w-full h-full object-cover"
        />
        {/* Floating Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-md bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-700 cursor-pointer hover:bg-white transition-colors"
        >
          <IconArrowLeft size={18} />
        </button>
      </div>

      {/* Content area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-5 py-6 flex flex-col gap-4 flex-1"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400">
            <IconCalendar size={12} />
            <span className="text-[10px] font-bold">{announcement.date}</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-md flex items-center gap-1">
            <IconBell size={10} />
            Pengumuman
          </span>
        </div>

        <h1 className="text-lg font-black text-slate-800 leading-snug m-0">
          {announcement.title}
        </h1>

        <p className="text-xs text-justify text-slate-600 leading-relaxed m-0 whitespace-pre-line mt-2">
          {announcement.content}
        </p>
      </motion.div>
    </div>
  );
};
