import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { BatikParang } from '../../components/common/BatikOrnament';
import { INITIAL_ARTICLES } from '../../data/articleData';

export const InformasiPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState('Semua');

  const tags = ['Semua', 'B2G', 'Ekspor', 'Legalitas', 'Komunitas'];

  const filteredArticles = INITIAL_ARTICLES.filter(
    (a) => selectedTag === 'Semua' || a.tag === selectedTag
  );

  return (
    <div className="space-y-12 pb-20 bg-theme-berita min-h-screen">
      {/* Header with Square Grid, Parang ornament, & Faint Artisan Photo */}
      <section className="relative overflow-hidden bg-transparent border-b border-[#E7DFD5] bg-heritage-artisan-watermark py-14 sm:py-16">
        <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none opacity-40 hidden md:block">
          <BatikParang className="h-full w-full" color="#C5A059" opacity={0.12} />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B81D24]/10 text-[#98141A] text-xs font-bold border border-[#B81D24]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Pusat Wawasan, Edukasi & Kabar Usaha</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#1C1917] tracking-tight">
            Informasi & Edukasi Ruang UMKM Surakarta
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Temukan kabar terbaru seputar regulasi perizinan, tips praktis mengembangkan omzet bisnis, peluang kerja sama pemerintah, dan kisah sukses sobat wirausaha lokal Kota Solo.
          </p>

          {/* Filter pills */}
          <div className="flex justify-center flex-wrap gap-2 pt-3">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedTag === t
                    ? 'bg-[#1C1917] text-[#FAF7F2] border border-[#C5A059] shadow-xs'
                    : 'bg-white border border-[#D6CEC2] text-[#57534E] hover:bg-[#FAF7F2]'
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
              className="card-heritage overflow-hidden flex flex-col justify-between group hover:border-[#C5A059] transition"
            >
              <div>
                <Link to={`/informasi/${art.id}`} className="block overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full aspect-16/10 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#78716C]">
                    <span className="font-bold text-[#8C5835]">{art.category}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      {art.date}
                    </span>
                  </div>
                  <Link to={`/informasi/${art.id}`} className="block">
                    <h3 className="font-serif font-extrabold text-lg text-[#1C1917] leading-snug group-hover:text-[#98141A] transition">
                      {art.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#E7DFD5] mt-4 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#A8A29E]">{art.readTime}</span>
                <Link
                  to={`/informasi/${art.id}`}
                  className="font-bold text-[#98141A] hover:underline flex items-center gap-0.5"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

