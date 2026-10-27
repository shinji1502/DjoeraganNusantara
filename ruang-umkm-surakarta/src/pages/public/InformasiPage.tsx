import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  TrendingUp,
  Search,
  Tag,
} from 'lucide-react';

export const InformasiPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState('Semua');

  const articles = [
    {
      id: 'art-1',
      title: 'Pemerintah Alokasikan 40% Belanja Dinas Pengadaan Produk UMKM Melalui e-Katalog Lokal',
      date: '18 Oktober 2026',
      category: 'Peluang Usaha (B2G)',
      summary: 'Dinas pemerintahan kini diwajibkan menyerap produk makanan rapat, seragam batik ber-NIB, dan cinderamata dari pelaku UMKM terverifikasi.',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      tag: 'B2G',
    },
    {
      id: 'art-2',
      title: 'Kiat Perajin Batik Lokal Tembus Pasar Ekspor dengan Sertifikasi Mutu & Pewarna Alami',
      date: '15 Oktober 2026',
      category: 'Kisah Inspiratif',
      summary: 'Perpaduan motif klasik dan teknologi kemasan modern menjadi kunci sukses menembus pasar pameran dagang internasional.',
      image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
      tag: 'Ekspor',
    },
    {
      id: 'art-3',
      title: 'Mudahnya Mengurus NIB OSS & Sertifikasi Halal: Langkah Nyata Melindungi Usaha Anda',
      date: '11 Oktober 2026',
      category: 'Tips & Legalitas',
      summary: 'Ketahui mengapa nomor induk berusaha (NIB) adalah paspor wajib bagi setiap UMKM yang ingin mengakses modal bank dan pasar ritel modern.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      tag: 'Legalitas',
    },
    {
      id: 'art-4',
      title: 'Manfaat Bergabung dalam Ekosistem Djoeragan Nusantara: Dari Pelatihan Hingga Mitra B2B',
      date: '08 Oktober 2026',
      category: 'Komunitas & Jejaring',
      summary: 'Mengenal ekosistem kolaborasi yang mempertemukan pelaku UMKM 35 Kabupaten/Kota Jawa Tengah dengan pembeli korporasi dan fasilitator bisnis.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      tag: 'Komunitas',
    },
  ];

  const tags = ['Semua', 'B2G', 'Ekspor', 'Legalitas', 'Komunitas'];

  const filteredArticles = articles.filter(
    (a) => selectedTag === 'Semua' || a.tag === selectedTag
  );

  return (
    <div className="space-y-12 pb-20 bg-theme-berita min-h-screen">
      {/* Header with friendly tone */}
      <section className="bg-white/80 backdrop-blur-xs border-b border-neutral-200/80 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold border border-[#D90816]/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pusat Berita, Edukasi & Informasi Usaha</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
            Informasi Seputar Djoeragan Nusantara
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Temukan kabar terbaru seputar regulasi perizinan, tips praktis mengembangkan omzet bisnis, peluang kerja sama pemerintah, dan kisah sukses sobat wirausaha lokal.
          </p>

          {/* Filter pills */}
          <div className="flex justify-center flex-wrap gap-2 pt-3">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedTag === t
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {t === 'Semua' ? 'Semua Topik' : t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <img src={art.image} alt={art.title} className="w-full aspect-16/10 object-cover" />
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="font-bold text-[#D90816]">{art.category}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      {art.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-neutral-900 leading-snug hover:text-[#D90816] transition cursor-pointer">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-neutral-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400">Baca: 3 menit</span>
                <span className="font-bold text-[#D90816] hover:underline flex items-center gap-0.5 cursor-pointer">
                  Baca Selengkapnya <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
