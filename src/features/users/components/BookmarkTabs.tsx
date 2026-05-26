import { IconBookmark, IconHistory, IconChartBar } from '@tabler/icons-react';

type TabType = 'saved' | 'history' | 'stats';

interface BookmarkTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BookmarkTabs = ({ activeTab, setActiveTab }: BookmarkTabsProps) => {
  return (
    <div className="flex bg-slate-100/80 border border-slate-200/50 rounded-md p-1">
      <button
        onClick={() => setActiveTab('saved')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-bold transition-all border-none cursor-pointer ${
          activeTab === 'saved'
            ? 'bg-white text-sky-600'
            : 'text-slate-500 hover:text-slate-800 bg-transparent'
        }`}
      >
        <IconBookmark size={15} />
        Tersimpan
      </button>
      <button
        onClick={() => setActiveTab('history')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-bold transition-all border-none cursor-pointer ${
          activeTab === 'history'
            ? 'bg-white text-sky-600'
            : 'text-slate-500 hover:text-slate-800 bg-transparent'
        }`}
      >
        <IconHistory size={15} />
        Riwayat
      </button>
      <button
        onClick={() => setActiveTab('stats')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-bold transition-all border-none cursor-pointer ${
          activeTab === 'stats'
            ? 'bg-white text-sky-600'
            : 'text-slate-500 hover:text-slate-800 bg-transparent'
        }`}
      >
        <IconChartBar size={15} />
        Statistik
      </button>
    </div>
  );
};
