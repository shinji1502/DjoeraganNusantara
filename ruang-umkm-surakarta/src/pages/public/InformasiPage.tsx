import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { INITIAL_ARTICLES } from '../../data/articleData';

export const InformasiPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState('Semua');

  const tags = ['Semua', 'B2G', 'Ekspor', 'Legalitas', 'Komunitas'];

  const filteredArticles = INITIAL_ARTICLES.filter(
    (a) => selectedTag === 'Semua' || a.tag === selectedTag
  );

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 bg-theme-berita min-h-screen">
      {/* Editorial Header — Seragam dengan Akses Bertumbuh (Master Reference) */}
      <section className="akses-hero overflow-hidden py-10 sm:py-14">
        {/* Background photo pengrajin batik — object-fit: cover dengan object-position terkalibrasi */}
        <img
          src="/images/solo_umkm_artisan.jpg"
          alt="Informasi & Edukasi Djoeragan Nusantara"
          className="akses-hero-img"
        />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-3.5 relative z-10 w-full">
          <h1
            style={{ textShadow: '0 1px 14px rgba(255, 255, 255, 0.95), 0 0 2px rgba(255, 255, 255, 0.8)' }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#292525]"
          >
            Informasi & Edukasi <span className="text-[#B51E26]">Djoeragan Nusantara</span>
          </h1>
          <p
            style={{ textShadow: '0 1px 12px rgba(255, 255, 255, 0.9)' }}
            className="text-sm sm:text-base text-[#2B2118] font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Temukan kabar terbaru seputar regulasi perizinan, tips praktis mengembangkan omzet bisnis, peluang kerja sama pemerintah, dan kisah sukses sobat wirausaha lokal Kota Solo.
          </p>

          {/* Filter pills — Konsisten dengan button styling Akses Bertumbuh */}
          <div className="flex justify-center flex-wrap gap-2.5 pt-3">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedTag === t
                    ? 'bg-[#1C1917] text-[#FAF7F2] shadow-md border border-[#C5A059]'
                    : 'bg-white border border-[#D6CEC2] text-[#44403C] hover:bg-[#FAF7F2]'
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
                    <h3 className="font-extrabold text-lg text-[#1C1917] leading-snug group-hover:text-[#98141A] transition">
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

