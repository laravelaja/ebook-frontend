import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconMail, 
  IconBook, 
  IconClock, 
  IconBookmark, 
  IconLogout, 
  IconEdit, 
  IconCheck, 
  IconX,
  IconShieldCheck
} from '@tabler/icons-react';
import { LogoutModal } from '../../components/modal/Logout';

export const Profile = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');
  
  // Modal validation state
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  
  // Real stats metrics loaded from localStorage
  const [savedCount, setSavedCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);

  // Load profile data and stats
  useEffect(() => {
    const loggedUserStr = localStorage.getItem('logged_in_user');
    if (!loggedUserStr) {
      // Redirect to login if session is empty
      navigate('/login');
      return;
    }
    const loggedUser = JSON.parse(loggedUserStr);
    setUser(loggedUser);
    setNewBio(loggedUser.bio || '');

    // Load actual reading stats
    const saved = localStorage.getItem('saved_ebooks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSavedCount(parsed.length);
      } catch (e) {}
    }

    const history = localStorage.getItem('reading_history');
    if (history) {
      try {
        const parsed = JSON.parse(history);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setReadCount(Object.keys(parsed).length);
          
          let total = 0;
          Object.values(parsed).forEach((progress: any) => {
            if (progress && typeof progress === 'object' && 'page' in progress) {
              total += progress.page || 0;
            }
          });
          setPagesRead(total);
        }
      } catch (e) {}
    }
  }, [navigate]);

  const handleSaveBio = () => {
    if (!user) return;
    
    const updatedUser = { ...user, bio: newBio };
    setUser(updatedUser);
    localStorage.setItem('logged_in_user', JSON.stringify(updatedUser));

    // Also update in users database
    const dbStr = localStorage.getItem('users_db');
    if (dbStr) {
      try {
        const users = JSON.parse(dbStr);
        const updatedUsers = users.map((u: any) => {
          if (u.email === user.email) {
            return { ...u, bio: newBio };
          }
          return u;
        });
        localStorage.setItem('users_db', JSON.stringify(updatedUsers));
      } catch (e) {}
    }

    setIsEditingBio(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('logged_in_user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-full w-full flex flex-col bg-slate-50 text-slate-800">
      
      {/* 1. Header Profile Container */}
      <div className="bg-white border-b border-slate-200 px-5 pt-8 pb-6 flex flex-col items-center text-center shrink-0">
        
        {/* Avatar Profile */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>

        {/* User Info */}
        <h2 className="text-base font-black text-slate-900 tracking-tight mt-3.5 m-0">{user.name}</h2>
        <span className="text-[10px] text-slate-400 font-semibold tracking-wide flex items-center gap-1 mt-1">
          <IconMail size={12} />
          {user.email}
        </span>

        {/* Bio Section */}
        <div className="w-full mt-4 px-4">
          {isEditingBio ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Tulis biodata singkat..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold resize-none h-16"
                maxLength={100}
              />
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => {
                    setNewBio(user.bio || '');
                    setIsEditingBio(false);
                  }}
                  className="p-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-md cursor-pointer border-none"
                  title="Batal"
                >
                  <IconX size={14} />
                </button>
                <button
                  onClick={handleSaveBio}
                  className="p-1.5 bg-sky-600 text-white hover:bg-sky-700 rounded-md cursor-pointer border-none"
                  title="Simpan"
                >
                  <IconCheck size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative py-1 px-3 bg-slate-50 rounded-md border border-slate-100 inline-block max-w-full">
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic m-0">
                "{user.bio || 'Belum menulis biodata.'}"
              </p>
              <button
                onClick={() => setIsEditingBio(true)}
                className="absolute right-[-18px] top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-600 cursor-pointer border-none bg-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit Biodata"
              >
                <IconEdit size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Content Body Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-24 flex flex-col gap-5">
        
        {/* Statistics Grid */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none px-1">
            Ringkasan Aktivitas
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white border border-slate-200/80 rounded-md p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center mb-2 border border-slate-200/50">
                <IconBookmark size={16} />
              </div>
              <span className="text-sm font-black text-slate-800 leading-none">{savedCount}</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Tersimpan</span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-md p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center mb-2 border border-slate-200/50">
                <IconBook size={16} />
              </div>
              <span className="text-sm font-black text-slate-800 leading-none">{readCount}</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Dibaca</span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-md p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center mb-2 border border-slate-200/50">
                <IconClock size={16} />
              </div>
              <span className="text-sm font-black text-slate-800 leading-none">{pagesRead}</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Hal. Dibaca</span>
            </div>
          </div>
        </div>

        {/* Creator Studio Menu */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none px-1">
            Kreativitas
          </span>
          <button
            onClick={() => navigate('/creator')}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200/80 rounded-md p-3.5 flex items-center justify-between cursor-pointer text-left transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200/50 shrink-0">
                <IconEdit size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800 leading-none">Studio Penulis</span>
                <span className="text-[9px] text-slate-400 font-semibold mt-1">Tulis dan terbitkan ebook karyamu sendiri</span>
              </div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kelola</span>
          </button>
        </div>

        {/* Admin Panel - only for admin role */}
        {user.role === 'admin' && (
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none px-1">
              Administrasi
            </span>
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md p-3.5 flex items-center justify-between cursor-pointer text-left transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-sky-500 text-white flex items-center justify-center shrink-0">
                  <IconShieldCheck size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white leading-none">Admin Dashboard</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1">Kelola user, buku, banner, dan lainnya</span>
                </div>
              </div>
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider">Buka</span>
            </button>
          </div>
        )}

        {/* Account Settings List */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none px-1">
            Informasi Profil
          </span>
          <div className="bg-white border border-slate-200/80 rounded-md flex flex-col divide-y divide-slate-100">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Nama Pengguna</span>
              <span className="text-xs font-bold text-slate-700">{user.name}</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Status Akun</span>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-md">
                Aktif
              </span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Tipe Akun</span>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-md">
                Premium
              </span>
            </div>
          </div>
        </div>

        {/* Action area */}
        <div className="mt-2 shrink-0">
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="w-full py-3 bg-red-600 hover:bg-red-800 text-white hover:text-white text-xs font-extrabold rounded-md cursor-pointer transition-colors flex items-center justify-center gap-2 border border-slate-200/80 active:scale-[0.99]"
          >
            <IconLogout size={16} />
            Keluar Akun
          </button>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />

    </div>
  );
};
