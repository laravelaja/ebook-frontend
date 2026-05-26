import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MainLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-0 sm:py-8 bg-sky-50 relative overflow-hidden select-none">

      {/* Mobile Frame Container (Flat, No Shadow, Rounded-LG) */}
      <div className="w-full max-w-107.5 h-screen sm:h-[calc(100vh-64px)] glass-effect sm:rounded-lg overflow-hidden flex flex-col relative sm:border sm:border-slate-200 z-10">
        
        {/* Decorative notch/speaker capsule for phone visual */}
        {/* <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-100 rounded-b-lg border-x border-b border-slate-200 items-center justify-center z-200">
          <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
        </div> */}

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
