import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconMail, IconLock, IconArrowLeft, IconEye, IconEyeOff } from '@tabler/icons-react';
import { authApi } from '../../../api/auth';
import { supabase } from '../../../api/supabaseClient';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('logged_in_user', JSON.stringify(response.user));

      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const isNative = Capacitor.isNativePlatform();
      const redirectUrl = isNative 
        ? 'com.aurabook.app://auth/callback' 
        : window.location.origin + '/auth/callback';

      if (isNative) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        if (data?.url) {
          await Browser.open({ url: data.url, windowName: '_self' });
        }
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
          },
        });
        if (error) throw error;
      }
    } catch (err) {
      setError('Gagal login dengan Google');
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col bg-slate-50 text-slate-800 px-5 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-md bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
        >
          <IconArrowLeft size={18} />
        </button>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Kembali ke Beranda</span>
      </div>

      {/* Login Card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col justify-center mt-8"
      >
        <div className="bg-white border border-slate-200/80 rounded-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight m-0">Selamat Datang Kembali</h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Masuk untuk mengakses perpustakaan dan melihat profil bacaan Anda.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-md">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Alamat Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <IconMail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Kata Sandi</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <IconLock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer flex items-center justify-center p-0"
                >
                  {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-2 py-3 bg-sky-600 text-white text-xs font-extrabold rounded-md cursor-pointer hover:bg-sky-700 transition-colors border-none"
            >
              Masuk Akun
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] text-slate-400 font-semibold">atau</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-3 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-md cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          {/* Quick Login Assist Info */}
        </div>

        {/* Redirect Option */}
        <div className="text-center mt-6">
          <span className="text-xs text-slate-400 font-semibold">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-sky-600 hover:text-sky-700 font-black decoration-none">
              Daftar Sekarang
            </Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
