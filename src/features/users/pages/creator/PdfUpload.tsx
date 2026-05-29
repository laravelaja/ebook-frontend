import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  IconArrowLeft, IconUpload, IconFileTypePdf, 
  IconLoader2, IconCheck, IconX, IconBook
} from '@tabler/icons-react';
import { ebooksApi } from '../../../../api/ebooks';
import { uploadApi } from '../../../../api/upload';
import { useCategories } from '../../../../hooks/useApiData';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker - use CDN for compatibility with Capacitor/Android WebView
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs`;

interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'parsing' | 'rendering' | 'uploading' | 'saving' | 'done' | 'error';
  message: string;
}

export const PdfUpload = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [synopsis, setSynopsis] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [progress, setProgress] = useState<UploadProgress>({
    current: 0, total: 0, status: 'idle', message: ''
  });

  const { data: categoriesData = [] } = useCategories();
  const categories = categoriesData.map((c: any) => c.name || c);

  // Handle PDF file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('File harus berupa PDF.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('Ukuran file maksimal 50MB.');
      return;
    }

    setPdfFile(file);
    
    // Auto-fill title from filename
    if (!title) {
      const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
      setTitle(nameWithoutExt);
    }

    // Parse PDF to get page count and first page preview
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfPageCount(pdf.numPages);

      // Render first page as preview
      const page = await pdf.getPage(1);
      const scale = 0.5;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      setPreviewUrl(canvas.toDataURL('image/webp', 0.8));
    } catch (err) {
      console.error('Error parsing PDF:', err);
      alert('Gagal membaca file PDF. Pastikan file tidak rusak atau terproteksi.');
      setPdfFile(null);
    }
  };

  // Render a single PDF page to a Blob
  const renderPageToBlob = async (
    pdf: pdfjsLib.PDFDocumentProxy, 
    pageNum: number,
    scale: number = 2.0
  ): Promise<Blob> => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    await page.render({ canvasContext: ctx, viewport }).promise;
    
    return new Promise((resolve, reject) => {
      // Try WebP first, fallback to PNG for older WebViews
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Fallback to PNG
            canvas.toBlob(
              (pngBlob) => pngBlob ? resolve(pngBlob) : reject(new Error('Failed to create blob')),
              'image/png'
            );
          }
        },
        'image/webp',
        0.85
      );
    });
  };

  // Main upload handler
  const handleUpload = useCallback(async () => {
    if (!pdfFile || !title.trim()) {
      alert('Judul dan file PDF wajib diisi.');
      return;
    }

    try {
      // Step 1: Parse PDF
      setProgress({ current: 0, total: pdfPageCount, status: 'parsing', message: 'Membaca file PDF...' });
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      // Step 2: Create ebook record first
      setProgress({ current: 0, total: totalPages, status: 'saving', message: 'Membuat ebook...' });
      const ebook = await ebooksApi.create({
        title: title.trim(),
        category: selectedCategories.join(','),
        synopsis: synopsis.trim(),
        source_type: 'pdf',
      });

      // Step 3: Render each page and upload
      setProgress({ current: 0, total: totalPages, status: 'rendering', message: 'Memproses halaman...' });

      for (let i = 1; i <= totalPages; i++) {
        setProgress({ 
          current: i, 
          total: totalPages, 
          status: 'uploading', 
          message: `Mengupload halaman ${i} dari ${totalPages}...` 
        });

        // Render page to image blob
        const blob = await renderPageToBlob(pdf, i);
        const file = new File([blob], `page-${i}.webp`, { type: 'image/webp' });

        // Upload image to storage
        const imageUrl = await uploadApi.uploadImage(file);

        // Save page with image URL as content
        await ebooksApi.savePage(ebook.id, {
          order: i,
          chapter: `Halaman ${i}`,
          content: `<img src="${imageUrl}" alt="Halaman ${i}" class="pdf-page-image" />`,
          vertical_align: 'top',
          show_chapter_title: false,
          show_page_number: false,
          is_pdf_page: true,
        });
      }

      // Step 4: Update ebook with cover from first page
      if (previewUrl) {
        // Upload first page as cover
        try {
          const coverBlob = await renderPageToBlob(pdf, 1, 1.0);
          const coverFile = new File([coverBlob], 'cover.webp', { type: 'image/webp' });
          const coverUrl = await uploadApi.uploadImage(coverFile);
          await ebooksApi.update(ebook.id, { cover_url: coverUrl });
        } catch (err) {
          console.error('Error uploading cover:', err);
        }
      }

      setProgress({ current: totalPages, total: totalPages, status: 'done', message: 'Selesai!' });
      
      // Invalidate caches
      queryClient.invalidateQueries({ queryKey: ['myBooks'] });
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });

      // Navigate to the created ebook after a short delay
      setTimeout(() => {
        navigate(`/ebooks/${ebook.id}`);
      }, 1500);

    } catch (err: any) {
      console.error('Error uploading PDF:', err);
      setProgress({ 
        current: 0, total: 0, status: 'error', 
        message: err?.response?.data?.message || 'Gagal mengupload PDF. Silakan coba lagi.' 
      });
    }
  }, [pdfFile, title, selectedCategories, synopsis, pdfPageCount, previewUrl, navigate, queryClient]);

  const isProcessing = progress.status !== 'idle' && progress.status !== 'done' && progress.status !== 'error';

  return (
    <div className="min-h-full w-full flex flex-col bg-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
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
          disabled={isProcessing}
          className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer border-none transition-colors disabled:opacity-50"
        >
          <IconArrowLeft size={18} />
        </button>
        <div className="flex flex-col">
          <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest leading-none">Upload PDF</span>
          <h2 className="text-sm font-extrabold text-slate-800 mt-0.5 m-0">Konversi PDF ke Ebook</h2>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex-1 overflow-y-auto px-5 lg:px-8 py-5 flex flex-col gap-5"
      >
        {/* PDF File Picker */}
        <div>
          <label className="text-xs font-bold text-slate-600 mb-2 block">File PDF</label>
          {pdfFile ? (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <IconFileTypePdf size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-700 truncate m-0">{pdfFile.name}</p>
                <p className="text-[10px] text-slate-400 m-0 mt-0.5">
                  {(pdfFile.size / (1024 * 1024)).toFixed(1)} MB • {pdfPageCount} halaman
                </p>
              </div>
              {!isProcessing && (
                <button
                  onClick={() => { setPdfFile(null); setPdfPageCount(0); setPreviewUrl(''); }}
                  className="w-7 h-7 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center cursor-pointer border-none hover:bg-rose-200 transition-colors"
                >
                  <IconX size={14} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all bg-transparent"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <IconUpload size={22} className="text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-600">Pilih File PDF</span>
              <span className="text-[10px] text-slate-400">Maksimal 50MB</span>
            </button>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <div>
            <label className="text-xs font-bold text-slate-600 mb-2 block">Preview Halaman Pertama</label>
            <div className="w-32 aspect-[7/10] rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="text-xs font-bold text-slate-600 mb-2 block">Judul Ebook *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul ebook"
            disabled={isProcessing}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all disabled:opacity-50"
          />
        </div>

        {/* Category - Multi Select Chips */}
        <div>
          <label className="text-xs font-bold text-slate-600 mb-2 block">
            Kategori {selectedCategories.length > 0 && <span className="text-sky-600">({selectedCategories.length} dipilih)</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: string) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedCategories(selectedCategories.filter(c => c !== cat));
                    } else {
                      setSelectedCategories([...selectedCategories, cat]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all disabled:opacity-50 ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Synopsis */}
        <div>
          <label className="text-xs font-bold text-slate-600 mb-2 block">Sinopsis (opsional)</label>
          <textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            placeholder="Deskripsi singkat tentang ebook ini..."
            rows={3}
            disabled={isProcessing}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all resize-none disabled:opacity-50"
          />
        </div>

        {/* Progress */}
        {progress.status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${
              progress.status === 'error' 
                ? 'bg-rose-50 border-rose-200' 
                : progress.status === 'done'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-sky-50 border-sky-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {progress.status === 'error' ? (
                <IconX size={18} className="text-rose-500" />
              ) : progress.status === 'done' ? (
                <IconCheck size={18} className="text-emerald-500" />
              ) : (
                <IconLoader2 size={18} className="text-sky-500 animate-spin" />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700 m-0">{progress.message}</p>
                {progress.total > 0 && progress.status !== 'done' && progress.status !== 'error' && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 transition-all duration-300 rounded-full"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 m-0">
                      {progress.current} / {progress.total} halaman
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!pdfFile || !title.trim() || isProcessing}
          className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl cursor-pointer border-none flex items-center justify-center gap-2 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isProcessing ? (
            <>
              <IconLoader2 size={16} className="animate-spin" />
              <span>Memproses...</span>
            </>
          ) : progress.status === 'done' ? (
            <>
              <IconCheck size={16} />
              <span>Berhasil! Mengarahkan...</span>
            </>
          ) : (
            <>
              <IconBook size={16} />
              <span>Konversi ke Ebook</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};
