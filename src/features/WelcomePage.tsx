import { useState } from 'react';
import { WelcomeHeader } from './welcome/WelcomeHeader';
import { WelcomeBanner } from './welcome/WelcomeBanner';
import { WelcomeTopEbooks } from './welcome/WelcomeTopEbooks';
import { WelcomeCustomSection } from './welcome/WelcomeCustomSection';

export const WelcomePage = () => {
  const [user] = useState<{ name: string } | null>(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : { name: 'Ahmad' };
    } catch {
      return { name: 'Ahmad' };
    }
  });

  return (
    <div className="min-h-full w-full flex flex-col gap-6 px-5 pb-6 pt-5 text-slate-800 relative bg-white">
      {/* 1. Header (Greeting Name when Logged In) */}
      <WelcomeHeader user={user} />

      {/* 2. Banner Carousel (Auto-slide 5s, Flat, Rounded-LG) */}
      <WelcomeBanner />

      {/* 3. Top Ebooks Section (6 Ebooks, 3 columns x 2 rows, Rounded-LG) */}
      <WelcomeTopEbooks />

      {/* 4. Custom Section (Lanjutkan Membaca & Kategori Populer) */}
      <WelcomeCustomSection />
    </div>
  );
};
