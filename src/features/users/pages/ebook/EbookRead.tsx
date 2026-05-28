import { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip-enhanced';
import { IconArrowLeft, IconChevronLeft, IconChevronRight, IconVolume, IconVolumeOff } from '@tabler/icons-react';
import { getEbookById } from '../../../../utils/ebookStore';
import { playPageFlipSound } from '../../../../utils/pageFlipSound';

export const EbookRead = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = getEbookById(Number(id));

  const [currentPage, setCurrentPage] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const bookRef = useRef<any>(null);

  // Initialize reading history for this book on load
  useEffect(() => {
    if (!book) return;
    try {
      const historyKey = 'reading_history';
      const history = localStorage.getItem(historyKey);
      const historyList = history ? JSON.parse(history) : {};
      
      const pagesContent = book.pages && book.pages.length > 0
        ? book.pages
        : (bookContentsMap[book.id] || defaultExcerpts);
      const totalPagesCount = pagesContent.length;

      if (!historyList[book.id]) {
        historyList[book.id] = {
          page: 1,
          totalPages: totalPagesCount,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(historyKey, JSON.stringify(historyList));
      }
    } catch (err) {
      console.error("Error initializing reading history:", err);
    }
  }, [book]);

  if (!book) {
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

  // Book-specific authentic mock excerpts to look like a real novel/book
  const bookContentsMap: Record<number, { chapter: string; paragraphs: string[] }[]> = {
    1: [ // Atomic Habits
      {
        chapter: 'Bab 1: Kekuatan Dahsyat Perubahan 1%',
        paragraphs: [
          'Sangat mudah untuk melebih-lebihkan pentingnya satu momen penting dan meremehkan nilai membuat perbaikan kecil setiap hari. Terlalu sering kita meyakinkan diri sendiri bahwa kesuksesan besar menuntut tindakan yang masif.',
          'Sementara itu, perbaikan 1 persen setiap hari mungkin tidak terlalu terasa—bahkan terkadang tidak disadari—tetapi dalam jangka panjang, dampaknya bisa sangat luar biasa. Efek dari kebiasaan kecil akan terus berlipat ganda seiring berjalannya waktu.'
        ]
      },
      {
        chapter: 'Bab 1: Kekuatan Dahsyat Perubahan 1%',
        paragraphs: [
          'Bayangkan sebuah pesawat yang lepas landas dari Los Angeles menuju New York City. Jika pilot mengubah arah moncong pesawat hanya 3,5 derajat ke arah selatan, pesawat tersebut akan mendarat di Washington, D.C., bukan di New York.',
          'Perubahan yang sangat kecil itu hampir tidak terasa saat lepas landas. Namun, setelah melintasi seluruh wilayah Amerika Serikat, perbedaan kecil itu menumpuk dan membawa pesawat ke tujuan yang sangat berbeda.'
        ]
      },
      {
        chapter: 'Bab 2: Fokus pada Sistem, Bukan Sasaran',
        paragraphs: [
          'Sasaran adalah tentang hasil yang ingin Anda capai. Sistem adalah tentang proses yang mengarah pada hasil tersebut. Jika Anda menginginkan hasil yang lebih baik, lupakan sasaran Anda. Fokuslah pada sistem Anda sebagai gantinya.',
          'Pemenang dan pecundang memiliki sasaran yang sama. Setiap peserta olimpiade ingin memenangkan medali emas. Jadi, sasaran tidak bisa menjadi pembeda. Yang membedakan adalah komitmen mereka pada sistem perbaikan harian.'
        ]
      }
    ],
    3: [ // Filosofi Teras
      {
        chapter: 'Bab 1: Menjinakkan Kekhawatiran Hidup',
        paragraphs: [
          'Lebih dari dua ribu tahun yang lalu, sekelompok filsuf di Athena menemukan cara hidup yang sangat praktis untuk mengatasi kecemasan dan emosi negatif. Ajaran ini disebut Stoisisme, atau di dalam buku ini kita sebut Filosofi Teras.',
          'Tujuan utama dari Filosofi Teras bukan untuk menjadi manusia dingin tanpa emosi, melainkan untuk memiliki ketenteraman jiwa (ataraxia) yang tidak mudah goyah oleh hal-hal di luar kendali kita.'
        ]
      },
      {
        chapter: 'Bab 1: Menjinakkan Kekhawatiran Hidup',
        paragraphs: [
          'Di dunia ini, ada hal-hal yang ada di bawah kendali kita (dikotomi kendali) seperti opini, keinginan, dan tindakan kita sendiri. Namun, ada jauh lebih banyak hal yang di luar kendali kita seperti reputasi, cuaca, tindakan orang lain, dan kesehatan tubuh.',
          'Stres dan penderitaan batin terjadi ketika kita menggantungkan kebahagiaan kita pada hal-hal yang berada di luar kendali kita, sementara mengabaikan apa yang sebenarnya bisa kita kendalikan secara penuh.'
        ]
      },
      {
        chapter: 'Bab 2: Mengendalikan Interpretasi Kita',
        paragraphs: [
          'Bukan peristiwa itu sendiri yang membuat kita cemas atau marah, melainkan opini dan interpretasi kita terhadap peristiwa tersebut. Ketika seseorang menghina Anda, itu hanya getaran suara. Rasa sakit hati muncul karena pikiran Anda memutuskan untuk merasa terhina.',
          'Dengan memahami hal ini, kita memiliki jeda waktu untuk berpikir rasional sebelum membiarkan emosi negatif mengambil alih tindakan kita. Inilah awal dari kebebasan emosi yang sejati.'
        ]
      }
    ]
  };

  // Fallback content if book has no specific mock content
  const defaultExcerpts = [
    {
      chapter: 'Bab 1: Langkah Awal Menuju Perubahan',
      paragraphs: [
        `Setiap bab di dalam buku "${book.title}" ini ditulis untuk membimbing Anda melalui proses transformatif yang mendalam. Penulis ${book.author} merangkai setiap argumentasi secara sistematis agar mudah dipahami dan dipraktikkan langsung.`,
        'Kita seringkali menunda proses belajar karena merasa belum siap menghadapi kompleksitas di dalamnya. Padahal, kesiapan sejati lahir seiring berjalannya proses itu sendiri. Membuka halaman pertama adalah komitmen terkecil yang berdampak paling besar.'
      ]
    },
    {
      chapter: 'Bab 1: Langkah Awal Menuju Perubahan',
      paragraphs: [
        'Dalam fase adaptasi ini, Anda akan menghadapi berbagai keraguan dan pola pikir lama yang menghambat. Hal ini wajar. Kunci utamanya adalah tetap konsisten dan menyediakan waktu khusus setiap hari untuk membaca tanpa gangguan.',
        'Proses asimilasi pengetahuan baru membutuhkan ketenangan batin. Cobalah untuk meresapi setiap kalimat, bukan sekadar menyelesaikannya secepat mungkin. Nikmati alur dan keindahan gagasan yang disampaikan penulis.'
      ]
    },
    {
      chapter: 'Bab 2: Menjaga Konsistensi Membaca',
      paragraphs: [
        'Konsistensi adalah jembatan antara impian dan pencapaian. Di bab kedua ini, fokus beralih ke bagaimana mempertahankan ritme membaca di tengah kesibukan harian yang padat.',
        `Melalui "${book.title}", kita belajar bahwa membaca bukan sekadar aktivitas mengisi waktu luang, melainkan sebuah investasi intelektual jangka panjang yang akan membentuk cara kita mengambil keputusan di masa depan.`
      ]
    }
  ];

  const pagesContent = book.pages && book.pages.length > 0
    ? book.pages
    : (bookContentsMap[book.id] || defaultExcerpts);
  const totalPages = pagesContent.length;

  // Read display settings - per page
  // Page number logic: if a page has showPageNumber=true, that page and all subsequent pages show numbers
  // Find the first page index where showPageNumber is enabled
  const pageNumberStartIndex = useMemo(() => {
    for (let i = 0; i < pagesContent.length; i++) {
      if (pagesContent[i].showPageNumber) return i;
    }
    // Fallback: check legacy book-level settings
    if (book.settings?.showPageNumber) return 0;
    return -1; // no page numbers
  }, [pagesContent, book.settings]);

  const handleNext = () => {
    if (bookRef.current) {
      try {
        const flip = bookRef.current.pageFlip();
        if (flip) {
          flip.flipNext();
          if (soundEnabled) playPageFlipSound();
        }
      } catch (err) {
        console.error("Error in handleNext:", err);
      }
    }
  };

  const handlePrev = () => {
    if (bookRef.current) {
      try {
        const flip = bookRef.current.pageFlip();
        if (flip) {
          flip.flipPrev();
          if (soundEnabled) playPageFlipSound();
        }
      } catch (err) {
        console.error("Error in handlePrev:", err);
      }
    }
  };

  const onFlip = (e: any) => {
    if (e && typeof e.data === 'number') {
      const pageNum = e.data + 1;
      setCurrentPage(pageNum);

      // Play page flip sound on manual swipe
      if (soundEnabled) playPageFlipSound();

      try {
        const historyKey = 'reading_history';
        const history = localStorage.getItem(historyKey);
        const historyList = history ? JSON.parse(history) : {};
        historyList[book.id] = {
          page: pageNum,
          totalPages: totalPages,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(historyKey, JSON.stringify(historyList));
      } catch (err) {
        console.error("Error saving reading history:", err);
      }
    }
  };

  const fontSizeClass = 'text-[15px] leading-[1.75] text-[#2b1f1d]';

  const renderedPages = useMemo(() => {
    return pagesContent.map((content, index) => (
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
          {(content.showChapterTitle || (!book.isUserCreated && content.showChapterTitle !== false)) && (
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
  }, [pagesContent, fontSizeClass, pageNumberStartIndex, book.isUserCreated]);

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
            {book.author}
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
          
          {/* Stacked Pages */}
          <div className="absolute inset-y-1.5 -right-2.5 w-full h-full rounded-md border opacity-40 z-0 bg-[#ebdcb9] border-[#d8c599]" style={{ transform: 'translateY(5px)' }} />
          <div className="absolute inset-y-1 -right-1.5 w-full h-full rounded-md border opacity-75 z-0 bg-[#f5ebd0] border-[#e0cfa5]" style={{ transform: 'translateY(3px)' }} />
          <div className="absolute inset-y-0.5 -right-0.5 w-full h-full rounded-md border opacity-90 z-0 bg-[#fcf8f0] border-[#ebdcb9]" style={{ transform: 'translateY(1.5px)' }} />

          {/* FlipBook Container */}
          <div className="relative flex-1 w-full h-full z-10">
            <HTMLFlipBook
              ref={(el) => {
                bookRef.current = el;
              }}
              width={350}
              height={500}
              size="stretch"
              minWidth={280}
              maxWidth={450}
              minHeight={400}
              maxHeight={600}
              drawShadow={true}
              flippingTime={400}
              usePortrait={true}
              startPage={currentPage - 1}
              useMouseEvents={true}
              swipeDistance={15}
              showPageCorners={false}
              disableFlipByClick={true}
              onFlip={onFlip}
              className="w-full h-full"
              style={{ background: 'transparent' }}
            >
              {renderedPages}
            </HTMLFlipBook>
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
            Selesai {(currentPage / totalPages * 100).toFixed(0)}%
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
