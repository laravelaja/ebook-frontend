import { useState, useEffect } from 'react';
import { IconSearch, IconTrash, IconEye, IconBook, IconX } from '@tabler/icons-react';
import { getAllEbooks, deleteEbook } from '../../../utils/ebookStore';
import type { Ebook } from '../../../data/EbookDummy';

export const ManageBooks = () => {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState<Ebook[]>([]);
  const [viewBook, setViewBook] = useState<Ebook | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ebook | null>(null);

  useEffect(() => {
    setBooks(getAllEbooks());
  }, []);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteEbook(deleteTarget.id);
    setBooks(getAllEbooks());
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 m-0">Manajemen Buku</h1>
          <p className="text-sm text-slate-500 mt-1 m-0">
            Kelola semua ebook yang ada di platform.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          {books.length} buku
        </span>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul atau penulis..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cover</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Judul</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Penulis</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rating</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Views</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Halaman</th>
              <th className="text-right px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  <img src={book.cover} alt={book.title} className="w-8 h-11 object-cover rounded border border-slate-200" />
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-slate-800 max-w-[200px] truncate">{book.title}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{book.author}</td>
                <td className="px-5 py-3">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{book.category}</span>
                </td>
                <td className="px-5 py-3 text-sm text-slate-600">⭐ {book.rating}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{book.views}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{book.pages?.length || 0}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setViewBook(book)}
                      className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer border-none transition-colors"
                      title="Lihat"
                    >
                      <IconEye size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(book)}
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
        {filteredBooks.length === 0 && (
          <div className="flex flex-col items-center py-12 text-slate-400">
            <IconBook size={32} className="text-slate-300 mb-2" />
            <p className="text-sm m-0">Tidak ada buku ditemukan</p>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {viewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 m-0">Detail Buku</h3>
              <button onClick={() => setViewBook(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent">
                <IconX size={18} />
              </button>
            </div>
            <div className="flex gap-4">
              <img src={viewBook.cover} alt={viewBook.title} className="w-24 h-36 object-cover rounded-lg border border-slate-200 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 m-0">{viewBook.title}</h4>
                <p className="text-xs text-slate-500 mt-1 m-0">oleh {viewBook.author}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{viewBook.category}</span>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">⭐ {viewBook.rating}</span>
                  <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded">{viewBook.views} views</span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{viewBook.pages?.length || 0} halaman</span>
                </div>
              </div>
            </div>
            {viewBook.synopsis && (
              <div className="mt-4">
                <h5 className="text-xs font-bold text-slate-600 mb-1">Sinopsis</h5>
                <p className="text-sm text-slate-600 m-0 leading-relaxed">{viewBook.synopsis}</p>
              </div>
            )}
            {viewBook.pages && viewBook.pages.length > 0 && (
              <div className="mt-4">
                <h5 className="text-xs font-bold text-slate-600 mb-2">Daftar Chapter</h5>
                <div className="flex flex-col gap-1">
                  {viewBook.pages.map((page, idx) => (
                    <div key={idx} className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded">
                      {page.chapter || `Halaman ${idx + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setViewBook(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer border-none transition-colors"
              >
                Tutup
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
              Apakah Anda yakin ingin menghapus buku <strong>"{deleteTarget.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
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
