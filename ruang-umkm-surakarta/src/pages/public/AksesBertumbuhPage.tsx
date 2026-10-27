import React, { useState } from 'react';
import {
  TrendingUp,
  Landmark,
  Handshake,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Users,
  ChevronRight,
  Building,
  Crown,
  Calculator,
  Send,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

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
    <div className="space-y-14 pb-24 bg-theme-beranda min-h-screen">
      {/* Editorial Header */}
      <section className="bg-white/80 backdrop-blur-xs border-b border-neutral-200/80 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold border border-[#D90816]/15">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ekspansi Skala Bisnis & Kemitraan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
            Akses Bertumbuh Djoeragan Nusantara
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Wadah kolaborasi terpadu untuk mengakselerasi UMKM menuju pasar yang lebih besar. Akses modal kredit perbankan, jalin kemitraan B2B antarbisnis, serta masuki pengadaan resmi pemerintah (B2G).
          </p>

          {/* Pillar Navigation Tabs */}
          <div className="flex justify-center flex-wrap gap-2 pt-4">
            <button
              onClick={() => setActiveTab('keuangan')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'keuangan'
                  ? 'bg-[#171717] text-white shadow-md'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>A. Keuangan & Modal</span>
            </button>

            <button
              onClick={() => setActiveTab('b2b')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'b2b'
                  ? 'bg-[#171717] text-white shadow-md'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Handshake className="w-3.5 h-3.5 text-blue-400" />
              <span>B. Kerja Sama B2B</span>
            </button>

            <button
              onClick={() => setActiveTab('b2g')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'b2g'
                  ? 'bg-[#171717] text-white shadow-md'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>C. Pengadaan B2G</span>
            </button>

            <button
              onClick={() => setActiveTab('komersial')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'komersial'
                  ? 'bg-[#D90816] text-white shadow-md'
                  : 'bg-white border border-[#D90816]/30 text-[#D90816] hover:bg-red-50'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
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
              <span className="text-xs font-bold text-[#D90816] uppercase tracking-wider">Pilar A</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-1">
                Akses Keuangan, Permodalan & Investasi
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
                Menghubungkan UMKM dengan fasilitas Kredit Usaha Rakyat (KUR) bunga rendah dan jaringan investor terpercaya tanpa agunan yang memberatkan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Financial Options Cards */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-neutral-900">
                  Kredit Usaha Rakyat (KUR) Bersubsidi Pemerintah
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Pinjaman modal kerja dan investasi bagi pelaku UMKM dengan subsidi bunga pemerintah (bunga efektif ~6% per tahun). Cocok untuk penambahan stok barang, sewa tempat, atau pembelian mesin produksi.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="px-2.5 py-1 rounded-full bg-neutral-100 font-semibold text-neutral-700">Bank Jateng</span>
                  <span className="px-2.5 py-1 rounded-full bg-neutral-100 font-semibold text-neutral-700">BRI</span>
                  <span className="px-2.5 py-1 rounded-full bg-neutral-100 font-semibold text-neutral-700">BNI</span>
                  <span className="px-2.5 py-1 rounded-full bg-neutral-100 font-semibold text-neutral-700">Mandiri</span>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-neutral-900">
                  Akses Investasi & Pembiayaan Bagi Hasil (Equity)
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Bagi UMKM yang memiliki produk inovatif dan pertumbuhan tinggi (high growth), Djoeragan Nusantara mempertemukan Anda dengan angel investor dan lembaga pembiayaan syariah tanpa beban utang bunga berbunga.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pendampingan penyusunan pitch deck & laporan keuangan gratis</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Loan Simulator Calculator */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#D90816]" />
                <h3 className="font-extrabold text-base text-neutral-900">Simulasi Angsuran KUR Mitra</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Plafon Modal:</span>
                    <span className="text-[#D90816] font-extrabold">{formatRupiah(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={5000000}
                    max={100000000}
                    step={5000000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#D90816] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>Rp 5 Juta</span>
                    <span>Rp 100 Juta</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Jangka Waktu (Tenor):</span>
                    <span className="text-neutral-900">{tenorMonths} Bulan</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 12, 24, 36].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTenorMonths(m)}
                        className={`py-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                          tenorMonths === m
                            ? 'bg-[#171717] text-white border-black'
                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {m} Bln
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Result Box */}
                <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-neutral-200 space-y-2">
                  <div className="flex justify-between text-[11px] text-neutral-500">
                    <span>Estimasi Bunga Subsidi:</span>
                    <span>~6% per tahun</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-neutral-200">
                    <span className="font-bold text-neutral-700">Estimasi Angsuran / Bulan:</span>
                    <strong className="text-base font-extrabold text-[#D90816]">
                      {formatRupiah(monthlyInstallment)}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Permohonan konsultasi permodalan Anda telah diteruskan ke fasilitator bank mitra.', 'success')}
                  className="w-full py-3 rounded-full bg-[#D90816] text-white font-bold hover:bg-[#b80512] transition shadow-md shadow-[#D90816]/20 cursor-pointer"
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
              <span className="text-xs font-bold text-[#D90816] uppercase tracking-wider">Pilar B</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-1">
                Kerja Sama Antarbisnis (B2B Matching)
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
                Memfasilitasi kerja sama langsung antarsesama pelaku usaha. Mengatasi keterbatasan kapasitas produksi dan membuka saluran rantai pasok lokal.
              </p>
            </div>
          </div>

          {/* Example Cases from Prompt */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  Kebutuhan Produksi
                </div>
                <h3 className="font-extrabold text-base text-neutral-900 leading-snug">
                  Mitra Penjahit Konveksi 1.000 Potong Batik
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Pemilik usaha batik butuh mitra penjahit untuk menyelesaikan pesanan seragam korporasi sebanyak 1.000 potong dalam tempo 30 hari.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">Batik Danar Solo</span>
                <button
                  onClick={() => showToast('Menghubungkan ke kontak pemilik pesanan B2B...', 'info')}
                  className="font-bold text-[#D90816] hover:underline"
                >
                  Ajukan Mitra &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  Pasokan Bahan Baku
                </div>
                <h3 className="font-extrabold text-base text-neutral-900 leading-snug">
                  Pasokan Gula Kelapa Kristal 3 Ton / Bulan
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Produsen minuman serbat & kecap mencari koperasi penderes kelapa Banyumas untuk kontrak pasokan jangka panjang berstandar mutu.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">Industri Pangan Jateng</span>
                <button
                  onClick={() => showToast('Menghubungkan ke kontak pemilik pesanan B2B...', 'info')}
                  className="font-bold text-[#D90816] hover:underline"
                >
                  Ajukan Pasokan &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                  Konsolidasi Ekspor
                </div>
                <h3 className="font-extrabold text-base text-neutral-900 leading-snug">
                  Kriya Ukir & Wayang Mini untuk Ekspor Jepang
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Agregator ekspor membuka kuota bagi 5 perajin seni ukir tembaga dan wayang mini bersertifikat untuk pengiriman rutin ke Tokyo.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">Nusantara Trade Hub</span>
                <button
                  onClick={() => showToast('Menghubungkan ke kurator ekspor...', 'info')}
                  className="font-bold text-[#D90816] hover:underline"
                >
                  Ikut Kurasi &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Form to Post B2B Requirement */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-xs space-y-6 max-w-2xl mx-auto">
            <div className="space-y-1 text-center">
              <h3 className="font-extrabold text-lg text-neutral-900">
                Punya Kebutuhan atau Peluang Kerja Sama Bisnis?
              </h3>
              <p className="text-xs text-neutral-500">
                Pasang pengumuman kebutuhan produksi Anda untuk ditemukan oleh ribuan anggota UMKM Djoeragan Nusantara.
              </p>
            </div>

            <form onSubmit={handleB2bSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Judul Kebutuhan Kerja Sama *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Butuh penjahit 500 potong busana muslim..."
                  value={b2bTitle}
                  onChange={(e) => setB2bTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Kategori Kemitraan
                  </label>
                  <select
                    value={b2bType}
                    onChange={(e) => setB2bType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                  >
                    <option value="Mencari Penjahit / Subkontraktor">Mencari Penjahit / Subkontraktor</option>
                    <option value="Pasokan Bahan Baku">Pasokan Bahan Baku</option>
                    <option value="Peluang Ekspor & Agregator">Peluang Ekspor & Agregator</option>
                    <option value="Distribusi & Reseller">Distribusi & Reseller</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Kontak WhatsApp Penanggung Jawab *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={b2bContact}
                    onChange={(e) => setB2bContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Rincian Spesifikasi & Syarat
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan jumlah pesanan, batas waktu, dan kualifikasi yang dicari..."
                  value={b2bDesc}
                  onChange={(e) => setB2bDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#171717] text-white font-bold hover:bg-neutral-800 transition cursor-pointer"
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
              <span className="text-xs font-bold text-[#D90816] uppercase tracking-wider">Pilar C</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-1">
                Peluang Belanja Pemerintah (B2G e-Katalog LKPP)
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
                Menjembatani produk UMKM yang telah ber-NIB, halal, dan terverifikasi untuk menjadi penyedia resmi kebutuhan rapat, seminar, dan pengadaan instansi kedinasan.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Peluang Belanja Rutin Pemerintah
              </span>
              <h3 className="text-2xl font-extrabold text-neutral-900 leading-snug">
                Pemerintah Daerah Membutuhkan Produk Lokal Bersertifikat
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Contoh: Dinas Pemerintah Daerah membutuhkan pengadaan seragam batik motif daerah sebanyak 500 potong atau konsumsi snack serabi dan getuk untuk acara formal. Melalui etalase e-Katalog Lokal, dinas langsung membeli dari UMKM terdaftar yang sudah terverifikasi admin.
              </p>
              
              <div className="space-y-2 pt-2 text-xs text-neutral-700">
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

            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FAF8F7] border border-neutral-200 space-y-4">
              <h4 className="font-extrabold text-sm text-neutral-900">
                Daftar Sebagai Penyedia Pengadaan (B2G)
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Tim Djoeragan Nusantara membantu kurasi berkas dan onboarding etalase UMKM ke sistem LKPP pengadaan pemerintah.
              </p>
              <button
                onClick={() => showToast('Formulir onboarding pengadaan pemerintah dibuka! Tim kurator LKPP akan memverifikasi berkas NIB Anda.', 'info')}
                className="w-full py-3 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-xs cursor-pointer"
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
              <span className="text-xs font-bold text-[#D90816] uppercase tracking-wider">Fasilitas Khusus</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-1">
                Ruang Komersial Berbayar
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
                Layanan promosi dan fasilitas komersial berbayar bagi usaha yang ingin meningkatkan sorotan produk, studio foto profesional, dan ruang kerja premium.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="p-2.5 rounded-xl bg-red-50 text-[#D90816] inline-block font-bold">
                  <Crown className="w-5 h-5" />
                </span>
                <h4 className="font-bold text-base text-neutral-900">Virtual Booth Premium</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Penempatan produk di baris teratas etalase katalog & beranda website dengan lencana "Official Merchant".
                </p>
              </div>
              <span className="text-[11px] text-neutral-400">Tarif: Paket Bulanan</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 inline-block font-bold">
                  <Building className="w-5 h-5" />
                </span>
                <h4 className="font-bold text-base text-neutral-900">Studio Foto & Video UMKM</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Sewa ruang studio foto berlampu studio lengkap beserta fotografer profesional untuk katalog produk Anda.
                </p>
              </div>
              <span className="text-[11px] text-neutral-400">Tarif: Per Sesi / Produk</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600 inline-block font-bold">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h4 className="font-bold text-base text-neutral-900">Slot Banner Iklan Eksklusif</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Tampilkan banner promo brand Anda di beranda utama website yang dikunjungi ribuan calon pembeli setiap hari.
                </p>
              </div>
              <span className="text-[11px] text-neutral-400">Tarif: Slot Mingguan / Event</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 inline-block font-bold">
                  <Users className="w-5 h-5" />
                </span>
                <h4 className="font-bold text-base text-neutral-900">Coworking & Ruang Temu Klien</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Akses ruang rapat representatif di sentra hub Djoeragan Nusantara untuk negosiasi kerja sama bisnis.
                </p>
              </div>
              <span className="text-[11px] text-neutral-400">Tarif: Reservasi Per Jam</span>
            </div>
          </div>

          {/* Inquiry Box on Commercial Space */}
          <div className="bg-[#171717] rounded-3xl p-8 sm:p-10 text-white max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#D90816]/30 text-[#ff4d5a] text-xs font-bold border border-[#D90816]/40">
                Peminatan Ruang Komersial
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">Tertarik Menggunakan Fasilitas Komersial?</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Mekanisme dan rincian tarif komersial sedang difinalisasi. Daftarkan peminatan usaha Anda untuk mendapatkan promo tarif perdana (Early Bird).
              </p>
            </div>

            <form onSubmit={handleCommercialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 block mb-1 font-bold">Pilih Fasilitas</label>
                <select
                  value={commercialPackage}
                  onChange={(e) => setCommercialPackage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-[#D90816]"
                >
                  <option value="Virtual Booth Premium">Virtual Booth Premium</option>
                  <option value="Studio Foto & Video UMKM">Studio Foto & Video UMKM</option>
                  <option value="Slot Banner Iklan Eksklusif">Slot Banner Iklan Eksklusif</option>
                  <option value="Coworking & Ruang Temu Klien">Coworking & Ruang Temu Klien</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-300 block mb-1 font-bold">Nama Toko / Usaha *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kriya Nusantara"
                    value={commercialStore}
                    onChange={(e) => setCommercialStore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-[#D90816]"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1 font-bold">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={commercialPhone}
                    onChange={(e) => setCommercialPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-[#D90816]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#D90816] text-white font-bold hover:bg-[#b80512] transition shadow-md shadow-[#D90816]/30 cursor-pointer"
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
