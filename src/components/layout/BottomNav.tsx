import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { IconHome, IconBook, IconBookmark, IconUser } from '@tabler/icons-react';
import { ebooksApi } from '../../api/ebooks';
import { bannersApi } from '../../api/banners';
import { announcementsApi } from '../../api/announcements';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: IconHome },
  { label: 'Ebook', path: '/ebooks', icon: IconBook },
  { label: 'Bookmark', path: '/bookmarks', icon: IconBookmark },
  { label: 'Profile', path: '/profile', icon: IconUser },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Hide bottom nav on ebook reader page, auth pages, and chapter editor
  if (
    location.pathname.endsWith('/read') || 
    location.pathname === '/login' || 
    location.pathname === '/register' ||
    location.pathname.includes('/creator/write')
  ) {
    return null;
  }

  const prefetchForPath = (path: string) => {
    switch (path) {
      case '/':
        queryClient.prefetchQuery({ queryKey: ['banners'], queryFn: () => bannersApi.getAll() });
        queryClient.prefetchQuery({ queryKey: ['ebooks', 'all'], queryFn: () => ebooksApi.getAll() });
        queryClient.prefetchQuery({ queryKey: ['announcements'], queryFn: () => announcementsApi.getAll() });
        break;
      case '/ebooks':
        queryClient.prefetchQuery({ queryKey: ['ebooks', 'all'], queryFn: () => ebooksApi.getAll() });
        break;
      case '/bookmarks':
        queryClient.prefetchQuery({ queryKey: ['ebooks', 'all'], queryFn: () => ebooksApi.getAll() });
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full bg-white border-t border-slate-200 flex items-center justify-around shrink-0 pb-2 pt-2 px-2 z-100">
      {NAV_ITEMS.map((item) => {
        const isActive = item.path === '/' 
          ? location.pathname === '/' 
          : location.pathname.startsWith(item.path);
          
        const Icon = item.icon;
        
        return (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out group relative ${
              isActive ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
            }`}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => prefetchForPath(item.path)}
            onTouchStart={() => prefetchForPath(item.path)}
          >
            {/* Indikator aktif - solid line di atas tanpa shadow */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-sky-600 rounded-lg"></span>
            )}
            
            <div className={`transition-all duration-200 transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              <Icon 
                size={22} 
                stroke={isActive ? 2.5 : 1.8}
                color={isActive ? 'currentColor' : 'currentColor'}
              />
            </div>
            <span className={`text-[10px] font-semibold leading-none tracking-wide transition-all duration-200 ${
              isActive ? 'text-sky-600 font-extrabold' : 'text-inherit'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
