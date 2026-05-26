import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MainLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-0 sm:py-8 bg-slate-950 relative overflow-hidden select-none">
      
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-1 blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-2 blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-20%] w-[60%] h-[60%] rounded-full ambient-glow-3 blur-3xl opacity-40 pointer-events-none"></div>

      {/* Mobile Frame Container */}
      <div className="w-full max-w-[430px] h-screen sm:h-[calc(100vh-64px)] glass-effect sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative sm:border sm:border-slate-800/80 z-10">
        
        {/* Decorative notch/speaker capsule for phone visual */}
        <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-950 rounded-b-2xl border-x border-b border-slate-800/30 items-center justify-center z-[200]">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Viewport for nested pages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y scrollbar-hide pt-0 sm:pt-4">
          <Outlet />
        </div>

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
};
