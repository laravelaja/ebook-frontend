import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MainLayout = () => {
  const location = useLocation();
  const isCreatorMode = location.pathname.startsWith('/creator');

  return (
    <div className="min-h-dvh w-full flex items-center justify-center py-0 lg:py-8 bg-white lg:bg-sky-50 relative overflow-hidden select-none">

      {/* Container - full screen on mobile/tablet, framed on large desktop */}
      <div 
        className={`w-full h-dvh lg:h-[calc(100vh-64px)] bg-white lg:rounded-lg overflow-hidden flex flex-col relative lg:border lg:border-slate-200 z-10 transition-all duration-300 ${
          isCreatorMode ? 'lg:max-w-7xl' : 'lg:max-w-107.5'
        }`}
      >
        {/* Viewport for nested pages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y scrollbar-hide pt-[env(safe-area-inset-top,24px)]">
          <Outlet />
        </div>

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
};
