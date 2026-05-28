import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  IconArrowLeft, IconPlus, 
  IconTrash, IconDeviceFloppy, IconEye, IconPencil, IconBook,
  IconFileText, IconLayoutSidebar, IconSettings,
  IconLayoutAlignTop, IconLayoutAlignMiddle, IconLayoutAlignBottom
} from '@tabler/icons-react';
import { getEbookById, saveEbook } from '../../../../utils/ebookStore';
import type { Ebook, EbookPage } from '../../../../data/EbookDummy';
import { RichTextEditor } from './components/RichTextEditor';

export const WriteChapter = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<Ebook | null>(null);
  const [pages, setPages] = useState<EbookPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Form states
  const [chapterTitle, setChapterTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [showSidebar, setShowSidebar] = useState(true);

  // Page display settings
  const [showChapterTitle, setShowChapterTitle] = useState(false);
  const [showPageNumber, setShowPageNumber] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [verticalAlign, setVerticalAlign] = useState<'top' | 'center' | 'bottom'>('top');

  // Convert old paragraphs format to HTML if needed
  const pageToHtml = (page: EbookPage): string => {
    if (page.content) return page.content;
    if (page.paragraphs && page.paragraphs.length > 0) {
      return page.paragraphs.map((p) => `<p>${p}</p>`).join('');
    }
    return '';
  };

  // Load book details
  useEffect(() => {
    const found = getEbookById(Number(id));
    if (found) {
      setBook(found);
      const bookPages = found.pages || [];

      if (bookPages.length === 0) {
        const initialPages: EbookPage[] = [{ chapter: 'Bab 1: Bab Baru', paragraphs: [], content: '', verticalAlign: 'top', showChapterTitle: false, showPageNumber: false }];
        setPages(initialPages);
        setChapterTitle(initialPages[0].chapter);
        setHtmlContent('');
        setVerticalAlign('top');
        setShowChapterTitle(false);
        setShowPageNumber(false);
      } else {
        setPages(bookPages);
        setChapterTitle(bookPages[0].chapter);
        setHtmlContent(pageToHtml(bookPages[0]));
        setVerticalAlign(bookPages[0].verticalAlign || 'top');
        setShowChapterTitle(bookPages[0].showChapterTitle ?? false);
        setShowPageNumber(bookPages[0].showPageNumber ?? false);
      }
    } else {
      navigate('/creator');
    }
  }, [id, navigate]);

  // Toggle settings - per page, saved immediately
  const handleToggleChapterTitle = () => {
    const newVal = !showChapterTitle;
    setShowChapterTitle(newVal);
    // Save to current page immediately
    if (book) {
      const updatedPages = [...pages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        showChapterTitle: newVal,
      };
      setPages(updatedPages);
      saveEbook({ id: book.id, pages: updatedPages });
    }
  };

  const handleTogglePageNumber = () => {
    const newVal = !showPageNumber;
    setShowPageNumber(newVal);
    // Save to current page immediately
    if (book) {
      const updatedPages = [...pages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        showPageNumber: newVal,
      };
      setPages(updatedPages);
      saveEbook({ id: book.id, pages: updatedPages });
    }
  };

  // Sync form inputs when page flips
  const syncPageToInputs = useCallback((index: number) => {
    if (pages[index]) {
      setChapterTitle(pages[index].chapter);
      setHtmlContent(pageToHtml(pages[index]));
      setVerticalAlign(pages[index].verticalAlign || 'top');
      setShowChapterTitle(pages[index].showChapterTitle ?? false);
      setShowPageNumber(pages[index].showPageNumber ?? false);
      setCurrentPageIndex(index);
      setSaveStatus('saved');
    }
  }, [pages]);

  // Extract plain text from HTML for backward compat
  const htmlToParagraphs = (html: string): string[] => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split('\n').map((p) => p.trim()).filter((p) => p !== '');
  };

  // Save handler
  const handleSavePage = useCallback((title?: string, content?: string, targetIndex?: number) => {
    if (!book) return;

    const saveTitle = title ?? chapterTitle;
    const saveContent = content ?? htmlContent;
    const saveIndex = targetIndex ?? currentPageIndex;

    setSaveStatus('saving');
    
    const paragraphs = htmlToParagraphs(saveContent);

    const updatedPages = [...pages];
    updatedPages[saveIndex] = {
      ...updatedPages[saveIndex],
      chapter: saveTitle.trim() || `Bab ${saveIndex + 1}: Tanpa Judul`,
      paragraphs,
      content: saveContent,
      verticalAlign,
    };

    setPages(updatedPages);
    
    saveEbook({
      id: book.id,
      pages: updatedPages,
    });

    setSaveStatus('saved');
  }, [book, chapterTitle, htmlContent, currentPageIndex, pages, verticalAlign]);

  const handleContentChange = useCallback((html: string) => {
    setHtmlContent(html);
    setSaveStatus('idle');
  }, []);

  const handleTitleChange = (val: string) => {
    setChapterTitle(val);
    setSaveStatus('idle');
  };

  // Autosave: debounced save after 3 seconds of inactivity
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveStatus === 'idle' && book) {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        handleSavePage();
      }, 3000);
    }
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [saveStatus, htmlContent, chapterTitle]);

  const handleAddPage = () => {
    handleSavePage();

    const newPageIndex = pages.length;
    const newPage: EbookPage = { 
      chapter: `Bab ${newPageIndex + 1}: Bab Baru`, 
      paragraphs: [],
      content: '',
      verticalAlign: 'top',
    };
    
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    
    if (book) {
      saveEbook({
        id: book.id,
        pages: updatedPages,
      });
    }

    setCurrentPageIndex(newPageIndex);
    setChapterTitle(newPage.chapter);
    setHtmlContent('');
    setVerticalAlign('top');
    setSaveStatus('saved');
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) {
      alert('Minimal harus memiliki satu halaman naskah.');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus bab ini?')) {
      const updatedPages = pages.filter((_, idx) => idx !== currentPageIndex);
      setPages(updatedPages);

      if (book) {
        saveEbook({
          id: book.id,
          pages: updatedPages,
        });
      }

      const newIndex = Math.max(0, currentPageIndex - 1);
      setCurrentPageIndex(newIndex);
      setChapterTitle(updatedPages[newIndex].chapter);
      setHtmlContent(pageToHtml(updatedPages[newIndex]));
      setSaveStatus('saved');
    }
  };

  // Word count from HTML
  const wordCount = useMemo(() => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || '';
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [htmlContent]);

  if (!book) return null;

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 text-slate-800">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              handleSavePage();
              navigate('/creator');
            }}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer border-none transition-colors"
          >
            <IconArrowLeft size={18} />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
              <IconBook size={14} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest leading-none">Studio Penulis</span>
              <h2 className="text-sm font-black text-slate-800 mt-0.5 m-0 max-w-[200px] lg:max-w-sm truncate">
                {book.title}
              </h2>
            </div>
          </div>
          <div className="sm:hidden flex flex-col">
            <h2 className="text-xs font-black text-slate-800 m-0 max-w-[140px] truncate">
              {book.title}
            </h2>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-md">
            {wordCount} kata
          </span>

          <span className={`text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-md ${
            saveStatus === 'saved' 
              ? 'bg-emerald-50 text-emerald-600' 
              : saveStatus === 'saving' 
              ? 'bg-sky-50 text-sky-600' 
              : 'bg-amber-50 text-amber-600'
          }`}>
            {saveStatus === 'saved' ? '✓ Tersimpan' : saveStatus === 'saving' ? 'Menyimpan...' : '● Belum Disimpan'}
          </span>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="hidden lg:flex w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 items-center justify-center text-slate-600 cursor-pointer border-none transition-colors"
            title="Toggle Sidebar"
          >
            <IconLayoutSidebar size={16} />
          </button>

          <button
            onClick={() => handleSavePage()}
            className="h-9 px-4 rounded-lg bg-slate-800 text-white hover:bg-slate-900 cursor-pointer border-none flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
          >
            <IconDeviceFloppy size={14} />
            <span className="hidden sm:inline">Simpan</span>
          </button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="flex lg:hidden border-b border-slate-200 bg-white shrink-0">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'editor' 
              ? 'border-slate-800 text-slate-800' 
              : 'border-transparent text-slate-400'
          }`}
        >
          <IconPencil size={14} />
          <span>Editor</span>
        </button>
        <button
          onClick={() => {
            handleSavePage();
            setActiveTab('preview');
          }}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'preview' 
              ? 'border-slate-800 text-slate-800' 
              : 'border-transparent text-slate-400'
          }`}
        >
          <IconEye size={14} />
          <span>Pratinjau</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Chapter Sidebar (Desktop) */}
        {showSidebar && (
          <div className="hidden lg:flex flex-col w-56 xl:w-64 bg-white border-r border-slate-200 shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Daftar Bab</span>
              <button
                onClick={handleAddPage}
                className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-900 text-white cursor-pointer border-none flex items-center justify-center transition-colors"
                title="Tambah Bab"
              >
                <IconPlus size={13} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
              {pages.map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSavePage();
                    syncPageToInputs(idx);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer border-none transition-all ${
                    idx === currentPageIndex
                      ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
                      : 'bg-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconFileText size={13} className={idx === currentPageIndex ? 'text-sky-500' : 'text-slate-400'} />
                    <span className="truncate">{page.chapter || `Bab ${idx + 1}`}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 ml-5 block">
                    {page.paragraphs?.length || 0} paragraf
                  </span>
                </button>
              ))}
            </div>

            {/* Sidebar bottom actions */}
            <div className="p-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDeletePage}
                disabled={pages.length <= 1}
                className="w-full h-8 px-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer border-none flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <IconTrash size={13} />
                <span>Hapus Bab Ini</span>
              </button>
            </div>
          </div>
        )}

        {/* Editor Panel */}
        <div className={`flex-1 flex flex-col min-h-0 ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Chapter title input */}
          <div className="px-4 lg:px-6 pt-4 pb-3 shrink-0 bg-white border-b border-slate-100">
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Judul Bab..."
              className="w-full text-lg lg:text-xl font-black text-slate-800 bg-transparent border-none outline-none placeholder-slate-300 p-0"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                <span>Bab {currentPageIndex + 1} dari {pages.length}</span>
                <span>•</span>
                <span>{wordCount} kata</span>
              </div>

              {/* Vertical Align Buttons */}
              <div className="flex items-center gap-0.5 bg-slate-100 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => { setVerticalAlign('top'); setSaveStatus('idle'); }}
                  className={`w-7 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-colors ${
                    verticalAlign === 'top' ? 'bg-white text-sky-600 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
                  }`}
                  title="Konten di Atas"
                >
                  <IconLayoutAlignTop size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => { setVerticalAlign('center'); setSaveStatus('idle'); }}
                  className={`w-7 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-colors ${
                    verticalAlign === 'center' ? 'bg-white text-sky-600 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
                  }`}
                  title="Konten di Tengah"
                >
                  <IconLayoutAlignMiddle size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => { setVerticalAlign('bottom'); setSaveStatus('idle'); }}
                  className={`w-7 h-6 rounded flex items-center justify-center cursor-pointer border-none transition-colors ${
                    verticalAlign === 'bottom' ? 'bg-white text-sky-600 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
                  }`}
                  title="Konten di Bawah"
                >
                  <IconLayoutAlignBottom size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="flex-1 p-3 lg:p-4 min-h-0">
            <RichTextEditor
              content={htmlContent}
              onChange={handleContentChange}
              onSave={() => handleSavePage()}
              placeholder="Mulai menulis isi bab Anda di sini... Gunakan toolbar di atas untuk memformat teks seperti di Microsoft Word."
            />
          </div>

          {/* Mobile bottom actions */}
          <div className="flex lg:hidden items-center justify-between px-4 py-3 bg-white border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={handleDeletePage}
              disabled={pages.length <= 1}
              className="h-8 px-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer border-none flex items-center justify-center gap-1 text-[11px] font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <IconTrash size={13} />
              <span>Hapus</span>
            </button>
            <button
              type="button"
              onClick={handleAddPage}
              className="h-8 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white cursor-pointer border-none flex items-center justify-center gap-1 text-[11px] font-bold transition-colors"
            >
              <IconPlus size={13} />
              <span>Tambah Bab</span>
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        {showSidebar && (
          <div className={`w-full lg:w-[380px] xl:w-[420px] flex flex-col min-h-0 bg-white border-l border-slate-200 shrink-0 ${
            activeTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}>
            {/* Preview Header with Settings */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <IconEye size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pratinjau</span>
              </div>
              <button
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer border-none transition-colors ${
                  showSettingsPanel ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title="Pengaturan Halaman"
              >
                <IconSettings size={14} />
              </button>
            </div>

            {/* Settings Panel (collapsible) */}
            {showSettingsPanel && (
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 shrink-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Pengaturan Tampilan</p>
                
                {/* Toggle: Show Chapter Title */}
                <label className="flex items-center justify-between py-2 cursor-pointer group">
                  <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                    Tampilkan Judul Bab
                  </span>
                  <div 
                    onClick={handleToggleChapterTitle}
                    className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${
                      showChapterTitle ? 'bg-sky-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      showChapterTitle ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </label>

                {/* Toggle: Show Page Number */}
                <label className="flex items-center justify-between py-2 cursor-pointer group">
                  <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                    Tampilkan Nomor Halaman
                  </span>
                  <div 
                    onClick={handleTogglePageNumber}
                    className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${
                      showPageNumber ? 'bg-sky-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      showPageNumber ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </label>

                <p className="text-[9px] text-slate-400 mt-1.5 leading-relaxed">
                  Pengaturan ini berlaku untuk halaman ini. Nomor halaman akan tampil dari halaman ini dan seterusnya.
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
              {/* Book Page Preview */}
              <div className="w-full max-w-[340px] mx-auto aspect-[7/10] bg-[#fffdf9] border border-[#e8d9b8] rounded-lg select-none relative shadow-md">
                {/* Spine Shadow */}
                <div className="absolute inset-y-0 left-0 w-6 pointer-events-none rounded-l-lg bg-gradient-to-r from-black/8 via-black/2 to-transparent z-10" />

                {/* Content wrapper with vertical alignment */}
                <div className={`absolute inset-0 flex flex-col p-6 lg:p-8 z-20 ${
                  showPageNumber ? 'pb-12' : ''
                }`}>
                  {/* Page Header - only if enabled */}
                  {showChapterTitle && (
                    <div className="flex flex-col items-center pb-3 mb-4 border-b border-black/5 text-center shrink-0">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-widest leading-none text-sky-700 max-w-[260px] truncate">
                        {chapterTitle.trim() || 'Bab Baru'}
                      </span>
                    </div>
                  )}

                  {/* Flex spacer for vertical alignment */}
                  {(verticalAlign === 'center' || verticalAlign === 'bottom') && (
                    <div className="flex-1" />
                  )}

                  {/* Page Content */}
                  <div 
                    className="preview-content shrink-0"
                    dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color:#94a3b8;font-style:italic;text-align:center;padding:2.5rem 0;font-size:12px;">Naskah masih kosong...</p>' }}
                  />

                  {/* Flex spacer for vertical alignment */}
                  {verticalAlign === 'center' && (
                    <div className="flex-1" />
                  )}
                </div>

                {/* Page Number - absolute bottom, independent of content flow */}
                {showPageNumber && (
                  <div className="absolute bottom-5 left-6 right-6 lg:left-8 lg:right-8 text-center border-t border-black/5 pt-2 z-30">
                    <span className="text-[9px] tracking-wider font-medium text-[#a09080]" style={{ fontFamily: 'Georgia, serif' }}>
                      — halaman {(() => {
                        // Find first page with showPageNumber enabled
                        const startIdx = pages.findIndex(p => p.showPageNumber);
                        if (startIdx < 0) return 1;
                        return currentPageIndex - startIdx + 1;
                      })()} —
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-100 shrink-0">
              <p className="text-[10px] text-slate-400 font-medium text-center leading-relaxed">
                Pratinjau ini menampilkan bagaimana naskah Anda akan terlihat di layar pembaca.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
