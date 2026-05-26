import { motion, AnimatePresence } from 'framer-motion';
import { IconAlertTriangle } from '@tabler/icons-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Hapus Bookmark',
  message = 'Apakah Anda yakin ingin menghapus buku ini dari bookmark?',
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal'
}: DeleteModalProps) => {
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
            {/* Warning Icon */}
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100/50">
              <IconAlertTriangle size={22} />
            </div>

            {/* Title & Message */}
            <h3 className="text-sm font-black text-slate-800 m-0">{title}</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-md cursor-pointer hover:bg-slate-200 active:scale-[0.98] transition-all border-none"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2.5 bg-red-600 text-white text-xs font-extrabold rounded-md cursor-pointer hover:bg-red-700 active:scale-[0.98] transition-all border-none"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
