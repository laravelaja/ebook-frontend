import { IconUsers, IconBook, IconPhoto, IconCategory } from '@tabler/icons-react';
import { useUsers, useEbooks, useBanners, useCategories } from '../../../hooks/useApiData';

export const AdminDashboard = () => {
  const { data: users = [], isLoading: loadingUsers } = useUsers();
  const { data: books = [], isLoading: loadingBooks } = useEbooks();
  const { data: banners = [], isLoading: loadingBanners } = useBanners();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const loading = loadingUsers || loadingBooks || loadingBanners || loadingCategories;

  const statCards = [
    { label: 'Total User', value: users.length, icon: IconUsers, color: 'bg-sky-50 text-sky-600' },
    { label: 'Total Buku', value: books.length, icon: IconBook, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Banner Aktif', value: banners.length, icon: IconPhoto, color: 'bg-amber-50 text-amber-600' },
    { label: 'Kategori', value: categories.length, icon: IconCategory, color: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 m-0">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1 m-0">Ringkasan data platform AuraBook.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 m-0">
                  {loading ? '...' : stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 m-0">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
