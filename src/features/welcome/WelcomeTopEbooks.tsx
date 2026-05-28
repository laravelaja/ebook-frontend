import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface WelcomeTopEbooksProps {
  ebooks: any[];
}

export const WelcomeTopEbooks = ({ ebooks }: WelcomeTopEbooksProps) => {
  const navigate = useNavigate();
  const displayEbooks = ebooks.slice(0, 6);

  if (displayEbooks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Ebook Teratas</span>
        <span 
          onClick={() => navigate('/ebooks')}
          className="text-xs font-bold text-sky-600 cursor-pointer hover:text-sky-700 transition-colors"
        >
          Lihat Semua
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {displayEbooks.map((book) => (
          <div 
            key={book.id} 
            onClick={() => navigate(`/ebooks/${book.id}`)}
            className="cursor-pointer group"
          >
            <div className="aspect-[148/210] w-full rounded-md overflow-hidden bg-slate-100 relative transition-transform duration-300 group-hover:-translate-y-1">
              <img 
                src={book.cover_url || book.cover} 
                alt={book.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
