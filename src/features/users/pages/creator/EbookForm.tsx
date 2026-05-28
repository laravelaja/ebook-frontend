import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconArrowLeft, IconBook, IconCamera, IconPhoto, IconTrash } from '@tabler/icons-react';
import { CATEGORIES } from '../../../../data/EbookDummy';
import { getEbookById, saveEbook } from '../../../../utils/ebookStore';

export const EbookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [cover, setCover] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1] || 'Pengembangan Diri');
  const [author, setAuthor] = useState('');

  // Fetch data if editing
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    let currentUserName = 'Ahmad';
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) currentUserName = parsed.name;
      } catch {}
    }
    setAuthor(currentUserName);

    if (isEdit) {
      const book = getEbookById(Number(id));
      if (book) {
        setTitle(book.title);
        setSynopsis(book.synopsis || '');
        setCover(book.cover);
        setCategory(book.category);
      } else {
        navigate('/creator');
      }
    }
  }, [id, isEdit, navigate]);

  // Handle cover image upload from device
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, GIF, dll).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCover(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveCover = () => {
    setCover('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul Ebook tidak boleh kosong.');
      return;
    }

    const payload = {
      title,
      synopsis,
      cover: cover.trim() || undefined,
      category,
      author,
      ...(isEdit ? { id: Number(id) } : {}),
    };

    const saved = saveEbook(payload);
    
    if (isEdit) {
      navigate('/creator');
    } else {
      navigate(`/creator/write/${saved.id}`);
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col bg-white">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 px-5 lg:px-8 py-4 border-b border-slate-200 shrink-0"
      >
        <button
          onClick={() => navigate('/creator')}
          className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer border-none transition-colors"
        >
          <IconArrowLeft size={18} />
        </button>
        <div className="flex flex-col">
          <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest leading-none">
            {isEdit ? 'Ubah Informasi' : 'Buat Karya Baru'}
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 mt-0.5 m-0">
            {isEdit ? 'Edit Info Ebook' : 'Identitas Ebook'}
          </h2>
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-5 lg:px-8 py-5 flex flex-col gap-5"
      >
        {/* Cover Upload */}
        <div className="flex items-start gap-4">
          {/* Cover Preview */}
          {cover ? (
            <div className="relative group shrink-0">
              <img
                src={cover}
                alt="Cover"
                className="w-24 h-34 object-cover rounded-lg border border-slate-200 bg-slate-50"
              />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center cursor-pointer border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconTrash size={10} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-34 shrink-0 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-sky-400 hover:text-sky-500 transition-all"
            >
              <IconCamera size={22} />
              <span className="text-[8px] font-bold uppercase mt-1">Cover</span>
            </div>
          )}

          {/* Upload info & button */}
          <div className="flex-1 flex flex-col gap-2 pt-1">
            <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
              Format: JPG, PNG, GIF. Maks 5MB. Rasio 7:10.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="self-start h-8 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer border-none flex items-center gap-1.5 transition-colors"
            >
              <IconPhoto size={13} />
              <span>{cover ? 'Ganti' : 'Pilih Gambar'}</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Judul Ebook</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Merakit Masa Depan"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm font-semibold text-slate-700 bg-white placeholder-slate-300"
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm font-semibold text-slate-700 bg-white cursor-pointer"
          >
            {CATEGORIES.filter((c) => c !== 'Semua').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Synopsis */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sinopsis</label>
          <textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            placeholder="Tulis ringkasan isi buku secara menarik..."
            rows={4}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm text-slate-700 bg-white placeholder-slate-300 resize-none leading-relaxed"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-11 mt-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl cursor-pointer border-none flex items-center justify-center gap-2 transition-colors"
        >
          <IconBook size={16} />
          <span>{isEdit ? 'Simpan Perubahan' : 'Mulai Tulis Isi'}</span>
        </button>
      </motion.form>
    </div>
  );
};
