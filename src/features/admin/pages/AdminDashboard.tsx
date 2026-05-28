import { IconUsers, IconBook, IconPhoto, IconCategory, IconTrendingUp, IconEye } from '@tabler/icons-react';

export const AdminDashboard = () => {
  // Dummy stats
  const stats = [
    { label: 'Total User', value: '1,245', icon: IconUsers, color: 'bg-sky-50 text-sky-600' },
    { label: 'Total Buku', value: '328', icon: IconBook, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Banner Aktif', value: '3', icon: IconPhoto, color: 'bg-amber-50 text-amber-600' },
    { label: 'Kategori', value: '5', icon: IconCategory, color: 'bg-violet-50 text-violet-600' },
    { label: 'Buku Baru (Bulan Ini)', value: '42', icon: IconTrendingUp, color: 'bg-rose-50 text-rose-600' },
    { label: 'Total Views', value: '89.2k', icon: IconEye, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 m-0">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1 m-0">Ringkasan data dan aktivitas platform AuraBook.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 m-0">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 m-0">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-800 m-0 mb-4">Aktivitas Terbaru</h3>
        <div className="flex flex-col gap-3">
          {[
            { text: 'User baru "Budi Santoso" mendaftar', time: '5 menit lalu' },
            { text: 'Buku "Filosofi Hidup" diterbitkan oleh Ahmad', time: '1 jam lalu' },
            { text: 'Banner "Promo Juni" diperbarui', time: '3 jam lalu' },
            { text: 'Kategori "Sejarah" ditambahkan', time: '1 hari lalu' },
            { text: 'User "Siti" melaporkan buku tidak pantas', time: '2 hari lalu' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none">
              <span className="text-xs text-slate-700">{activity.text}</span>
              <span className="text-[10px] text-slate-400 shrink-0 ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
