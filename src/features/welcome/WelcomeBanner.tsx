import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface WelcomeBannerProps {
  banners: any[];
}

export const WelcomeBanner = ({ banners }: WelcomeBannerProps) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-md shadow-sm bg-white" ref={emblaRef}>
      <div className="flex touch-pan-y">
        {banners.map((banner) => (
          <div className="flex-[0_0_100%] min-w-0" key={banner.id}>
            <div className="h-40 w-full overflow-hidden">
              <img 
                src={banner.image_url || banner.image} 
                alt={banner.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
