import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconBook, IconSearch, IconUser } from '@tabler/icons-react';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: IconHome },
  { label: 'Library', path: '/library', icon: IconBook },
  { label: 'Search', path: '/search', icon: IconSearch },
  { label: 'Profile', path: '/profile', icon: IconUser },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full h-20 min-h-[80px] bg-slate-950/80 backdrop-blur-xl border-t border-slate-900/60 flex items-center justify-around shrink-0 pb-5 pt-2 px-2 z-[100]">
      {NAV_ITEMS.map((item) => {
        const isActive = item.path === '/' 
          ? location.pathname === '/' 
          : location.pathname.startsWith(item.path);
          
        const Icon = item.icon;
        
        return (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 ease-in-out group relative ${
              isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => navigate(item.path)}
          >
            {/* Glowing spot indicator for active item */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"></span>
            )}
            
            <div className={`transition-all duration-300 transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              <Icon 
                size={22} 
                stroke={isActive ? 2.5 : 1.8}
                color={isActive ? 'currentColor' : 'currentColor'}
              />
            </div>
            <span className={`text-[10px] font-semibold leading-none tracking-wide transition-all duration-300 ${
              isActive ? 'text-indigo-300 font-extrabold' : 'text-inherit'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
