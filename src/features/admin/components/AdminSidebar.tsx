import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconUsers,
  IconBook,
  IconPhoto,
  IconCategory,
  IconSpeakerphone,
  IconArrowLeft,
  IconShieldCheck,
  IconStar,
  IconX,
} from '@tabler/icons-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: IconDashboard },
  { label: 'Ebook Teratas', path: '/admin/featured', icon: IconStar },
  { label: 'Manajemen User', path: '/admin/users', icon: IconUsers },
  { label: 'Manajemen Buku', path: '/admin/books', icon: IconBook },
  { label: 'Carousel/Banner', path: '/admin/carousel', icon: IconPhoto },
  { label: 'Kategori', path: '/admin/categories', icon: IconCategory },
  { label: 'Pengumuman', path: '/admin/announcements', icon: IconSpeakerphone },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div 
      className={`fixed md:static inset-y-0 left-0 z-50 w-60 lg:w-64 bg-slate-900 text-white flex flex-col shrink-0 min-h-screen transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
            <IconShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold m-0 text-white">AuraBook</h1>
            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>
        {/* Close Button - Mobile Only */}
        <button
          onClick={onClose}
          className="md:hidden p-1 text-slate-400 hover:text-white rounded-md bg-transparent border-none cursor-pointer flex items-center justify-center"
          aria-label="Close Sidebar"
        >
          <IconX size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose(); // Auto-close drawer on mobile
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer border-none transition-all text-left ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} stroke={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <button
          onClick={() => {
            navigate('/');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer border-none bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-left"
        >
          <IconArrowLeft size={18} stroke={1.5} />
          <span>Kembali ke App</span>
        </button>
      </div>
    </div>
  );
};
