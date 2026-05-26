import { useMemo } from 'react';
import { 
  IconBook, 
  IconClock, 
  IconFlame, 
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
  savedBookIds: number[];
  readingHistory: Record<number, ReadingProgress>;
}

export const ReadingStats = ({ savedBookIds, readingHistory }: ReadingStatsProps) => {
  const statsMetrics = useMemo(() => {
    const historyObj = (readingHistory && typeof readingHistory === 'object' && !Array.isArray(readingHistory))
      ? readingHistory
      : {};
    const totalRead = Object.keys(historyObj).length;
    const totalSaved = Array.isArray(savedBookIds) ? savedBookIds.length : 0;
    
    let pagesRead = 0;
    Object.values(historyObj).forEach((progress) => {
      if (progress && typeof progress === 'object' && 'page' in progress) {
        pagesRead += (progress as any).page || 0;
      }
    });

    return {
      totalSaved,
      totalRead,
      pagesRead,
      minutesRead: pagesRead * 3, // assuming 3 minutes per page
      streak: 4 // mock streak days
    };
  }, [savedBookIds, readingHistory]);

  const dailyTarget = 20; // 20 mins daily target
  const targetPercent = Math.min(100, Math.round((statsMetrics.minutesRead / dailyTarget) * 100));

  const achievements = useMemo(() => {
    return [
      {
        id: 'first_book',
        title: 'Mulai Langkah',
        desc: 'Membuka buku pertama Anda untuk mulai membaca',
        unlocked: statsMetrics.totalRead >= 1,
        icon: IconCircleCheck,
        color: 'text-slate-600 bg-slate-50 border-slate-200/60'
      },
      {
        id: 'habit_builder',
        title: 'Pembaca Konsisten',
        desc: 'Menyimpan dan mengoleksi minimal 3 buku favorit',
        unlocked: statsMetrics.totalSaved >= 3,
        icon: IconAward,
        color: 'text-slate-600 bg-slate-50 border-slate-200/60'
      },
      {
        id: 'bookworm',
        title: 'Kutu Buku Unggul',
        desc: 'Menyelesaikan total pembacaan 10 halaman buku',
        unlocked: statsMetrics.pagesRead >= 10,
        icon: IconTrophy,
        color: 'text-slate-600 bg-slate-50 border-slate-200/60'
      }
    ];
  }, [statsMetrics.totalRead, statsMetrics.totalSaved, statsMetrics.pagesRead]);

  return (
    <div className="flex flex-col gap-5">
      
      {/* 1. Daily Progress Target Card */}
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 rounded-md p-5 text-white relative overflow-hidden">
        <div className="absolute right-[-15px] bottom-[-15px] opacity-10 text-white pointer-events-none">
          <IconClock size={110} />
        </div>
        <div className="relative z-10 flex flex-col">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-200">Target Hari Ini</span>
          <h2 className="text-lg font-black mt-1 leading-none">
            {statsMetrics.minutesRead} <span className="text-xs font-normal text-sky-200">/ {dailyTarget} menit</span>
          </h2>
          <p className="text-[10px] text-sky-100/80 mt-1 font-medium leading-relaxed">
            Target waktu baca dirancang untuk membangun kebiasaan membaca harian yang konsisten.
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${targetPercent}%` }} />
          </div>
          <div className="flex justify-between items-center mt-2.5 text-[9px] font-extrabold uppercase text-sky-100">
            <span>{targetPercent}% Tercapai</span>
            <span>{dailyTarget - statsMetrics.minutesRead > 0 ? `${dailyTarget - statsMetrics.minutesRead} m lagi` : 'Target tercapai! 🎉'}</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/50">
            <IconBook size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-800 leading-none">{statsMetrics.totalRead}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">Buku Dibuka</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/50">
            <IconFlame size={18} fill={statsMetrics.streak > 0 ? "currentColor" : "none"} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-800 leading-none">{statsMetrics.streak} Hari</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">Streak Baca</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/50">
            <IconClock size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-800 leading-none">{statsMetrics.minutesRead} m</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">Durasi Baca</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/50">
            <IconTrophy size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-800 leading-none">{statsMetrics.pagesRead} hal</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">Hal. Dibaca</span>
          </div>
        </div>
      </div>

      {/* 3. Achievements list */}
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
                  item.unlocked ? item.color : 'text-slate-400 bg-slate-50 border-slate-200/50'
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
