import { useState, useEffect } from 'react';
import { IconStar, IconPlus, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { featuredApi } from '../../../api/featured';
import { ebooksApi } from '../../../api/ebooks';

interface Ebook {
  id: string;
  title: string;
  cover_url?: string;
  author_id?: string;
}

interface FeaturedItem {
  id: string;
  ebook_id: string;
  position: number;
  ebooks: Ebook;
}

export const ManageFeatured = () => {
  const queryClient = useQueryClient();
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const [allBooks, setAllBooks] = useState<Ebook[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [featuredData, booksData] = await Promise.all([
        featuredApi.getAll(),
        ebooksApi.getAll(),
      ]);
      setFeatured(featuredData || []);
      setAllBooks(booksData || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Books not yet in featured list
  const availableBooks = allBooks.filter(
    (book) => !featured.some((f) => f.ebook_id === book.id)
  );

  const addToFeatured = async (book: Ebook) => {
    if (featured.length >= 6) {
      alert('Maksimal 6 buku untuk Ebook Teratas.');
      return;
    }
    const newPosition = featured.length + 1;
    const newItems = [...featured.map((f) => ({ ebook_id: f.ebook_id, position: f.position })), { ebook_id: book.id, position: newPosition }];
    
    setSaving(true);
    try {
      await featuredApi.set(newItems);
      await loadData();
      queryClient.invalidateQueries({ queryKey: ['featured'] });
      setShowPicker(false);
    } catch (err) {
      alert('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const removeFromFeatured = async (ebookId: string) => {
    const remaining = featured
      .filter((f) => f.ebook_id !== ebookId)
      .map((f, idx) => ({ ebook_id: f.ebook_id, position: idx + 1 }));
    
    setSaving(true);
    try {
      await featuredApi.set(remaining);
      await loadData();
      queryClient.invalidateQueries({ queryKey: ['featured'] });
    } catch (err) {
      alert('Gagal menghapus');
    } finally {
      setSaving(false);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...featured];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    const newItems = items.map((f, idx) => ({ ebook_id: f.ebook_id, position: idx + 1 }));
    
    setSaving(true);
    try {
      await featuredApi.set(newItems);
      await loadData();
      queryClient.invalidateQueries({ queryKey: ['featured'] });
    } catch (err) {
      alert('Gagal mengubah urutan');
    } finally {
      setSaving(false);
    }
  };

  const moveDown = async (index: number) => {
    if (index === featured.length - 1) return;
    const items = [...featured];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    const newItems = items.map((f, idx) => ({ ebook_id: f.ebook_id, position: idx + 1 }));
    
    setSaving(true);
    try {
      await featuredApi.set(newItems);
      await loadData();
      queryClient.invalidateQueries({ queryKey: ['featured'] });
    } catch (err) {
      alert('Gagal mengubah urutan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 m-0">Ebook Teratas</h1>
          <p className="text-sm text-slate-500 mt-1 m-0">Pilih dan atur urutan 6 buku yang tampil di halaman utama.</p>
        </div>
        <button
          onClick={() => setShowPicker(true)}
          disabled={featured.length >= 6}
          className="h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer border-none flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <IconPlus size={14} />
          <span>Tambah Buku ({featured.length}/6)</span>
        </button>
      </div>

      {/* Featured List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {featured.length > 0 ? (
          featured.map((item, idx) => (
            <div key={item.ebook_id} className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
              {/* Position */}
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center text-sm font-black shrink-0 border border-sky-100">
                {idx + 1}
              </div>

              {/* Cover */}
              <img
                src={item.ebooks?.cover_url || ''}
                alt={item.ebooks?.title || ''}
                className="w-10 h-14 object-cover rounded-md border border-slate-200 shrink-0 bg-slate-100"
              />

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 m-0 truncate">{item.ebooks?.title || 'Buku tidak ditemukan'}</h4>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0 || saving}
                  className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer border-none transition-colors disabled:opacity-30 disabled:pointer-events-none text-xs font-bold"
                  title="Naik"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === featured.length - 1 || saving}
                  className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer border-none transition-colors disabled:opacity-30 disabled:pointer-events-none text-xs font-bold"
                  title="Turun"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeFromFeatured(item.ebook_id)}
                  disabled={saving}
                  className="w-7 h-7 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer border-none transition-colors disabled:opacity-50"
                  title="Hapus"
                >
                  <IconTrash size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-12 text-slate-400">
            <IconStar size={32} className="text-slate-300 mb-2" />
            <p className="text-sm m-0 font-medium">Belum ada buku yang dipilih</p>
            <p className="text-xs text-slate-400 mt-1 m-0">Tambahkan buku untuk ditampilkan di halaman utama.</p>
          </div>
        )}
      </div>

      {/* Book Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-base font-bold text-slate-800 m-0">Pilih Buku</h3>
              <button onClick={() => setShowPicker(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {availableBooks.length > 0 ? (
                availableBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => addToFeatured(book)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 cursor-pointer transition-all"
                  >
                    <img
                      src={book.cover_url || ''}
                      alt={book.title}
                      className="w-8 h-11 object-cover rounded border border-slate-200 shrink-0 bg-slate-100"
                    />
                    <span className="text-sm font-semibold text-slate-700 truncate">{book.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-8 m-0">Semua buku sudah ditambahkan.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
