import { motion, AnimatePresence } from 'framer-motion';
import { IconLogout } from '@tabler/icons-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm
}: LogoutModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white border border-slate-200/80 rounded-md w-full max-w-sm p-5 flex flex-col items-center text-center z-10"
          >
            {/* Logout Icon */}
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center mb-4 border border-slate-200/50">
              <IconLogout size={22} />
            </div>

            {/* Title & Message */}
            <h3 className="text-sm font-black text-slate-800 m-0">Keluar Akun</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun Anda? Anda harus masuk kembali untuk melihat profil Anda.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-md cursor-pointer hover:bg-slate-200 active:scale-[0.98] transition-all border-none"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2.5 bg-red-600 text-white text-xs font-extrabold rounded-md cursor-pointer hover:bg-red-700 active:scale-[0.98] transition-all border-none"
              >
                Ya, Keluar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
