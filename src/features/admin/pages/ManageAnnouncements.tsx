import { useState, useEffect, useRef } from 'react';
import { IconPlus, IconTrash, IconEdit, IconSpeakerphone, IconX, IconUpload } from '@tabler/icons-react';
import { getAllAnnouncements, saveAnnouncement, deleteAnnouncement } from '../../../utils/announcementStore';
import type { Announcement } from '../../../utils/announcementStore';

export const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [form, setForm] = useState<Omit<Announcement, 'id'>>({
    title: '', excerpt: '', content: '', date: '', image: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnnouncements(getAllAnnouncements());
  }, []);

  const openAdd = () => {
    setEditId(null);
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    setForm({ title: '', excerpt: '', content: '', date: today, image: '' });
    setShowModal(true);
  };

  const openEdit = (item: Announcement) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      date: item.date,
      image: item.image,
    });
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
    if (!form.title.trim() || !form.excerpt.trim()) {
      alert('Judul dan ringkasan wajib diisi!');
      return;
    }
    if (editId !== null) {
      saveAnnouncement({ id: editId, ...form });
    } else {
      saveAnnouncement(form);
    }
    setAnnouncements(getAllAnnouncements());
    setShowModal(false);
  };

  const confirmDelete = (item: Announcement) => {
    setDeleteTarget(item);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAnnouncement(deleteTarget.id);
    setAnnouncements(getAllAnnouncements());
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 m-0">Manajemen Pengumuman</h1>
          <p className="text-sm text-slate-500 mt-1 m-0">Kelola pengumuman dan info yang tampil untuk pengguna.</p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer border-none flex items-center gap-1.5 transition-colors"
        >
          <IconPlus size={14} />
          <span>Tambah Pengumuman</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="flex flex-col gap-4">
        {announcements.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 rounded-lg object-cover shrink-0 border border-slate-200"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 m-0 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 m-0 line-clamp-2">{item.excerpt}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Edit"
                  >
                    <IconEdit size={13} />
                  </button>
                  <button
                    onClick={() => confirmDelete(item)}
                    className="w-7 h-7 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Hapus"
                  >
                    <IconTrash size={13} />
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-2 block">{item.date}</span>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center py-12 text-slate-400">
            <IconSpeakerphone size={32} className="text-slate-300 mb-2" />
            <p className="text-sm m-0">Belum ada pengumuman</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 m-0">
                {editId !== null ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
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
                  placeholder="Judul pengumuman"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Ringkasan</label>
                <input
                  type="text"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="Ringkasan singkat"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Konten</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
                  rows={4}
                  placeholder="Isi lengkap pengumuman"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Tanggal</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="25 Mei 2026"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Gambar</label>
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
              Apakah Anda yakin ingin menghapus pengumuman <strong>"{deleteTarget.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
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
