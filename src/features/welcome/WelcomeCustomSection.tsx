import { motion } from 'framer-motion';
import { IconTrendingUp, IconAward } from '@tabler/icons-react';

export const WelcomeCustomSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex flex-col gap-5"
    >
      {/* Continue Reading Widget */}
      <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=200&auto=format&fit=crop" 
            alt="Filosofi Teras" 
            className="w-11 h-14 object-cover rounded-lg border border-slate-200 shrink-0" 
          />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider">Sedang Dibaca</span>
            <h4 className="text-xs font-extrabold text-slate-800 mt-0.5 line-clamp-1 m-0">Filosofi Teras</h4>
            <p className="text-[10px] text-slate-400 m-0 mt-0.5">Bab 4 • 64% Selesai</p>
            {/* Progress Bar (Flat, No Gradient, Rounded-LG) */}
            <div className="w-28 h-1.5 bg-slate-100 rounded-lg mt-1.5 overflow-hidden">
              <div className="h-full bg-sky-600 rounded-lg" style={{ width: '64%' }}></div>
            </div>
          </div>
        </div>
        <button className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] px-3 py-2 rounded-lg border-none cursor-pointer transition-all shrink-0">
          Lanjut
        </button>
      </div>

      {/* Popular Categories */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Kategori Populer</span>
        <div className="flex flex-wrap gap-1.5">
          {['Pengembangan Diri', 'Bisnis & Finansial', 'Teknologi', 'Fiksi', 'Sastra'].map((category) => (
            <span key={category} className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-sky-50 hover:bg-sky-100 hover:text-sky-800 rounded-lg cursor-pointer transition-colors border border-sky-100/50">
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Quick stat row */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
            <IconTrendingUp size={16} className="text-sky-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Interaktif</span>
            <span className="text-[11px] font-extrabold text-slate-700 leading-none mt-1">Membaca Adaptif</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
            <IconAward size={16} className="text-sky-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Eksklusif</span>
            <span className="text-[11px] font-extrabold text-slate-700 leading-none mt-1">Konten Premium</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
