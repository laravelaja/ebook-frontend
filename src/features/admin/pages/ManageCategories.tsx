import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IconPlus, IconTrash, IconEdit, IconCheck, IconX, IconGripVertical } from '@tabler/icons-react';
import { categoriesApi } from '../../../api/categories';
import { useCategories } from '../../../hooks/useApiData';

interface Category {
  id: string;
  name: string;
  order: number;
}

export const ManageCategories = () => {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data: categories = [] } = useCategories();

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      alert('Nama kategori tidak boleh kosong!');
      return;
    }
    if (categories.some((c: any) => c.name === newCategory.trim())) {
      alert('Kategori sudah ada!');
      return;
    }
    try {
      await categoriesApi.create(newCategory.trim(), categories.length);
      setNewCategory('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      alert('Gagal menambah kategori');
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditValue(cat.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editValue.trim()) {
      alert('Nama kategori tidak boleh kosong!');
      return;
    }
    if (editId === null) return;
    try {
      await categoriesApi.update(editId, editValue.trim());
      setEditId(null);
      setEditValue('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      alert('Gagal mengupdate kategori');
    }
  };

  const confirmDelete = (cat: Category) => {
    setDeleteTarget(cat);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoriesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      alert('Gagal menghapus kategori');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 m-0">Manajemen Kategori</h1>
          <p className="text-sm text-slate-500 mt-1 m-0">Kelola kategori ebook yang tersedia.</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          {categories.length} kategori
        </span>
      </div>

      {/* Add Category Inline */}
      <div className="flex gap-2 max-w-lg">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nama kategori baru..."
          className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        <button
          onClick={handleAdd}
          className="h-10 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer border-none flex items-center gap-1.5 transition-colors"
        >
          <IconPlus size={14} />
          <span>Tambah</span>
        </button>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-lg">
        {categories.map((cat: any, idx: number) => (
          <div key={cat.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
            <IconGripVertical size={14} className="text-slate-300" />
            {editId === cat.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                autoFocus
                className="flex-1 px-2 py-1 border border-sky-300 rounded text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            ) : (
              <span className="flex-1 text-sm font-semibold text-slate-700">{cat.name}</span>
            )}
            <span className="text-[10px] text-slate-400 font-medium">#{idx + 1}</span>
            <div className="flex items-center gap-1.5">
              {editId === cat.id ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="w-7 h-7 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Simpan"
                  >
                    <IconCheck size={13} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Batal"
                  >
                    <IconX size={13} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(cat)}
                    className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Edit"
                  >
                    <IconEdit size={13} />
                  </button>
                  <button
                    onClick={() => confirmDelete(cat)}
                    className="w-7 h-7 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Hapus"
                  >
                    <IconTrash size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="flex flex-col items-center py-12 text-slate-400">
            <p className="text-sm m-0">Belum ada kategori</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-bold text-slate-800 m-0 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-slate-600 m-0">
              Apakah Anda yakin ingin menghapus kategori <strong>"{deleteTarget.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
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
