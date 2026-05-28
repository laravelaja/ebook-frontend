import { useState, useEffect, useRef } from 'react';
import { IconPlus, IconTrash, IconEdit, IconPhoto, IconX, IconUpload } from '@tabler/icons-react';
import { getAllBanners, saveBanner, deleteBanner } from '../../../utils/bannerStore';
import type { Banner } from '../../../utils/bannerStore';

export const ManageCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', image: '' });
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBanners(getAllBanners());
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', image: '' });
    setShowModal(true);
  };

  const openEdit = (banner: Banner) => {
    setEditId(banner.id);
    setForm({ title: banner.title, image: banner.image });
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.image.trim()) {
      alert('Judul dan gambar wajib diisi!');
      return;
    }
    if (editId !== null) {
      saveBanner({ id: editId, ...form });
    } else {
      saveBanner(form);
    }
    setBanners(getAllBanners());
    setShowModal(false);
  };

  const confirmDelete = (banner: Banner) => {
    setDeleteTarget(banner);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteBanner(deleteTarget.id);
    setBanners(getAllBanners());
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 m-0">Carousel / Banner</h1>
          <p className="text-sm text-slate-500 mt-1 m-0">Kelola banner promosi yang tampil di halaman utama.</p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer border-none flex items-center gap-1.5 transition-colors"
        >
          <IconPlus size={14} />
          <span>Tambah Banner</span>
        </button>
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
            <div className="relative aspect-[16/7] bg-slate-100">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEdit(banner)}
                  className="w-8 h-8 rounded-lg bg-white/90 text-slate-700 flex items-center justify-center cursor-pointer border-none hover:bg-white transition-colors"
                  title="Edit"
                >
                  <IconEdit size={14} />
                </button>
                <button
                  onClick={() => confirmDelete(banner)}
                  className="w-8 h-8 rounded-lg bg-white/90 text-rose-600 flex items-center justify-center cursor-pointer border-none hover:bg-white transition-colors"
                  title="Hapus"
                >
                  <IconTrash size={14} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-slate-800 m-0">{banner.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 m-0">ID: {banner.id} • Aktif</p>
            </div>
          </div>
        ))}

        {/* Add new placeholder */}
        <div
          onClick={openAdd}
          className="bg-white rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center py-12 cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-all"
        >
          <IconPhoto size={28} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 mt-2">Tambah Banner Baru</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 m-0">
                {editId !== null ? 'Edit Banner' : 'Tambah Banner'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent">
                <IconX size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Judul</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="Judul banner"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Gambar Banner</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-sky-400 hover:bg-sky-50/30 cursor-pointer bg-white flex items-center gap-2 transition-colors"
                >
                  <IconUpload size={14} />
                  <span>{form.image ? 'Ganti gambar...' : 'Pilih gambar dari perangkat...'}</span>
                </button>
                {form.image && (
                  <div className="mt-2">
                    <img src={form.image} alt="preview" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer border-none transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer border-none transition-colors"
              >
                {editId !== null ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-bold text-slate-800 m-0 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-slate-600 m-0">
              Apakah Anda yakin ingin menghapus banner <strong>"{deleteTarget.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer border-none transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer border-none transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
