import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Quote,
  CheckCircle2,
  Bookmark,
  MessageCircle,
} from 'lucide-react';
import { INITIAL_ARTICLES } from '../../data/articleData';
import { useApp } from '../../context/AppContext';
import { BatikParang, BatikDivider } from '../../components/common/BatikOrnament';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useApp();

  const article = INITIAL_ARTICLES.find(
    (a) => a.id === id || a.slug === id
  );

  const relatedArticles = INITIAL_ARTICLES.filter((a) => a.id !== article?.id).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan artikel berhasil disalin ke clipboard!', 'success');
    }
  };

  const handleShareWA = () => {
    if (!article) return;
    const text = encodeURIComponent(`Baca artikel menarik: "${article.title}" di Ruang UMKM Surakarta: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#1C1917]">Artikel Tidak Ditemukan</h2>
        <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto leading-relaxed">
          Kabar atau informasi yang Anda cari mungkin telah dipindahkan atau tautan tidak valid.
        </p>
        <Link
          to="/informasi"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pusat Informasi</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#78716C] flex-wrap">
          <Link to="/" className="hover:text-[#1C1917] transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <Link to="/informasi" className="hover:text-[#1C1917] transition">Informasi & Edukasi</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <span className="text-[#8C5835] font-medium">{article.category}</span>
        </nav>
      </div>

      {/* Main Editorial Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[#B81D24]/10 text-[#98141A] text-xs font-bold border border-[#B81D24]/20">
              {article.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#1C1917] text-[#FAF7F2] text-xs font-bold border border-[#C5A059]/40">
              Topik: {article.tag}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#1C1917] leading-tight tracking-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[#57534E] leading-relaxed font-serif italic border-l-4 border-[#C5A059] pl-4 py-1">
            "{article.summary}"
          </p>

          {/* Meta Info & Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-[#E7DFD5] py-3 text-xs text-[#78716C]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-[#1C1917]">
                <User className="w-3.5 h-3.5 text-[#8C5835]" />
                {article.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
                {article.readTime}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWA}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold flex items-center gap-1 transition"
                title="Bagikan via WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg bg-white border border-[#D6CEC2] text-[#57534E] hover:border-[#1C1917] transition"
                title="Salin Tautan"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-sm aspect-16/9 bg-stone-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 h-full w-48 pointer-events-none opacity-20 hidden sm:block">
            <BatikParang className="w-full h-full" color="#C5A059" opacity={0.25} />
          </div>
        </div>

        {/* Article Body */}
        <div className="card-heritage p-6 sm:p-10 space-y-6 text-[#44403C] text-sm sm:text-base leading-relaxed">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Editorial Quote Box */}
          {article.quotes && (
            <div className="p-6 rounded-2xl bg-[#F5EFEB] border-l-4 border-[#98141A] my-6 space-y-2">
              <Quote className="w-6 h-6 text-[#98141A]" />
              <blockquote className="text-base sm:text-lg font-serif italic text-[#1C1917] font-semibold">
                "{article.quotes}"
              </blockquote>
              <span className="text-xs text-[#8C5835] font-bold block pt-1">
                — {article.author}
              </span>
            </div>
          )}

          {/* Key Takeaways */}
          {article.keyPoints && article.keyPoints.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3 mt-6">
              <h4 className="font-serif font-extrabold text-base text-[#1C1917] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Poin-Poin Penting Bagi Pelaku Usaha:</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#57534E]">
                {article.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link
            to="/informasi"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D6CEC2] bg-white text-xs font-bold text-[#1C1917] hover:border-[#C5A059] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Semua Artikel Informasi</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-[#292524] transition shadow-xs"
          >
            <Share2 className="w-4 h-4 text-[#C5A059]" />
            <span>Bagikan Artikel</span>
          </button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-12 space-y-6">
            <BatikDivider />
            <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-[#1C1917]">
              Artikel & Kabar Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/informasi/${rel.id}`}
                  className="card-heritage overflow-hidden flex flex-col justify-between group hover:border-[#C5A059] transition"
                >
                  <img src={rel.image} alt={rel.title} className="w-full aspect-16/10 object-cover group-hover:scale-105 transition duration-300" />
                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-bold text-[#8C5835] block">{rel.category}</span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] line-clamp-2 group-hover:text-[#98141A] transition">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

