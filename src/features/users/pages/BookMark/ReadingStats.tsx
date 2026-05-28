import { useMemo } from 'react';
import { 
  IconBook, 
  IconBookmark,
  IconFileText,
  IconTrophy, 
  IconAward, 
  IconLock,
  IconCircleCheck
} from '@tabler/icons-react';

interface ReadingProgress {
  page: number;
  totalPages: number;
  updatedAt: string;
}

interface ReadingStatsProps {
  savedBookIds: string[];
  readingHistory: Record<string, ReadingProgress>;
}

export const ReadingStats = ({ savedBookIds, readingHistory }: ReadingStatsProps) => {
  const statsMetrics = useMemo(() => {
    const historyObj = (readingHistory && typeof readingHistory === 'object' && !Array.isArray(readingHistory))
      ? readingHistory
      : {};
    const totalRead = Object.keys(historyObj).length;
    const totalSaved = Array.isArray(savedBookIds) ? savedBookIds.length : 0;
    
    let pagesRead = 0;
    let completedBooks = 0;
    Object.values(historyObj).forEach((progress) => {
      if (progress && typeof progress === 'object' && 'page' in progress) {
        pagesRead += (progress as any).page || 0;
        if ((progress as any).page >= (progress as any).totalPages && (progress as any).totalPages > 0) {
          completedBooks++;
        }
      }
    });

    return {
      totalSaved,
      totalRead,
      pagesRead,
      completedBooks,
    };
  }, [savedBookIds, readingHistory]);

  const achievements = useMemo(() => {
    return [
      {
        id: 'first_book',
        title: 'Mulai Langkah',
        desc: 'Membuka buku pertama Anda untuk mulai membaca',
        unlocked: statsMetrics.totalRead >= 1,
        icon: IconCircleCheck,
      },
      {
        id: 'collector',
        title: 'Kolektor Buku',
        desc: 'Menyimpan minimal 3 buku ke bookmark',
        unlocked: statsMetrics.totalSaved >= 3,
        icon: IconAward,
      },
      {
        id: 'bookworm',
        title: 'Kutu Buku',
        desc: 'Membaca total 10 halaman buku',
        unlocked: statsMetrics.pagesRead >= 10,
        icon: IconTrophy,
      },
      {
        id: 'finisher',
        title: 'Penyelesai',
        desc: 'Menyelesaikan membaca 1 buku sampai halaman terakhir',
        unlocked: statsMetrics.completedBooks >= 1,
        icon: IconTrophy,
      },
    ];
  }, [statsMetrics]);

  return (
    <div className="flex flex-col gap-5">
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <IconBook size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-800 leading-none">{statsMetrics.totalRead}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">Buku Dibaca</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <IconBookmark size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-800 leading-none">{statsMetrics.totalSaved}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">Tersimpan</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <IconFileText size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-800 leading-none">{statsMetrics.pagesRead} hal</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">Halaman Dibaca</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
            <IconTrophy size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-800 leading-none">{statsMetrics.completedBooks}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">Buku Selesai</span>
          </div>
        </div>
      </div>

      {/* Achievements list */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none m-0 px-1 mt-1">
          Lencana & Pencapaian
        </h3>
        
        <div className="flex flex-col gap-2">
          {achievements.map((item) => {
            const Icon = item.unlocked ? item.icon : IconLock;
            return (
              <div 
                key={item.id} 
                className={`bg-white border rounded-md p-3 flex items-center gap-3.5 transition-all ${
                  item.unlocked ? 'border-slate-200/80' : 'border-slate-200/40 opacity-60'
                }`}
              >
                <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border ${
                  item.unlocked ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-200/50'
                }`}>
                  <Icon size={18} />
                </div>
                
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800 leading-none">{item.title}</span>
                    {item.unlocked && (
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-md">
                        Terbuka
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-medium leading-tight truncate">{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
