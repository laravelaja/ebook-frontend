import { useNavigate } from 'react-router-dom';
import type { Ebook } from '../../../../../data/EbookDummy';
import { IconEdit, IconTrash, IconFileText, IconBook } from '@tabler/icons-react';

interface CreatorBookCardProps {
  book: Ebook;
  onDelete: (id: number) => void;
}

export const CreatorBookCard = ({ book, onDelete }: CreatorBookCardProps) => {
  const navigate = useNavigate();
  const pageCount = book.pages?.length || 0;
  const isPublished = pageCount > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center hover:border-slate-300 transition-colors">
      {/* Cover Image */}
      <img
        src={book.cover}
        alt={book.title}
        className="w-14 h-20 lg:w-16 lg:h-22 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
      />

      {/* Details Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
            {book.category}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            isPublished 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-amber-50 text-amber-700'
          }`}>
            {isPublished ? '● Terbit' : '○ Draf'}
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-800 line-clamp-1 m-0">
          {book.title}
        </h4>

        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1">
            <IconFileText size={12} />
            <span className="text-[10px] font-medium">{pageCount} Halaman</span>
          </div>
          {book.synopsis && (
            <span className="text-[10px] font-medium text-slate-300 hidden sm:block truncate max-w-[200px]">
              {book.synopsis}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => navigate(`/creator/write/${book.id}`)}
          className="h-8 px-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg cursor-pointer border-none flex items-center justify-center gap-1.5 text-[11px] font-bold transition-colors"
          title="Tulis Isi Halaman"
        >
          <IconEdit size={13} />
          <span className="hidden sm:inline">Tulis</span>
        </button>

        <button
          onClick={() => navigate(`/creator/edit/${book.id}`)}
          className="h-8 w-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer border-none flex items-center justify-center transition-colors"
          title="Edit Info Ebook"
        >
          <IconBook size={13} />
        </button>

        <button
          onClick={() => onDelete(book.id)}
          className="h-8 w-8 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer border-none flex items-center justify-center transition-colors"
          title="Hapus Ebook"
        >
          <IconTrash size={13} />
        </button>
      </div>
    </div>
  );
};
