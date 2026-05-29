import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowLeft, IconChevronLeft, IconChevronRight, IconVolume, IconVolumeOff } from '@tabler/icons-react';
import { useEbookById } from '../../../../hooks/useApiData';
import { ebooksApi } from '../../../../api/ebooks';
import { playPageFlipSound } from '../../../../utils/pageFlipSound';

interface PageContent {
  chapter: string;
  paragraphs: string[];
  content?: string;
  verticalAlign?: 'top' | 'center' | 'bottom';
  showChapterTitle?: boolean;
  showPageNumber?: boolean;
}

export const EbookRead = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: book, isLoading: loading, isError: error } = useEbookById(id);
  
  // Track current page (1-based index)
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const history = localStorage.getItem('reading_history');
      if (history && id) {
        const historyList = JSON.parse(history);
        if (historyList[id]) {
          return Number(historyList[id].page) || 1;
        }
      }
    } catch {}
    return 1;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  // Initialize and sync reading history for this book on load
  useEffect(() => {
    if (!book) return;
    
    const syncHistory = async () => {
      try {
        const historyKey = 'reading_history';
        const history = localStorage.getItem(historyKey);
        const historyList = history ? JSON.parse(history) : {};
        
        const pages = getPageContents();
        const totalPagesCount = pages.length;

        // Try syncing from backend if logged in
        const loggedIn = localStorage.getItem('logged_in_user');
        if (loggedIn) {
          try {
            const remoteHistory = await ebooksApi.getReadingHistory();
            if (Array.isArray(remoteHistory)) {
              const newLocalHistory: Record<string, any> = {};
              remoteHistory.forEach((h: any) => {
                if (h.ebook_id && h.progress) {
                  newLocalHistory[h.ebook_id] = {
                    page: h.progress.page,
                    totalPages: h.progress.totalPages,
                    updatedAt: h.progress.updatedAt
                  };
                }
              });
              const mergedHistory = { ...historyList, ...newLocalHistory };
              localStorage.setItem(historyKey, JSON.stringify(mergedHistory));
              
              if (newLocalHistory[book.id]) {
                const pageNum = Number(newLocalHistory[book.id].page);
                setCurrentPage(pageNum);
              }
            }
          } catch (apiErr) {
            console.error("Error syncing reading history from backend:", apiErr);
          }
        }

        if (!historyList[book.id]) {
          historyList[book.id] = {
            page: 1,
            totalPages: totalPagesCount,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem(historyKey, JSON.stringify(historyList));
        }

        // Increment view count
        ebooksApi.incrementView(id!).catch(() => {});
      } catch (err) {
        console.error("Error initializing reading history:", err);
      }
    };

    syncHistory();
  }, [book]);

  // Convert API ebook_pages to the format the reader expects
  const getPageContents = (): PageContent[] => {
    if (!book) return [];

    // Check for ebook_pages from API
    if (book.ebook_pages && book.ebook_pages.length > 0) {
      return book.ebook_pages
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((page: any) => ({
          chapter: page.chapter || '',
          paragraphs: page.content ? [] : [],
          content: page.content || '',
          verticalAlign: page.vertical_align || 'top',
          showChapterTitle: page.show_chapter_title ?? false,
          showPageNumber: page.show_page_number ?? false,
        }));
    }

    // Fallback to pages array (legacy format)
    if (book.pages && book.pages.length > 0) {
      return book.pages;
    }

    // Default content if no pages exist
    return [
      {
        chapter: 'Bab 1: Langkah Awal Menuju Perubahan',
        paragraphs: [
          `Setiap bab di dalam buku "${book.title}" ini ditulis untuk membimbing Anda melalui proses transformatif yang mendalam. Penulis ${book.author_name || book.author || 'penulis'} merangkai setiap argumentasi secara sistematis agar mudah dipahami dan dipraktikkan langsung.`,
          'Kita seringkali menunda proses belajar karena merasa belum siap menghadapi kompleksitas di dalamnya. Padahal, kesiapan sejati lahir seiring berjalannya proses itu sendiri. Membuka halaman pertama adalah komitmen terkecil yang berdampak paling besar.'
        ],
        content: '',
        verticalAlign: 'top' as const,
        showChapterTitle: true,
        showPageNumber: false,
      }
    ];
  };

  const pagesContent = getPageContents();
  const totalPages = pagesContent.length;

  // Sync progress to localstorage & backend on currentPage changes
  useEffect(() => {
    if (!book || totalPages === 0) return;
    
    const saveProgress = async () => {
      try {
        const historyKey = 'reading_history';
        const history = localStorage.getItem(historyKey);
        const historyList = history ? JSON.parse(history) : {};

        // Avoid double writes if values match
        if (historyList[book.id]?.page === currentPage) return;
        
        historyList[book.id] = {
          page: currentPage,
          totalPages: totalPages,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(historyKey, JSON.stringify(historyList));

        // Save to backend if logged in
        const loggedIn = localStorage.getItem('logged_in_user');
        if (loggedIn) {
          await ebooksApi.updateReadingHistory(book.id, currentPage, totalPages);
        }
      } catch (err) {
        console.error("Error saving reading progress on page change:", err);
      }
    };

    saveProgress();
  }, [currentPage, book, totalPages]);

  if (loading) {
    return (
      <div className="min-h-full w-full flex items-center justify-center bg-gradient-to-br from-[#f8f3e8] via-[#eedfb8] to-[#e4d3a2]">
        <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-full w-full flex flex-col items-center justify-center p-5 text-center bg-white text-slate-800">
        <h3 className="text-lg font-bold">Ebook tidak ditemukan</h3>
        <button 
          onClick={() => navigate('/ebooks')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-sky-700 transition-colors"
        >
          Kembali ke Daftar Ebook
        </button>
      </div>
    );
  }

  const author = book.author_name || book.author || 'Anonim';

  // Page number logic: if a page has showPageNumber=true, that page and all subsequent pages show numbers
  const pageNumberStartIndex = (() => {
    for (let i = 0; i < pagesContent.length; i++) {
      if (pagesContent[i].showPageNumber) return i;
    }
    return -1;
  })();

  const handleNext = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
      if (soundEnabled) playPageFlipSound();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
      if (soundEnabled) playPageFlipSound();
    }
  };

  const fontSizeClass = 'text-[15px] leading-[1.75] text-[#2b1f1d]';

  const renderedPages = pagesContent.map((content, index) => (
    <div
      key={index}
      className="relative w-full h-full flex flex-col px-8 py-9 rounded-md border shadow-sm select-none overflow-hidden bg-[#fffdf9] border-[#ebdcb9] text-[#3c2f2f]"
    >
      {/* Spine Gutter Shadow */}
      <div className="absolute inset-y-0 left-0 w-8 pointer-events-none rounded-l-md bg-gradient-to-r from-black/12 via-black/3 to-transparent z-20" />
      <div className="absolute inset-y-0 left-0 w-[1px] pointer-events-none z-20 bg-black/5" />
      <div className="absolute inset-y-0 right-0 w-[2px] pointer-events-none rounded-r-md bg-gradient-to-l from-white/5 to-transparent z-20" />

      <div className="flex-1 flex flex-col z-10 h-full">
        {/* Chapter Title - per page */}
        {(content.showChapterTitle || (!book.isUserCreated && content.showChapterTitle !== false)) && content.chapter && (
        <div className="flex flex-col items-center pb-3 mb-5 border-b border-black/5 text-center shrink-0">
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest leading-none text-sky-700">
            {content.chapter}
          </span>
        </div>
        )}

        {content.content ? (
          <>
            {(content.verticalAlign === 'center' || content.verticalAlign === 'bottom') && (
              <div className="flex-1" />
            )}
            <div className="shrink-0">
              <div 
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>
            {content.verticalAlign === 'center' && (
              <div className="flex-1" />
            )}
          </>
        ) : (
          <div className={`flex-1 flex flex-col gap-4 font-serif ${fontSizeClass}`}>
            {content.paragraphs.map((p, idx) => {
              const isFirstParagraph = idx === 0;
              return (
                <p
                  key={idx}
                  className={`${
                    isFirstParagraph
                      ? 'text-left indent-0 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:leading-[0.85] first-letter:font-sans first-letter:text-sky-700'
                      : 'text-justify indent-6'
                  }`}
                >
                  {p}
                </p>
              );
            })}
            <div className="text-center py-4 text-xs opacity-35 select-none font-sans">❦</div>
          </div>
        )}

        {/* Page Number */}
        {pageNumberStartIndex >= 0 && index >= pageNumberStartIndex && (
        <div className="text-center pt-3 mt-auto border-t border-black/5 shrink-0">
          <span className="text-[9px] tracking-wider font-medium text-[#a09080]" style={{ fontFamily: 'Georgia, serif' }}>
            — halaman {index - pageNumberStartIndex + 1} —
          </span>
        </div>
        )}
      </div>
    </div>
  ));

  // Framer Motion Animation Variants for GPU Sliding
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
      opacity: 0.9
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : dir > 0 ? '-100%' : 0,
      opacity: 0.9
    })
  };

  return (
    <div className="min-h-full w-full flex flex-col bg-gradient-to-br from-[#f8f3e8] via-[#eedfb8] to-[#e4d3a2]">
      {/* Header */}
      <div className="relative flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 z-20 shrink-0 border-b bg-[#faf6eb] border-[#ebdcb9]">
        {/* Left Side */}
        <div className="z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border transition-colors bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            <IconArrowLeft size={18} />
          </button>
        </div>

        {/* Absolute Centered Title Wrapper */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-16 mt-2">
          <h4 className="text-[10px] font-black truncate m-0 leading-tight uppercase tracking-wider max-w-[180px] text-sky-700">
            {book.title}
          </h4>
          <span className="text-[9px] text-slate-400 font-semibold leading-none truncate block mt-0.5 max-w-[180px]">
            {author}
          </span>
        </div>

        {/* Right Side Controls - Sound Toggle */}
        <div className="flex items-center gap-1.5 z-10">
          <button 
            onClick={() => setSoundEnabled((s) => !s)}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border transition-colors bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <IconVolume size={18} /> : <IconVolumeOff size={18} />}
          </button>
        </div>
      </div>

      {/* Reader Layout Content - Stacked Page / Novel Look */}
      <div className="flex-1 overflow-visible px-5 py-6 flex flex-col justify-center select-none">
        <div className="relative w-full max-w-sm mx-auto aspect-[7/10] flex flex-col">
          
          {/* Stacked Pages Behind (Visual Aesthetics) */}
          <div className="absolute inset-y-1.5 -right-2.5 w-full h-full rounded-md border opacity-40 z-0 bg-[#ebdcb9] border-[#d8c599]" style={{ transform: 'translateY(5px)' }} />
          <div className="absolute inset-y-1 -right-1.5 w-full h-full rounded-md border opacity-75 z-0 bg-[#f5ebd0] border-[#e0cfa5]" style={{ transform: 'translateY(3px)' }} />
          <div className="absolute inset-y-0.5 -right-0.5 w-full h-full rounded-md border opacity-90 z-0 bg-[#fcf8f0] border-[#ebdcb9]" style={{ transform: 'translateY(1.5px)' }} />

          {/* GPU Hardware-Accelerated Sliding Reader */}
          <div className="relative flex-1 w-full h-full z-10 overflow-hidden rounded-md shadow-lg">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentPage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 350, damping: 35 },
                  opacity: { duration: 0.15 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x < -swipeThreshold) {
                    handleNext();
                  } else if (info.offset.x > swipeThreshold) {
                    handlePrev();
                  }
                }}
                className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                {renderedPages[currentPage - 1]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Nav Control Bar */}
      <div className="relative z-30 px-5 py-4 border-t flex flex-col gap-3 shrink-0 bg-[#faf6eb] border-[#ebdcb9]">
        {/* Progress Bar */}
        <div className="w-full h-1 rounded-full overflow-hidden bg-[#ebdcb9]">
          <div 
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 text-[11px] font-bold py-1.5 px-3 rounded-lg border cursor-pointer select-none transition-all ${
              currentPage === 1 
                ? 'opacity-40 pointer-events-none' 
                : 'bg-white border-[#ebdcb9] text-[#3c2f2f] hover:bg-[#fffdf9]'
            }`}
          >
            <IconChevronLeft size={16} />
            <span>Sebelumnya</span>
          </button>

          <span className="text-[9px] font-bold font-sans text-slate-400 uppercase tracking-widest">
            Selesai {totalPages > 0 ? ((currentPage / totalPages) * 100).toFixed(0) : 0}%
          </span>

          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 text-[11px] font-bold py-1.5 px-3 rounded-lg border cursor-pointer select-none transition-all ${
              currentPage === totalPages 
                ? 'opacity-40 pointer-events-none' 
                : 'bg-white border-[#ebdcb9] text-[#3c2f2f] hover:bg-[#fffdf9]'
            }`}
          >
            <span>Selanjutnya</span>
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
