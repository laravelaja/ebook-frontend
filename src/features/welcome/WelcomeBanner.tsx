import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WelcomeBannerProps {
  banners: any[];
}

export const WelcomeBanner = ({ banners }: WelcomeBannerProps) => {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="relative w-full overflow-hidden rounded-md border border-slate-200 bg-white"
    >
      <div 
        className="flex transition-transform duration-500 ease-out" 
        style={{ transform: `translateX(-${activeBanner * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full shrink-0 aspect-[21/9] min-h-[140px] relative overflow-hidden bg-slate-100">
            <img 
              src={banner.image_url || banner.image} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      {/* Indicators Dots (Flat) */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveBanner(index)}
            className={`w-2.5 h-1.5 rounded-md transition-all border-none cursor-pointer ${
              index === activeBanner ? 'bg-sky-600 w-5' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};
