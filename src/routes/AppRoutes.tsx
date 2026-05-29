import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { WelcomePage } from '../features/WelcomePage';
import { EbookList } from '../features/users/pages/ebook/EbookList';
import { EbookDetail } from '../features/users/pages/ebook/EbookDetail';
import { EbookRead } from '../features/users/pages/ebook/EbookRead';
import { SaveList } from '../features/users/pages/BookMark/SaveList';
import { Login } from '../features/users/auth/Login';
import { Register } from '../features/users/auth/Register';
import { AuthCallback } from '../features/users/auth/AuthCallback';
import { Profile } from '../features/users/pages/profil/Profile';
import { Info } from '../features/users/pages/info/Info';
import { InfoDetail } from '../features/users/pages/info/InfoDetail';
import { CreatorDashboard } from '../features/users/pages/creator/CreatorDashboard';
import { EbookForm } from '../features/users/pages/creator/EbookForm';
import { WriteChapter } from '../features/users/pages/creator/WriteChapter';

// Capacitor & Supabase
import { App } from '@capacitor/app';
import { supabase } from '../api/supabaseClient';
import { Browser } from '@capacitor/browser';

// Admin
import { AdminLayout } from '../features/admin/components/AdminLayout';
import { AdminDashboard } from '../features/admin/pages/AdminDashboard';
import { ManageUsers } from '../features/admin/pages/ManageUsers';
import { ManageBooks } from '../features/admin/pages/ManageBooks';
import { ManageCarousel } from '../features/admin/pages/ManageCarousel';
import { ManageCategories } from '../features/admin/pages/ManageCategories';
import { ManageAnnouncements } from '../features/admin/pages/ManageAnnouncements';
import { ManageFeatured } from '../features/admin/pages/ManageFeatured';

// Route Guard to verify user session
const ProfileGuard = () => {
  const isLoggedIn = !!localStorage.getItem('logged_in_user');
  return isLoggedIn ? <Profile /> : <Navigate to="/login" replace />;
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = !!localStorage.getItem('logged_in_user');
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin Guard - check if user is admin
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('logged_in_user');
  if (!user) return <Navigate to="/login" replace />;
  try {
    const parsed = JSON.parse(user);
    if (parsed.role === 'admin') return <>{children}</>;
  } catch {}
  return <Navigate to="/" replace />;
};

export const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setupDeepLinks = async () => {
      App.addListener('appUrlOpen', async (event: any) => {
        if (event && event.url && event.url.includes('auth/callback')) {
          try {
            const hashIndex = event.url.indexOf('#');
            if (hashIndex !== -1) {
              const hash = event.url.substring(hashIndex);
              const params = new URLSearchParams(hash.substring(1));
              const accessToken = params.get('access_token');
              const refreshToken = params.get('refresh_token');

              if (accessToken && refreshToken) {
                const { error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });
                if (!error) {
                  // Close the custom browser tab/window cleanly
                  try {
                    await Browser.close();
                  } catch (e) {}
                  navigate('/auth/callback', { replace: true });
                }
              }
            }
          } catch (err) {
            console.error('Error handling deep link:', err);
          }
        }
      });
    };

    setupDeepLinks();

    return () => {
      App.removeAllListeners();
    };
  }, [navigate]);

  return (
    <Routes>
      {/* User Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/ebooks" element={<EbookList />} />
        <Route path="/ebooks/:id" element={<EbookDetail />} />
        <Route path="/ebooks/:id/read" element={<EbookRead />} />
        <Route path="/bookmarks" element={<AuthGuard><SaveList /></AuthGuard>} />
        <Route path="/profile" element={<ProfileGuard />} />
        <Route path="/info" element={<Info />} />
        <Route path="/info/:id" element={<InfoDetail />} />
        <Route path="/creator" element={<AuthGuard><CreatorDashboard /></AuthGuard>} />
        <Route path="/creator/new" element={<AuthGuard><EbookForm /></AuthGuard>} />
        <Route path="/creator/edit/:id" element={<AuthGuard><EbookForm /></AuthGuard>} />
        <Route path="/creator/write/:id" element={<AuthGuard><WriteChapter /></AuthGuard>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="books" element={<ManageBooks />} />
        <Route path="carousel" element={<ManageCarousel />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="announcements" element={<ManageAnnouncements />} />
        <Route path="featured" element={<ManageFeatured />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
