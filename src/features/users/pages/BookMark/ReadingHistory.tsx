import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconHistory, IconChevronRight, IconSearch } from '@tabler/icons-react';
import { SearchInput } from '../../components/SearchInput';

interface ReadingProgress {
  page: number;
  totalPages: number;
  updatedAt: string;
}

interface HistoryBookItem {
  book: {
    id: number;
    title: string;
    author: string;
    cover: string;
    category: string;
    rating: number;
  };
  progress: ReadingProgress;
}

interface ReadingHistoryProps {
  historyBooks: HistoryBookItem[];
}

export const ReadingHistory = ({ historyBooks }: ReadingHistoryProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter history based on search query
  const filteredHistory = useMemo(() => {
    return historyBooks.filter(({ book }) => {
      return (
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [historyBooks, searchQuery]);

  if (historyBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200/50">
          <IconHistory size={28} />
        </div>
        <h3 className="text-sm font-black text-slate-800 m-0">Belum ada riwayat baca</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-[240px] leading-relaxed">
          Buku yang Anda buka dan baca akan otomatis muncul di tab riwayat ini.
        </p>
        <button
          onClick={() => navigate('/ebooks')}
          className="mt-5 px-5 py-2.5 bg-sky-600 text-white text-xs font-extrabold rounded-md cursor-pointer hover:bg-sky-700 transition-colors border-none"
        >
          Mulai Membaca
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search History Bar */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Cari dalam riwayat baca..."
      />

      {filteredHistory.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredHistory.map(({ book, progress }) => {
            const percent = Math.round((progress.page / progress.totalPages) * 100);
            return (
              <div
                key={book.id}
                onClick={() => navigate(`/ebooks/${book.id}/read`)}
                className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center cursor-pointer hover:border-slate-300 active:scale-[0.99] transition-all group"
              >
                {/* Cover */}
                <div className="w-12 aspect-[148/210] rounded-md overflow-hidden bg-slate-100 shrink-0">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>

                {/* Progress and Details */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight leading-snug truncate m-0">
                    {book.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold m-0 mt-0.5 truncate">
                    Halaman {progress.page} dari {progress.totalPages}
                  </p>

                  {/* Progress Bar Container */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-[10px] font-extrabold text-sky-600 leading-none">{percent}%</span>
                  </div>
                </div>

                <IconChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Search State */
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <IconSearch size={32} className="text-slate-300 mb-3" />
          <h4 className="text-sm font-bold text-slate-700 m-0">Riwayat Tidak Ditemukan</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
            Coba gunakan kata kunci lain untuk mencari judul atau penulis riwayat.
          </p>
        </div>
      )}
    </div>
  );
};
