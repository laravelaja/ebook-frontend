export const BANNERS = [
  {
    id: 1,
    title: 'Promo Spesial Mei',
    image: 'https://imgs.search.brave.com/lJWi3ACA7l_ysvbmdRTOOzYVxvEfyWrqpU5PP8MUegw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ncmFk/aWVubWVkaWF0YW1h/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wNy9tYXMt/a29rby1nYW50ZW5n/LmpwZw'
  },
  {
    id: 2,
    title: 'Ebook Pilihan Terpopuler',
    image: 'https://imgs.search.brave.com/qcnre9yvDuxC_P4ZIsKTZ-xUjTIkU0cH6BP3iLUVKkQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/LmFtaWtvbS5hYy5p/ZC93cC1jb250ZW50/L3VwbG9hZHMvMjAy/NS8xMS9FdmVudC1Q/ZXN0YS1CdWt1LUpv/Z2phLTIwMjUtSmFk/d2FsLUxva2FzaS1I/YXJnYS1UaWtldC1k/YW4tUHJvbW8tVGVy/YmFydS0xMDI0eDY4/Mi5qcGc'
  },
  {
    id: 3,
    title: 'Koleksi Buku Baru',
    image: 'https://imgs.search.brave.com/1tswy1tcKPEfGlpwKINSwTwYfaalvL4bo46bU25gfwE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/LmFtaWtvbS5hYy5p/ZC93cC1jb250ZW50/L3VwbG9hZHMvMjAy/NS8xMS9FdmVudC1Q/ZXN0YS1CdWt1LUpv/Z2phLTIwMjUtSmFk/d2FsLUxva2FzaS1I/YXJnYS1UaWtldC1k/YW4tUHJvbW8tVGVy/YmFydS10aG1iLTEw/MjR4NTc2LnBuZw'
  }
];

export const CATEGORIES = [
  'Semua',
  'Pengembangan Diri',
  'Bisnis & Finansial',
  'Teknologi',
  'Fiksi',
  'Sastra'
];

export interface Ebook {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  views: string;
  category: string;
}

export const TOP_EBOOKS: Ebook[] = [
  {
    id: 1,
    title: 'Nak Kamu Gak Papa, Kan?',
    author: 'Mas Koko Ganteng',
    cover: 'https://imgs.search.brave.com/qtodFWbRzJgn1OvnQlMmkUPLReH9AtjDTmXEcW8vdXg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ncmFk/aWVubWVkaWF0YW1h/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wNS9uYWst/a2FtdS1nYXBhcGEt/a2FuLmpwZw',
    rating: 4.8,
    views: '12.5k',
    category: 'Pengembangan Diri'
  },
  {
    id: 2,
    title: 'Seni Memahami Wanita',
    author: 'Claudia',
    cover: 'https://imgs.search.brave.com/0St2CFVffdyzYChfkakfgB0WxsYHxNiT_z1kFybbcoY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9rdWJ1/a3UuaWQvYXBpL2dl/bmVyaWMvc2hvd0Nv/dmVyL0JLNzYwODE',
    rating: 4.6,
    views: '8.2k',
    category: 'Pengembangan Diri'
  },
  {
    id: 3,
    title: 'Seni Memahami Pria',
    author: 'Claudia',
    cover: 'https://imgs.search.brave.com/n3iMHhHLLwQfdt3kBoJQKbiyO_GwVtLy2sxZe-IVJLU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aXJ0/YWJ1YW5hbWVkaWEu/Y28uaWQvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMTEvU0VO/SS1NRU1BSEFNSS1Q/UklBLmpwZw',
    rating: 4.9,
    views: '15.1k',
    category: 'Pengembangan Diri'
  },
  {
    id: 4,
    title: 'Aku Kalah Aku Merindukanmu',
    author: 'Simon Sinek',
    cover: 'https://imgs.search.brave.com/TnghH6tb8U-GunGZgEOkUV5GJD_sLCuGs7KZds1kTis/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ncmFk/aWVubWVkaWF0YW1h/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wNS9ha3Ut/a2FsYWgtYWt1LW1l/cmluZHVrYW5tdS5q/cGc',
    rating: 4.7,
    views: '9.4k',
    category: 'Bisnis & Finansial'
  },
  {
    id: 5,
    title: 'Seporsi Mie Ayam Sebelum Meninggal',
    author: 'Robert Kiyosaki',
    cover: 'https://imgs.search.brave.com/rT137YfsdP8Fw_VS2-_2PbfTjBJoE6xFDN-e5LHwgbA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lYm9v/ay50d29pbnRvbWVk/aWEuY29tL3VwbG9h/ZHMvY292ZXJzLzIw/MjUvMDEvU2Vwb3Jz/aS1NaWUtQXlhbS1T/ZWJlbHVtLU1hdGkt/YnktQnJpYW4tS2hy/aXNuYS53ZWJw',
    rating: 4.7,
    views: '20.3k',
    category: 'Drama Emosional'
  },
  {
    id: 6,
    title: '3726 MDPL',
    author: 'Morgan Housel',
    cover: 'https://imgs.search.brave.com/9CGQrekq3CAjd0JWiIk2L9zruViYGhoPq6mp-SP8m8c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZS5ncmFtZWRpYS5u/ZXQvcnM6Zml0OjA6/MC9wbGFpbi9odHRw/czovL2Nkbi5ncmFt/ZWRpYS5jb20vdXBs/b2Fkcy9wcm9kdWN0/cy85Mzk3cDQ2MDN2/LmpwZw',
    rating: 4.9,
    views: '11.8k',
    category: 'Bisnis & Finansial'
  },
  {
    id: 7,
    title: 'Bumi dan Lukanya',
    author: 'Robert C. Martin',
    cover: 'https://imgs.search.brave.com/2RFz0jVlKzoBCd-pbsISx9Hm0PLi2XjTmaFXPTr4ZwQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9rdWJ1/a3UuaWQvYXBpL2dl/bmVyaWMvc2hvd0Nv/dmVyL0JLNjgyMTU',
    rating: 4.8,
    views: '5.2k',
    category: 'Teknologi'
  },
  {
    id: 8,
    title: 'I Have a Crush on You',
    author: 'Thomas H. Cormen',
    cover: 'https://imgs.search.brave.com/UmLYtdPMVthu6Ovy8q7G7A3T_jihSP7XbSvY1ysVoj0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbGF5/Lmdvb2dsZS5jb20v/Ym9va3MvcHVibGlz/aGVyL2NvbnRlbnQv/aW1hZ2VzL2Zyb250/Y292ZXIvbm1DY0VR/QUFRQkFKP2ZpZmU9/dzI0MC1oMzQ1',
    rating: 4.7,
    views: '3.1k',
    category: 'Teknologi'
  },
  {
    id: 9,
    title: 'Utuh Tapi Tak Cemara',
    author: 'Mas Koko Ganteng',
    cover: 'https://imgs.search.brave.com/IWojkcuaTaeWvTDE9pVLzgQCREQzFViJ5qNv_VSLZhI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ncmFk/aWVubWVkaWF0YW1h/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNS8wOC9Db3Zl/ci1VdHVoLXRhcGkt/VGlkYWstQ2VtYXJh/LTE1MHgyMTkuanBn',
    rating: 4.9,
    views: '25k',
    category: 'Fiksi'
  },
];

export interface Announcement {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Peluncuran Fitur AuraBook Premium',
    excerpt: 'Nikmati akses tak terbatas ke ribuan ebook pilihan terbaik dan fitur eksklusif lainnya.',
    content: 'Kami sangat senang mengumumkan peluncuran AuraBook Premium! Mulai hari ini, Anda dapat berlangganan untuk mendapatkan akses tanpa batas ke seluruh katalog ebook kami, membaca tanpa iklan, serta mendapatkan rekomendasi yang dipersonalisasi. Terima kasih telah menjadi pembaca setia AuraBook!',
    date: '25 Mei 2026',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Tips Menjaga Kesehatan Mata Saat Membaca',
    excerpt: 'Simak tips praktis dari para ahli kesehatan untuk kenyamanan membaca jangka panjang.',
    content: 'Membaca ebook sangat menyenangkan, namun kesehatan mata tetap yang utama. Pastikan Anda menerapkan aturan 20-20-20: setiap 20 menit membaca, alihkan pandangan ke objek berjarak 20 kaki selama 20 detik. Jaga juga jarak baca minimal 30 cm dan atur kecerahan layar sesuai kenyamanan Anda.',
    date: '20 Mei 2026',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Event Bedah Buku Bulanan AuraBook',
    excerpt: 'Ikuti diskusi seru bersama penulis best-seller nasional secara virtual akhir pekan ini.',
    content: 'AuraBook kembali menyelenggarakan diskusi virtual bedah buku bersama penulis best-seller bulan ini. Daftarkan diri Anda segera melalui menu info untuk mendapatkan tautan akses Zoom eksklusif. Event ini gratis dan terbuka untuk seluruh pengguna AuraBook.',
    date: '15 Mei 2026',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop'
  }
];

