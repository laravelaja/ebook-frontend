import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconBook, IconTrendingUp, IconAward, IconSparkles, IconBell } from '@tabler/icons-react';

const BANNERS = [
  {
    id: 1,
    title: 'Promo Spesial Mei',
    description: 'Akses penuh ke semua Ebook Premium dengan diskon menarik.',
    badge: 'Diskon 50%',
    bgClass: 'bg-sky-600 text-white',
    badgeBgClass: 'bg-white text-sky-700',
    descColor: 'text-sky-100'
  },
  {
    id: 2,
    title: 'Ebook Pilihan Terpopuler',
    description: 'Temukan buku best-seller pengembangan diri teratas minggu ini.',
    badge: 'Rekomendasi',
    bgClass: 'bg-slate-800 text-white',
    badgeBgClass: 'bg-sky-500 text-white',
    descColor: 'text-slate-300'
  },
  {
    id: 3,
    title: 'Koleksi Buku Baru',
    description: 'Jelajahi ide & perspektif baru dari penulis favorit Anda.',
    badge: 'Terbaru',
    bgClass: 'bg-sky-100 text-sky-900 border border-sky-200',
    badgeBgClass: 'bg-sky-600 text-white',
    descColor: 'text-sky-700'
  }
];

const TOP_EBOOKS = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop',
    rating: 4.8,
    views: '12.5k'
  },
  {
    id: 2,
    title: 'Seni Memahami Wanita',
    author: 'Henry Manampiring',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop',
    rating: 4.6,
    views: '8.2k'
  },
  {
    id: 3,
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    views: '15.1k'
  },
  {
    id: 4,
    title: 'Start With Why',
    author: 'Simon Sinek',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop',
    rating: 4.7,
    views: '9.4k'
  },
  {
    id: 5,
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    cover: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=200&auto=format&fit=crop',
    rating: 4.7,
    views: '20.3k'
  },
  {
    id: 6,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    views: '11.8k'
  }
];

export const WelcomePage = () => {
  const [user] = useState<{ name: string } | null>(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : { name: 'Ahmad' };
    } catch {
      return { name: 'Ahmad' };
    }
  });

  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full w-full flex flex-col gap-6 px-5 pb-6 pt-5 text-slate-800 relative bg-white">
      
      {/* 1. Header (Greeting Name when Logged In) */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-extrabold font-display">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none m-0">Selamat Datang Kembali</p>
              <h2 className="text-base font-extrabold text-slate-800 mt-1.5 leading-none m-0">Halo, {user.name}!</h2>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center">
              <IconBook size={20} className="text-white" stroke={2.5} />
            </div>
            <span className="text-lg font-black tracking-tight font-display text-slate-800">
              AuraBook
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
            <IconBell size={18} />
          </button>
          <div className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-100 text-sky-700 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
            <IconSparkles size={10} />
            Beta 1.0
          </div>
        </div>
      </motion.div>

      {/* 2. Banner Carousel (Auto-slide 5s, Flat, Rounded-LG) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-white"
      >
        <div 
          className="flex transition-transform duration-500 ease-out" 
          style={{ transform: `translateX(-${activeBanner * 100}%)` }}
        >
          {BANNERS.map((banner) => (
            <div key={banner.id} className={`w-full shrink-0 p-5 flex flex-col justify-between ${banner.bgClass} min-h-[140px]`}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${banner.badgeBgClass}`}>
                    {banner.badge}
                  </span>
                </div>
                <h3 className="text-base font-black tracking-tight m-0 leading-tight">{banner.title}</h3>
                <p className={`text-xs mt-1.5 leading-relaxed font-normal ${banner.descColor}`}>{banner.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Indicators Dots (Flat) */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveBanner(index)}
              className={`w-2.5 h-1.5 rounded-lg transition-all border-none cursor-pointer ${
                index === activeBanner ? 'bg-sky-600 w-5' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* 3. Top Ebooks Section (6 Ebooks, 3 columns x 2 rows, Rounded-LG) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Ebook Teratas</span>
          <span className="text-xs font-bold text-sky-600 cursor-pointer hover:text-sky-700 transition-colors">Lihat Semua</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {TOP_EBOOKS.map((book) => (
            <div key={book.id} className="flex flex-col gap-1.5 cursor-pointer group">
              <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative animate-none">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-lg bg-sky-600 text-white text-[8px] font-bold">
                  Top {book.id}
                </span>
              </div>
              <div className="flex flex-col">
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 m-0 group-hover:text-sky-600 transition-colors leading-tight">
                  {book.title}
                </h4>
                <p className="text-[10px] text-slate-500 m-0 leading-tight truncate mt-1">
                  {book.author}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-amber-600">
                  <span>⭐</span>
                  <span>{book.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4. Custom Section (Lanjutkan Membaca & Kategori Populer) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex flex-col gap-5"
      >
        {/* Continue Reading Widget */}
        <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=200&auto=format&fit=crop" 
              alt="Filosofi Teras" 
              className="w-11 h-14 object-cover rounded-lg border border-slate-200 shrink-0" 
            />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider">Sedang Dibaca</span>
              <h4 className="text-xs font-extrabold text-slate-800 mt-0.5 line-clamp-1 m-0">Filosofi Teras</h4>
              <p className="text-[10px] text-slate-400 m-0 mt-0.5">Bab 4 • 64% Selesai</p>
              {/* Progress Bar (Flat, No Gradient, Rounded-LG) */}
              <div className="w-28 h-1.5 bg-slate-100 rounded-lg mt-1.5 overflow-hidden">
                <div className="h-full bg-sky-600 rounded-lg" style={{ width: '64%' }}></div>
              </div>
            </div>
          </div>
          <button className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] px-3 py-2 rounded-lg border-none cursor-pointer transition-all shrink-0">
            Lanjut
          </button>
        </div>

        {/* Popular Categories */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Kategori Populer</span>
          <div className="flex flex-wrap gap-1.5">
            {['Pengembangan Diri', 'Bisnis & Finansial', 'Teknologi', 'Fiksi', 'Sastra'].map((category) => (
              <span key={category} className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-sky-50 hover:bg-sky-100 hover:text-sky-800 rounded-lg cursor-pointer transition-colors border border-sky-100/50">
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Quick stat row */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
              <IconTrendingUp size={16} className="text-sky-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Interaktif</span>
              <span className="text-[11px] font-extrabold text-slate-700 leading-none mt-1">Membaca Adaptif</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
              <IconAward size={16} className="text-sky-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Eksklusif</span>
              <span className="text-[11px] font-extrabold text-slate-700 leading-none mt-1">Konten Premium</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
