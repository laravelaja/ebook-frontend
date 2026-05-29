import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { IconMenu2 } from '@tabler/icons-react';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-slate-100 relative">
      {/* Sidebar (Desktop and Mobile Drawer) */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Backdrop overlay for Mobile Drawer */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Navbar Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 text-slate-300 hover:text-white rounded-md bg-transparent border-none cursor-pointer flex items-center justify-center"
              aria-label="Open Sidebar"
            >
              <IconMenu2 size={22} />
            </button>
            <span className="text-xs font-black uppercase tracking-wider">Admin Panel</span>
          </div>
        </header>

        {/* Dynamic Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
