import { motion } from 'framer-motion';
import { IconBook, IconBell } from '@tabler/icons-react';

interface WelcomeHeaderProps {
  user: { name: string } | null;
}

export const WelcomeHeader = ({ user }: WelcomeHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between"
    >
      {user ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-extrabold font-display">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none m-0">Selamat Datang Kembali</p>
            <h2 className="text-base font-extrabold text-slate-800 mt-1.5 leading-none m-0">Halo, {user.name}!</h2>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-sky-600 flex items-center justify-center">
            <IconBook size={20} className="text-white" stroke={2.5} />
          </div>
          <span className="text-lg font-black tracking-tight font-display text-slate-800">
            AuraBook
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
          <IconBell size={18} />
        </button>
      </div>
    </motion.div>
  );
};
