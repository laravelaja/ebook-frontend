import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IconSearch, IconTrash, IconEdit, IconUserPlus, IconX, IconUpload } from '@tabler/icons-react';
import { usersApi } from '../../../api/users';
import { uploadApi } from '../../../api/upload';
import { useUsers } from '../../../hooks/useApiData';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'creator' | 'admin';
  bio: string;
  avatar: string;
}

export const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<User, 'id'> & { password: string }>({
    name: '', email: '', password: '', role: 'user', bio: '', avatar: ''
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: users = [] } = useUsers();

  const filteredUsers = users.filter((u: any) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'creator': return 'bg-sky-50 text-sky-700 border-sky-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', email: '', password: '', role: 'user', bio: '', avatar: '' });
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEdit = (user: any) => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, bio: user.bio || '', avatar: user.avatar_url || '' });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert('Nama dan email wajib diisi!');
      return;
    }
    try {
      setUploading(true);
      let avatarUrl = form.avatar;

      if (selectedFile) {
        avatarUrl = await uploadApi.uploadImage(selectedFile);
      }

      if (editId !== null) {
        const body: any = { name: form.name, email: form.email, role: form.role, bio: form.bio, avatar_url: avatarUrl };
        if (form.password.trim()) {
          body.password_hash = form.password;
        }
        await usersApi.update(editId, body);
      } else {
        if (!form.password.trim()) {
          alert('Password wajib diisi untuk user baru!');
          setUploading(false);
          return;
        }
        await usersApi.create({ name: form.name, email: form.email, password_hash: form.password, role: form.role });
      }
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      alert('Gagal menyimpan user');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (user: any) => {
    setShowDeleteConfirm(user.id);
  };

  const handleDelete = async () => {
    if (showDeleteConfirm === null) return;
    try {
      await usersApi.delete(showDeleteConfirm);
      setShowDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      alert('Gagal menghapus user');
    }
  };

  const getDeleteUserName = () => {
    const user = users.find((u: any) => u.id === showDeleteConfirm);
    return user?.name || '';
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 m-0">Manajemen User</h1>
          <p className="text-sm text-slate-500 mt-1 m-0">Kelola semua pengguna platform.</p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer border-none flex items-center gap-1.5 transition-colors"
        >
          <IconUserPlus size={14} />
          <span>Tambah User</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
        >
          <option value="all">Semua Role</option>
          <option value="user">User</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avatar</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nama</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bio</th>
              <th className="text-right px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-slate-800">{user.name}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{user.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-500 max-w-[150px] truncate">{user.bio || '-'}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(user)}
                      className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                      title="Edit"
                    >
                      <IconEdit size={13} />
                    </button>
                    <button
                      onClick={() => confirmDelete(user)}
                      className="w-7 h-7 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                      title="Hapus"
                    >
                      <IconTrash size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center py-12 text-slate-400">
            <IconUserPlus size={32} className="text-slate-300 mb-2" />
            <p className="text-sm m-0">Tidak ada user ditemukan</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 m-0">
                {editId !== null ? 'Edit User' : 'Tambah User'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent">
                <IconX size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="email@contoh.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder={editId !== null ? 'Kosongkan jika tidak diubah' : 'Password'}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white"
                >
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
                  rows={2}
                  placeholder="Bio singkat (opsional)"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Avatar</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-sky-400 hover:bg-sky-50/30 cursor-pointer bg-white flex items-center gap-2 transition-colors"
                >
                  <IconUpload size={14} />
                  <span>{form.avatar ? 'Ganti gambar...' : 'Pilih gambar dari perangkat...'}</span>
                </button>
                {form.avatar && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={form.avatar} alt="preview" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, avatar: '' })}
                      className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer border-none bg-transparent"
                    >
                      Hapus
                    </button>
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
                disabled={uploading}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer border-none transition-colors disabled:opacity-50"
              >
                {uploading ? 'Menyimpan...' : editId !== null ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-bold text-slate-800 m-0 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-slate-600 m-0">
              Apakah Anda yakin ingin menghapus user <strong>"{getDeleteUserName()}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowDeleteConfirm(null)}
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
