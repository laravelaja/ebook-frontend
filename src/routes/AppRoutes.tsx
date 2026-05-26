import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { WelcomePage } from '../features/WelcomePage';
import { EbookList } from '../features/users/pages/ebook/EbookList';
import { EbookDetail } from '../features/users/pages/ebook/EbookDetail';
import { EbookRead } from '../features/users/pages/ebook/EbookRead';
import { SaveList } from '../features/users/pages/BookMark/SaveList';
import { Login } from '../features/users/auth/Login';
import { Register } from '../features/users/auth/Register';
import { Profile } from '../features/users/pages/profil/Profile';
import { Info } from '../features/users/pages/info/Info';
import { InfoDetail } from '../features/users/pages/info/InfoDetail';

// Route Guard to verify user session
const ProfileGuard = () => {
  const isLoggedIn = !!localStorage.getItem('logged_in_user');
  return isLoggedIn ? <Profile /> : <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/ebooks" element={<EbookList />} />
        <Route path="/ebooks/:id" element={<EbookDetail />} />
        <Route path="/ebooks/:id/read" element={<EbookRead />} />
        <Route path="/bookmarks" element={<SaveList />} />
        <Route path="/profile" element={<ProfileGuard />} />
        <Route path="/info" element={<Info />} />
        <Route path="/info/:id" element={<InfoDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
