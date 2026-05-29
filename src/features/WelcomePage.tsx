import { useState } from 'react';
import { WelcomeHeader } from './welcome/WelcomeHeader';
import { WelcomeBanner } from './welcome/WelcomeBanner';
import { WelcomeTopEbooks } from './welcome/WelcomeTopEbooks';
import { WelcomeCustomSection } from './welcome/WelcomeCustomSection';
import { Skeleton, BannerSkeleton } from '../components/ui/Skeleton';
import { useBanners, useEbooks, useAnnouncements, useFeaturedEbooks } from '../hooks/useApiData';

export const WelcomePage = () => {
  const [user] = useState<{ name: string } | null>(() => {
    const saved = localStorage.getItem('logged_in_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { data: banners = [], isLoading: loadingBanners } = useBanners();
  const { data: featured = [] } = useFeaturedEbooks();
  const { data: allEbooks = [], isLoading: loadingEbooks } = useEbooks();
  const { data: announcements = [], isLoading: loadingAnnouncements } = useAnnouncements();

  // Use featured ebooks if available, otherwise fallback to first 6 from all ebooks
  const topEbooks = featured.length > 0
    ? featured.map((f: any) => f.ebooks).filter(Boolean)
    : allEbooks.slice(0, 6);

  const loading = loadingBanners && loadingEbooks && loadingAnnouncements;

  if (loading) {
    return (
      <div className="min-h-full w-full flex flex-col gap-6 px-5 pb-6 pt-5 bg-white">
        <Skeleton className="h-12 w-48" />
        <BannerSkeleton />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-[148/210] rounded-md" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full flex flex-col gap-6 px-5 pb-6 pt-5 text-slate-800 relative bg-white">
      <WelcomeHeader user={user} />
      <WelcomeBanner banners={banners} />
      <WelcomeTopEbooks ebooks={topEbooks} />
      <WelcomeCustomSection announcements={announcements} />
    </div>
  );
};
