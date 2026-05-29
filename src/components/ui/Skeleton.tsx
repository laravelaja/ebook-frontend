export const Skeleton = ({ className = '' }: { className?: string }) => {
  return <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />;
};

export const CardSkeleton = () => (
  <div className="flex gap-3 p-3 bg-white rounded-md border border-slate-200">
    <Skeleton className="w-14 h-20 shrink-0" />
    <div className="flex-1 flex flex-col gap-2 py-1">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-2.5 w-1/2" />
      <Skeleton className="h-2 w-1/4 mt-auto" />
    </div>
  </div>
);

export const BannerSkeleton = () => (
  <Skeleton className="w-full h-40 rounded-2xl" />
);
