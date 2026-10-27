import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Target, Users, Award, FileText, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const districtsData = [
    { name: 'Kecamatan Laweyan', focus: 'Sentra Batik Tulis Tradisional & Pewarnaan Alami', count: '410+ UMKM' },
    { name: 'Kecamatan Pasar Kliwon', focus: 'Batik Kauman, Aneka Camilan Khas, & Kerajinan Kriya', count: '380+ UMKM' },
    { name: 'Kecamatan Banjarsari', focus: 'Kriya Tembaga, Busana Kontemporer & Kuliner Modern', count: '310+ UMKM' },
    { name: 'Kecamatan Jebres', focus: 'Inovasi Mahasiswa, Produk Olahan Madu & Pertanian Urban', count: '240+ UMKM' },
    { name: 'Kecamatan Serengan', focus: 'Sentra Serabi Notosuman Legendaris & Makanan Basah', count: '140+ UMKM' },
  ];

  return (
    <div className="space-y-16 pb-20 bg-theme-tentang min-h-screen">
      {/* Editorial Header with architectural identity */}
      <section className="bg-white/75 backdrop-blur-xs border-b border-neutral-200/80 py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-semibold tracking-wide border border-[#D90816]/15">
            <span>Profil Ekosistem & Landasan Layanan</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] tracking-tight">
            Ruang Digital Kolaboratif UMKM Surakarta
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Platform pemberdayaan ekonomi kerakyatan Kota Solo yang mengintegrasikan aspek legalitas (NIB Permendag 19/2026), standarisasi mutu, literasi digital QRIS, hingga jembatan pengadaan belanja publik pemerintah.
          </p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDEBEC] text-[#D90816] flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900">Visi Utama</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Menjadikan UMKM Kota Surakarta berdaya saing global, mandiri secara teknologi, memiliki legalitas usaha yang kuat, serta menjadi tuan rumah di tanah sendiri melalui partisipasi aktif dalam belanja pemerintah dan pasar modern.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900">Misi Strategis</h2>
            <ul className="text-sm text-neutral-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D90816] mt-2 shrink-0"></span>
                <span>Memfasilitasi kepemilikan NIB dan sertifikasi mutu halal, SNI, serta Batik Mark.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D90816] mt-2 shrink-0"></span>
                <span>Membuka akses pasar fisik (kios stasiun, smart vending machine) dan digital (QRIS terpadu).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D90816] mt-2 shrink-0"></span>
                <span>Mendorong belanja dinas daerah dan B2B melalui etalase e-Katalog LKPP lokal Surakarta.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5 Kecamatan Sebaran UMKM Surakarta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#D90816] uppercase tracking-wider">Sebaran Wilayah</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Klaster UMKM di 5 Kecamatan Surakarta
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Setiap penjuru kota memiliki keunikan budaya dan spesialisasi produk lokal tersendiri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {districtsData.map((d) => (
            <div
              key={d.name}
              className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-[#D90816] transition-all space-y-2"
            >
              <div className="flex items-center gap-1.5 text-[#D90816]">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold text-neutral-900">{d.name}</span>
              </div>
              <p className="text-xs text-neutral-500 leading-snug">{d.focus}</p>
              <p className="text-xs font-extrabold text-neutral-800 pt-1">{d.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Regulasi & Tata Kelola */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#171717] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-[#D90816]/30 text-[#ff4d5a] text-xs font-bold border border-[#D90816]/40">
              Kepatuhan Hukum & Transparansi
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">Kepatuhan Terhadap Permendag 19/2026</h3>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              Platform beroperasi dengan komitmen keterbukaan biaya, verifikasi ketat NIB/OSS, jaminan hak konsumen, serta SLA pengaduan &lt;24 jam untuk melindungi setiap pihak yang bertransaksi.
            </p>
          </div>
          <Link
            to="/daftar"
            className="px-8 py-3.5 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shrink-0"
          >
            Pelajari Pendaftaran Mitra
          </Link>
        </div>
      </section>
    </div>
  );
};
