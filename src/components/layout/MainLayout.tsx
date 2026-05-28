import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MainLayout = () => {
  const location = useLocation();
  const isCreatorMode = location.pathname.startsWith('/creator');

  return (
    <div className="min-h-dvh w-full flex items-center justify-center py-0 sm:py-8 bg-sky-50 relative overflow-hidden select-none">

      {/* Mobile Frame Container (Flat, No Shadow, Rounded-LG) */}
      <div 
        className={`w-full h-dvh sm:h-[calc(100vh-64px)] glass-effect sm:rounded-lg overflow-hidden flex flex-col relative sm:border sm:border-slate-200 z-10 transition-all duration-300 ${
          isCreatorMode ? 'max-w-7xl' : 'max-w-107.5'
        }`}
      >
        {/* Viewport for nested pages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y scrollbar-hide pt-0">
          <Outlet />
        </div>

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
};
