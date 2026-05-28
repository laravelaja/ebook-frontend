import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconMail, IconLock, IconArrowLeft } from '@tabler/icons-react';
import { authApi } from '../../../api/auth';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold"
                />
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

          {/* Quick Login Assist Info */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center flex flex-col gap-1">
            <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
              User: user@example.com / password123
            </span>
            <span className="text-[9px] font-extrabold uppercase text-sky-500 tracking-wider">
              Admin: admin@aurabook.com / admin123
            </span>
          </div>
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
