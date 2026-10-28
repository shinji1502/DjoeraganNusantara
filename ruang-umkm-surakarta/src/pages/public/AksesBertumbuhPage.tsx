import React, { useState } from 'react';
import {
  TrendingUp,
  Landmark,
  Handshake,
  Building2,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Users,
  Building,
  Crown,
  Calculator,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { BatikParang, BatikDivider } from '../../components/common/BatikOrnament';

export const AksesBertumbuhPage: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'keuangan' | 'b2b' | 'b2g' | 'komersial'>('keuangan');

  // Interactive Loan Calculator state
  const [loanAmount, setLoanAmount] = useState<number>(25000000);
  const [tenorMonths, setTenorMonths] = useState<number>(12);

  // B2B Inquiry State
  const [b2bTitle, setB2bTitle] = useState('');
  const [b2bType, setB2bType] = useState('Mencari Penjahit / Subkontraktor');
  const [b2bContact, setB2bContact] = useState('');
  const [b2bDesc, setB2bDesc] = useState('');

  // Commercial Space interest form
  const [commercialPackage, setCommercialPackage] = useState('Virtual Booth Premium');
  const [commercialStore, setCommercialStore] = useState('');
  const [commercialPhone, setCommercialPhone] = useState('');

  // KUR subsidized interest ~6% per year
  const interestRateYearly = 0.06;
  const totalInterest = loanAmount * (interestRateYearly * (tenorMonths / 12));
  const totalRepayment = loanAmount + totalInterest;
  const monthlyInstallment = Math.round(totalRepayment / tenorMonths);

  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bTitle || !b2bContact) {
      showToast('Harap lengkapi judul kebutuhan dan kontak WhatsApp.', 'error');
      return;
    }
    showToast(
      `Peluang kerja sama B2B "${b2bTitle}" berhasil dikirim ke Papan Kemitraan! Tim kurator akan memvalidasi data Anda.`,
      'success'
    );
    setB2bTitle('');
    setB2bContact('');
    setB2bDesc('');
  };

  const handleCommercialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commercialStore || !commercialPhone) {
      showToast('Harap lengkapi nama usaha dan nomor telepon.', 'error');
      return;
    }
    showToast(
      `Peminatan "${commercialPackage}" untuk "${commercialStore}" telah dicatat. Tim komersial Djoeragan Nusantara akan mengirimkan proposal tarif resmi ke nomor Anda.`,
      'success'
    );
    setCommercialStore('');
    setCommercialPhone('');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 bg-theme-beranda min-h-screen">
      {/* Editorial Header with Square Grid, Parang watermark, & Faint Artisan Photo */}
      <section className="relative overflow-hidden bg-transparent border-b border-[#E7DFD5] bg-heritage-artisan-watermark py-14 sm:py-16">
        <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none opacity-40 hidden md:block">
          <BatikParang className="h-full w-full" color="#C5A059" opacity={0.12} />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B81D24]/10 text-[#98141A] text-xs font-bold border border-[#B81D24]/20">
            <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Ekspansi Skala Bisnis & Kemitraan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#1C1917] tracking-tight">
            Akses Bertumbuh Djoeragan Nusantara
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Wadah kolaborasi terpadu untuk mengakselerasi UMKM menuju pasar yang lebih besar. Akses modal kredit perbankan, jalin kemitraan B2B antarbisnis, serta masuki pengadaan resmi pemerintah (B2G).
          </p>

          {/* Pillar Navigation Tabs */}
          <div className="flex justify-center flex-wrap gap-2.5 pt-4">
            <button
              onClick={() => setActiveTab('keuangan')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'keuangan'
                  ? 'bg-[#1C1917] text-[#FAF7F2] shadow-md border border-[#C5A059]'
                  : 'bg-white border border-[#D6CEC2] text-[#44403C] hover:bg-[#FAF7F2]'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>A. Keuangan & Modal</span>
            </button>

            <button
              onClick={() => setActiveTab('b2b')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'b2b'
                  ? 'bg-[#1C1917] text-[#FAF7F2] shadow-md border border-[#C5A059]'
                  : 'bg-white border border-[#D6CEC2] text-[#44403C] hover:bg-[#FAF7F2]'
              }`}
            >
              <Handshake className="w-3.5 h-3.5 text-[#8C5835]" />
              <span>B. Kerja Sama B2B</span>
            </button>

            <button
              onClick={() => setActiveTab('b2g')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'b2g'
                  ? 'bg-[#1C1917] text-[#FAF7F2] shadow-md border border-[#C5A059]'
                  : 'bg-white border border-[#D6CEC2] text-[#44403C] hover:bg-[#FAF7F2]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>C. Pengadaan B2G</span>
            </button>

            <button
              onClick={() => setActiveTab('komersial')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'komersial'
                  ? 'bg-[#B81D24] text-white shadow-md'
                  : 'bg-white border border-[#B81D24]/30 text-[#98141A] hover:bg-[#B81D24]/5'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Ruang Komersial Berbayar</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION A: KEUANGAN & PERMODALAN */}
      {(activeTab === 'keuangan' || activeTab === undefined) && (
        <section id="keuangan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#8C5835] uppercase tracking-wider">Pilar A</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917] mt-1">
                Akses Keuangan, Permodalan & Investasi
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-xl">
                Menghubungkan UMKM dengan fasilitas Kredit Usaha Rakyat (KUR) bunga rendah dan jaringan investor terpercaya tanpa agunan yang memberatkan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Financial Options Cards */}
            <div className="lg:col-span-7 space-y-5">
              <div className="card-heritage p-6 sm:p-7 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 text-[#8C5835] flex items-center justify-center font-bold border border-[#C5A059]/30">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-extrabold text-xl text-[#1C1917]">
                  Kredit Usaha Rakyat (KUR) Bersubsidi Pemerintah
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Pinjaman modal kerja dan investasi bagi pelaku UMKM dengan subsidi bunga pemerintah (bunga efektif ~6% per tahun). Cocok untuk penambahan stok barang, sewa tempat, atau pembelian mesin produksi.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] font-semibold text-[#44403C]">Bank Jateng</span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] font-semibold text-[#44403C]">BRI</span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] font-semibold text-[#44403C]">BNI</span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] font-semibold text-[#44403C]">Mandiri</span>
                </div>
              </div>

              <div className="card-heritage p-6 sm:p-7 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#B81D24]/10 text-[#98141A] flex items-center justify-center font-bold border border-[#B81D24]/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-extrabold text-xl text-[#1C1917]">
                  Akses Investasi & Pembiayaan Bagi Hasil (Equity)
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Bagi UMKM yang memiliki produk inovatif dan pertumbuhan tinggi (high growth), Djoeragan Nusantara mempertemukan Anda dengan angel investor dan lembaga pembiayaan syariah tanpa beban utang bunga berbunga.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pendampingan penyusunan pitch deck & laporan keuangan gratis</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Loan Simulator Calculator */}
            <div className="lg:col-span-5 card-heritage p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#8C5835]" />
                <h3 className="font-serif font-extrabold text-lg text-[#1C1917]">Simulasi Angsuran KUR Mitra</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-[#57534E]">Plafon Modal:</span>
                    <span className="text-[#98141A] font-extrabold text-sm">{formatRupiah(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={5000000}
                    max={100000000}
                    step={5000000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#B81D24] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#A8A29E] mt-1">
                    <span>Rp 5 Juta</span>
                    <span>Rp 100 Juta</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-[#57534E]">Jangka Waktu (Tenor):</span>
                    <span className="text-[#1C1917]">{tenorMonths} Bulan</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 12, 24, 36].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTenorMonths(m)}
                        className={`py-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                          tenorMonths === m
                            ? 'bg-[#1C1917] text-[#FAF7F2] border-[#C5A059]'
                            : 'border-[#D6CEC2] text-[#57534E] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {m} Bln
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Result Box */}
                <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] space-y-2">
                  <div className="flex justify-between text-[11px] text-[#78716C]">
                    <span>Estimasi Bunga Subsidi:</span>
                    <span>~6% per tahun</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-[#E7DFD5]">
                    <span className="font-bold text-[#1C1917]">Estimasi Angsuran / Bulan:</span>
                    <strong className="text-base font-extrabold text-[#98141A]">
                      {formatRupiah(monthlyInstallment)}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Permohonan konsultasi permodalan Anda telah diteruskan ke fasilitator bank mitra.', 'success')}
                  className="w-full py-3 rounded-xl bg-[#B81D24] text-white font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20 cursor-pointer"
                >
                  Ajukan Konsultasi Bank Mitra
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION B: B2B (BUSINESS TO BUSINESS) */}
      {(activeTab === 'b2b' || activeTab === undefined) && (
        <section id="b2b" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#8C5835] uppercase tracking-wider">Pilar B</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917] mt-1">
                Kerja Sama Antarbisnis (B2B Matching)
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-xl">
                Memfasilitasi kerja sama langsung antarsesama pelaku usaha. Mengatasi keterbatasan kapasitas produksi dan membuka saluran rantai pasok lokal.
              </p>
            </div>
          </div>

          {/* Example Cases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-heritage p-6 sm:p-7 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#8C5835] text-[10px] font-bold border border-[#C5A059]/30">
                  Kebutuhan Produksi
                </div>
                <h3 className="font-serif font-extrabold text-lg text-[#1C1917] leading-snug">
                  Mitra Penjahit Konveksi 1.000 Potong Batik
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Pemilik usaha batik butuh mitra penjahit untuk menyelesaikan pesanan seragam korporasi sebanyak 1.000 potong dalam tempo 30 hari.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E7DFD5] flex items-center justify-between text-xs">
                <span className="text-[#78716C] font-medium">Batik Danar Solo</span>
                <button
                  onClick={() => showToast('Menghubungkan ke kontak pemilik pesanan B2B...', 'info')}
                  className="font-bold text-[#98141A] hover:underline"
                >
                  Ajukan Mitra &rarr;
                </button>
              </div>
            </div>

            <div className="card-heritage p-6 sm:p-7 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300/60">
                  Pasokan Bahan Baku
                </div>
                <h3 className="font-serif font-extrabold text-lg text-[#1C1917] leading-snug">
                  Pasokan Gula Kelapa Kristal 3 Ton / Bulan
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Produsen minuman serbat & kecap mencari koperasi penderes kelapa Banyumas untuk kontrak pasokan jangka panjang berstandar mutu.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E7DFD5] flex items-center justify-between text-xs">
                <span className="text-[#78716C] font-medium">Industri Pangan Jateng</span>
                <button
                  onClick={() => showToast('Menghubungkan ke kontak pemilik pesanan B2B...', 'info')}
                  className="font-bold text-[#98141A] hover:underline"
                >
                  Ajukan Pasokan &rarr;
                </button>
              </div>
            </div>

            <div className="card-heritage p-6 sm:p-7 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B81D24]/10 text-[#98141A] text-[10px] font-bold border border-[#B81D24]/20">
                  Konsolidasi Ekspor
                </div>
                <h3 className="font-serif font-extrabold text-lg text-[#1C1917] leading-snug">
                  Kriya Ukir & Wayang Mini untuk Ekspor Jepang
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Agregator ekspor membuka kuota bagi 5 perajin seni ukir tembaga dan wayang mini bersertifikat untuk pengiriman rutin ke Tokyo.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E7DFD5] flex items-center justify-between text-xs">
                <span className="text-[#78716C] font-medium">Nusantara Trade Hub</span>
                <button
                  onClick={() => showToast('Menghubungkan ke kurator ekspor...', 'info')}
                  className="font-bold text-[#98141A] hover:underline"
                >
                  Ikut Kurasi &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Form to Post B2B Requirement */}
          <div className="card-heritage p-8 sm:p-10 space-y-6 max-w-2xl mx-auto">
            <div className="space-y-1 text-center">
              <h3 className="font-serif font-extrabold text-xl text-[#1C1917]">
                Punya Kebutuhan atau Peluang Kerja Sama Bisnis?
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C]">
                Pasang pengumuman kebutuhan produksi Anda untuk ditemukan oleh ribuan anggota UMKM Djoeragan Nusantara.
              </p>
            </div>

            <form onSubmit={handleB2bSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1C1917] block mb-1">
                  Judul Kebutuhan Kerja Sama *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Butuh penjahit 500 potong busana muslim..."
                  value={b2bTitle}
                  onChange={(e) => setB2bTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#1C1917] block mb-1">
                    Kategori Kemitraan
                  </label>
                  <select
                    value={b2bType}
                    onChange={(e) => setB2bType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  >
                    <option value="Mencari Penjahit / Subkontraktor">Mencari Penjahit / Subkontraktor</option>
                    <option value="Pasokan Bahan Baku">Pasokan Bahan Baku</option>
                    <option value="Peluang Ekspor & Agregator">Peluang Ekspor & Agregator</option>
                    <option value="Distribusi & Reseller">Distribusi & Reseller</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1C1917] block mb-1">
                    Kontak WhatsApp Penanggung Jawab *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={b2bContact}
                    onChange={(e) => setB2bContact(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1C1917] block mb-1">
                  Rincian Spesifikasi & Syarat
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan jumlah pesanan, batas waktu, dan kualifikasi yang dicari..."
                  value={b2bDesc}
                  onChange={(e) => setB2bDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1C1917] text-[#FAF7F2] font-bold hover:bg-[#292524] transition cursor-pointer border border-[#C5A059]/40"
              >
                Kirim Pengumuman Kemitraan B2B
              </button>
            </form>
          </div>
        </section>
      )}

      {/* SECTION C: B2G (BUSINESS TO GOVERNMENT) */}
      {(activeTab === 'b2g' || activeTab === undefined) && (
        <section id="b2g" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#8C5835] uppercase tracking-wider">Pilar C</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917] mt-1">
                Peluang Belanja Pemerintah (B2G e-Katalog LKPP)
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-xl">
                Menjembatani produk UMKM yang telah ber-NIB, halal, dan terverifikasi untuk menjadi penyedia resmi kebutuhan rapat, seminar, dan pengadaan instansi kedinasan.
              </p>
            </div>
          </div>

          <div className="card-heritage p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300/70">
                Peluang Belanja Rutin Pemerintah
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917] leading-snug">
                Pemerintah Daerah Membutuhkan Produk Lokal Bersertifikat
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Contoh: Dinas Pemerintah Daerah membutuhkan pengadaan seragam batik motif daerah sebanyak 500 potong atau konsumsi snack serabi dan getuk untuk acara formal. Melalui etalase e-Katalog Lokal, dinas langsung membeli dari UMKM terdaftar yang sudah terverifikasi admin.
              </p>
              
              <div className="space-y-2 pt-2 text-xs text-[#44403C]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Wajib memiliki NIB aktif dari OSS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sertifikat Halal (untuk produk kuliner & konsumsi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Memenuhi ketentuan Tingkat Komponen Dalam Negeri (TKDN)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] space-y-4">
              <h4 className="font-serif font-extrabold text-base text-[#1C1917]">
                Daftar Sebagai Penyedia Pengadaan (B2G)
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Tim Djoeragan Nusantara membantu kurasi berkas dan onboarding etalase UMKM ke sistem LKPP pengadaan pemerintah.
              </p>
              <button
                onClick={() => showToast('Formulir onboarding pengadaan pemerintah dibuka! Tim kurator LKPP akan memverifikasi berkas NIB Anda.', 'info')}
                className="w-full py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition shadow-xs cursor-pointer"
              >
                Daftar Onboarding e-Katalog Lokal
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: RUANG KOMERSIAL BERBAYAR */}
      {(activeTab === 'komersial' || activeTab === undefined) && (
        <section id="ruang-komersial" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#8C5835] uppercase tracking-wider">Fasilitas Khusus</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917] mt-1">
                Ruang Komersial Berbayar
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-xl">
                Layanan promosi dan fasilitas komersial berbayar bagi usaha yang ingin meningkatkan sorotan produk, studio foto profesional, dan ruang kerja premium.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-heritage p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="p-2.5 rounded-xl bg-[#C5A059]/15 text-[#8C5835] inline-block font-bold border border-[#C5A059]/30">
                  <Crown className="w-5 h-5" />
                </span>
                <h4 className="font-serif font-bold text-base text-[#1C1917]">Virtual Booth Premium</h4>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Penempatan produk di baris teratas etalase katalog & beranda website dengan lencana "Official Merchant".
                </p>
              </div>
              <span className="text-[11px] text-[#78716C]">Tarif: Paket Bulanan</span>
            </div>

            <div className="card-heritage p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="p-2.5 rounded-xl bg-[#B81D24]/10 text-[#98141A] inline-block font-bold border border-[#B81D24]/20">
                  <Building className="w-5 h-5" />
                </span>
                <h4 className="font-serif font-bold text-base text-[#1C1917]">Studio Foto & Video UMKM</h4>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Sewa ruang studio foto berlampu studio lengkap beserta fotografer profesional untuk katalog produk Anda.
                </p>
              </div>
              <span className="text-[11px] text-[#78716C]">Tarif: Per Sesi / Produk</span>
            </div>

            <div className="card-heritage p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="p-2.5 rounded-xl bg-amber-50 text-amber-800 inline-block font-bold border border-amber-300/70">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h4 className="font-serif font-bold text-base text-[#1C1917]">Slot Banner Iklan Eksklusif</h4>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Tampilkan banner promo brand Anda di beranda utama website yang dikunjungi ribuan calon pembeli setiap hari.
                </p>
              </div>
              <span className="text-[11px] text-[#78716C]">Tarif: Slot Mingguan / Event</span>
            </div>

            <div className="card-heritage p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 inline-block font-bold border border-emerald-300/70">
                  <Users className="w-5 h-5" />
                </span>
                <h4 className="font-serif font-bold text-base text-[#1C1917]">Coworking & Ruang Temu Klien</h4>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Akses ruang rapat representatif di sentra hub Djoeragan Nusantara untuk negosiasi kerja sama bisnis.
                </p>
              </div>
              <span className="text-[11px] text-[#78716C]">Tarif: Reservasi Per Jam</span>
            </div>
          </div>

          {/* Inquiry Box on Commercial Space */}
          <div className="card-heritage bg-[#1C1917] rounded-3xl p-8 sm:p-10 text-white max-w-2xl mx-auto space-y-6 border border-[#C5A059]/40">
            <div className="text-center space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold border border-[#C5A059]/40">
                Peminatan Ruang Komersial
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-[#FAF7F2]">Tertarik Menggunakan Fasilitas Komersial?</h3>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Mekanisme dan rincian tarif komersial sedang difinalisasi. Daftarkan peminatan usaha Anda untuk mendapatkan promo tarif perdana (Early Bird).
              </p>
            </div>

            <form onSubmit={handleCommercialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#E7DFD5] block mb-1 font-bold">Pilih Fasilitas</label>
                <select
                  value={commercialPackage}
                  onChange={(e) => setCommercialPackage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#292524] border border-[#44403C] text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Virtual Booth Premium">Virtual Booth Premium</option>
                  <option value="Studio Foto & Video UMKM">Studio Foto & Video UMKM</option>
                  <option value="Slot Banner Iklan Eksklusif">Slot Banner Iklan Eksklusif</option>
                  <option value="Coworking & Ruang Temu Klien">Coworking & Ruang Temu Klien</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#E7DFD5] block mb-1 font-bold">Nama Toko / Usaha *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kriya Nusantara"
                    value={commercialStore}
                    onChange={(e) => setCommercialStore(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#292524] border border-[#44403C] text-[#FAF7F2] placeholder:text-[#78716C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="text-[#E7DFD5] block mb-1 font-bold">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={commercialPhone}
                    onChange={(e) => setCommercialPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#292524] border border-[#44403C] text-[#FAF7F2] placeholder:text-[#78716C] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#B81D24] text-white font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/30 cursor-pointer"
              >
                Daftar Peminatan Paket Komersial
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

