import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { WelcomePage } from '../features/WelcomePage';
import { EbookList } from '../features/users/pages/ebook/EbookList';
import { EbookDetail } from '../features/users/pages/ebook/EbookDetail';
import { EbookRead } from '../features/users/pages/ebook/EbookRead';

// Placeholder Components for secondary pages
const SearchPlaceholder = () => (
  <div className="p-6 text-center text-slate-400">
    <h2 className="text-lg font-bold text-slate-200">Pencarian</h2>
    <p className="text-sm mt-1">Cari ribuan ebook gratis dan premium.</p>
  </div>
);

const ProfilePlaceholder = () => (
  <div className="p-6 text-center text-slate-400">
    <h2 className="text-lg font-bold text-slate-200">Profil Saya</h2>
    <p className="text-sm mt-1">Pengaturan akun dan informasi pengguna.</p>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/ebooks" element={<EbookList />} />
        <Route path="/ebooks/:id" element={<EbookDetail />} />
        <Route path="/ebooks/:id/read" element={<EbookRead />} />
        <Route path="/search" element={<SearchPlaceholder />} />
        <Route path="/profile" element={<ProfilePlaceholder />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
