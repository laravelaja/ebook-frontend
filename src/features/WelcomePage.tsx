import { motion } from 'framer-motion';
import { IconBook, IconTrendingUp, IconAward, IconSparkles } from '@tabler/icons-react';

const FEATURED_BOOKS = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop',
    tag: 'Populer'
  },
  {
    id: 2,
    title: 'Seni Memahami Wanita',
    author: 'Henry Manampiring',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop',
    tag: 'Baru'
  }
];

export const WelcomePage = () => {
  return (
    <div className="min-h-full w-full flex flex-col justify-between px-6 pb-6 pt-10 text-slate-100 relative">
      
      {/* Top Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <IconBook size={20} className="text-white" stroke={2.5} />
          </div>
          <span className="text-lg font-black tracking-tight font-display bg-linear-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            AuraBook
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-900/60 border border-indigo-500/30 text-indigo-300 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
          <IconSparkles size={10} className="animate-pulse" />
          Beta 1.0
        </div>
      </motion.div>

      {/* Hero Body */}
      <div className="my-auto py-8 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col gap-2"
        >
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest leading-none">Mulai Petualangan Membaca</span>
          <h1 className="text-3xl font-black font-display tracking-tight leading-tight m-0 bg-linear-to-b from-white to-slate-300 bg-clip-text text-transparent">
            Temukan Dunia Baru di Ujung Jari Anda.
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed m-0 mt-2 font-light">
            Pengalaman membaca ebook yang imersif dengan desain adaptif, estetika premium, dan fitur pencarian pintar.
          </p>
        </motion.div>

        {/* Dynamic Mockup Book Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-3"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Rekomendasi Minggu Ini</span>
          
          <div className="grid grid-cols-2 gap-4">
            {FEATURED_BOOKS.map((book) => (
              <div 
                key={book.id} 
                className="glass-card p-3 rounded-2xl flex flex-col gap-2.5 group hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-3/4 w-full rounded-lg overflow-hidden bg-slate-800 relative border border-slate-700/30">
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-indigo-500/90 text-white text-[8px] font-black uppercase tracking-wider shadow-md">
                    {book.tag}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-slate-200 line-clamp-1 m-0 group-hover:text-indigo-400 transition-colors">
                    {book.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {book.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Onboarding Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-4"
      >
        {/* Quick features summary row */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center shrink-0">
              <IconTrendingUp size={14} className="text-indigo-400" />
            </div>
            <span className="text-[11px] font-bold">Interaktif</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center shrink-0">
              <IconAward size={14} className="text-pink-400" />
            </div>
            <span className="text-[11px] font-bold">Eksklusif</span>
          </div>
        </div>

        <button className="w-full h-13 rounded-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.6)] hover:translate-y-px active:scale-[0.98] transition-all border-none cursor-pointer flex items-center justify-center gap-2">
          <span>Jelajahi Sekarang</span>
          <IconSparkles size={16} />
        </button>
      </motion.div>
    </div>
  );
};
