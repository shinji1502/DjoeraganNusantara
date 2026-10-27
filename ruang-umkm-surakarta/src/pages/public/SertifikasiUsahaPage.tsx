import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Building2,
  Send,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SertifikasiUsahaPage: React.FC = () => {
  const { showToast } = useApp();

  const [selectedService, setSelectedService] = useState<string>('NIB (Nomor Induk Berusaha)');
  const [applicantName, setApplicantName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kota Surakarta');
  const [notes, setNotes] = useState('');

  const services = [
    {
      id: 'nib',
      title: 'NIB (Nomor Induk Berusaha)',
      organizer: 'Kementerian Investasi / BKPM (OSS-RBA)',
      badge: 'Legalitas Utama',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      officialUrl: 'https://oss.go.id',
      duration: '1 Hari Kerja (Instan)',
      cost: 'Gratis (Usaha Mikro & Kecil)',
      desc: 'NIB adalah identitas resmi pelaku usaha di seluruh Indonesia. Berfungsi sebagai tanda daftar perusahaan (TDP), angka pengenal impor, dan akses kepabeanan dalam satu nomor.',
      requirements: [
        'KTP elektronik / NIK penanggung jawab',
        'Nomor WhatsApp dan email aktif',
        'Rincian modal usaha dan alamat tempat kegiatan usaha',
        'Mengetahui kode bidang usaha (KBLI) yang sesuai',
      ],
      stepGuide: 'Dapat diterbitkan langsung melalui sistem OSS daring atau dengan bantuan pendamping Djoeragan Nusantara.',
    },
    {
      id: 'halal',
      title: 'Sertifikasi Halal (BPJPH & MUI)',
      organizer: 'BPJPH Kemenag RI & Majelis Ulama Indonesia',
      badge: 'Wajib Produk Konsumsi',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      officialUrl: 'https://ptsp.halal.go.id',
      duration: '14 - 21 Hari Kerja',
      cost: 'Fasilitasi Gratis (Self-Declare) / Subsidi',
      desc: 'Jaminan kepatuhan syariat untuk produk pangan, minuman, obat tradisional, dan kosmetik. Meningkatkan kepercayaan konsumen dan membuka pintu masuk ritel modern.',
      requirements: [
        'Memiliki Nomor Induk Berusaha (NIB) aktif',
        'Daftar bahan baku dan bahan tambahan bersertifikat halal',
        'Proses pengolahan produk higienis bebas najis',
        'Manual Sistem Jaminan Produk Halal (SJPH)',
      ],
      stepGuide: 'Pengajuan melalui portal SiHalal BPJPH dengan pendamping PPH (Pendamping Proses Produk Halal).',
    },
    {
      id: 'bpom',
      title: 'Pengajuan BPOM & P-IRT',
      organizer: 'Badan Pengawas Obat & Makanan / Dinkes',
      badge: 'Standar Mutu Pangan',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      officialUrl: 'https://pom.go.id',
      duration: '14 - 30 Hari Kerja',
      cost: 'Sesuai regulasi PNBP daerah',
      desc: 'Izin edar resmi untuk produk makanan dan minuman olahan. Menjamin keamanan konsumsi pangan agar produk bebas dari bahan berbahaya dan layak didistribusikan secara luas.',
      requirements: [
        'Memiliki NIB dan sertifikat penyuluhan keamanan pangan (PKP)',
        'Denah lokasi dan alur proses produksi yang bersih',
        'Rancangan label kemasan sesuai ketentuan (komposisi, kedaluwarsa)',
        'Hasil uji laboratorium mutu pangan (untuk pangan berisiko)',
      ],
      stepGuide: 'Untuk skala rumah tangga menggunakan P-IRT via OSS/Dinkes; untuk skala industri melalui e-Registration BPOM.',
    },
    {
      id: 'hki',
      title: 'Hak Paten & Pendaftaran Merek (HKI)',
      organizer: 'DJKI Kementerian Hukum & HAM RI',
      badge: 'Perlindungan Aset Brand',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      officialUrl: 'https://dgip.go.id',
      duration: 'Masa Pengumuman Resmi 2 Bulan',
      cost: 'Tarif Khusus UMKM (Diskon PNBP)',
      desc: 'Lindungi nama usaha, logo brand, dan invensi ciptaan Anda agar tidak dijiplak atau diklaim pihak lain. Merek yang terdaftar menjadi aset tak berwujud yang bernilai tinggi.',
      requirements: [
        'KTP penanggung jawab & Surat Keterangan Usaha UMKM',
        'Contoh etiket logo / label merek dagang (format gambar jelas)',
        'Tanda tangan digital pemohon',
        'Daftar kelas barang atau jasa yang dimohonkan perlindungan',
      ],
      stepGuide: 'Diajukan secara online melalui sistem permohonan merek DJKI Kemenkumham.',
    },
    {
      id: 'jasa_dokumen',
      title: 'Jasa Kepengurusan Dokumen Usaha',
      organizer: 'Layanan Asistensi Djoeragan Nusantara',
      badge: 'Pendampingan Personal',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      officialUrl: '#konsultasi',
      duration: 'Pendampingan Fleksibel',
      cost: 'Konsultasi Dasar Bebas Biaya',
      desc: 'Bagi sobat UMKM yang merasa bingung mengisi formulir online atau belum sempat mengurus izin, fasilitator kami siap mendampingi langkah demi langkah hingga dokumen selesai.',
      requirements: [
        'Identitas KTP & usaha yang sedang berjalan',
        'Sampel produk fisik atau foto tempat usaha',
        'Komitmen melengkapi dokumen pendukung',
      ],
      stepGuide: 'Isi formulir peminatan di bawah ini, tim Djoeragan Nusantara akan menghubungi Anda.',
    },
  ];

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone || !storeName) {
      showToast('Harap lengkapi nama, nomor telepon, dan nama usaha.', 'error');
      return;
    }
    showToast(
      `Permintaan bantuan perizinan "${selectedService}" untuk "${storeName}" berhasil dikirim! Tim kami akan menghubungi Anda via WhatsApp.`,
      'success'
    );
    setApplicantName('');
    setStoreName('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="space-y-14 pb-20 bg-theme-pasar min-h-screen">
      {/* Header */}
      <section className="bg-white/80 backdrop-blur-xs border-b border-neutral-200/80 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold border border-[#D90816]/15">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pusat Layanan Legalitas & Perizinan Usaha</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
            Sertifikasi Usaha Djoeragan Nusantara
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Legalitas lengkap bikin usaha tenang, dipercaya pembeli, dan gampang tembus pasar modern. Kami menyediakan panduan syarat, alur pendaftaran, tautan resmi ke lembaga terkait, dan pendampingan personal.
          </p>
        </div>
      </section>

      {/* 5 Core Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D90816] uppercase tracking-wider">Layanan Tersedia</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Daftar Layanan Sertifikasi & Izin Usaha
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Pilih layanan yang dibutuhkan untuk melihat persyaratan dan tautan portal resmi lembaga negara.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header card */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${svc.badgeColor}`}>
                      {svc.badge}
                    </span>
                    <h3 className="font-extrabold text-lg text-neutral-900 mt-2 leading-snug">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">{svc.organizer}</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {svc.desc}
                </p>

                {/* Duration & Cost */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#FAF8F7] border border-neutral-100 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Estimasi Waktu:</span>
                    <strong className="text-neutral-800 text-[11px] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#D90816]" />
                      {svc.duration}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Biaya Layanan:</span>
                    <strong className="text-emerald-700 text-[11px] flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {svc.cost}
                    </strong>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <span className="text-xs font-bold text-neutral-800 block">
                    Dokumen & Persyaratan Utama:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-600">
                    {svc.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                {svc.officialUrl.startsWith('http') ? (
                  <a
                    href={svc.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 text-xs font-bold text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition"
                  >
                    <span>Buka Portal Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-[11px] text-neutral-500 italic">
                    Disediakan langsung oleh tim fasilitator
                  </span>
                )}

                <button
                  onClick={() => {
                    setSelectedService(svc.title);
                    document.getElementById('konsultasi')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition shadow-sm cursor-pointer"
                >
                  Ajukan Pendampingan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Process Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#D90816] uppercase tracking-wider">Alur Mudah</span>
            <h2 className="text-2xl font-extrabold text-neutral-900">
              4 Langkah Mudah Mengurus Legalitas Usaha
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-[#FAF8F7] border border-neutral-200 space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#D90816] text-white font-extrabold flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-neutral-900">Pilih Jenis Izin</h4>
              <p className="text-xs text-neutral-500">
                Tentukan sertifikasi yang paling dibutuhkan usaha Anda saat ini (mulai dari NIB OSS).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F7] border border-neutral-200 space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#D90816] text-white font-extrabold flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-neutral-900">Lengkapi Dokumen</h4>
              <p className="text-xs text-neutral-500">
                Siapkan KTP, foto produk, informasi bahan, atau etiket logo sesuai checklist.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F7] border border-neutral-200 space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#D90816] text-white font-extrabold flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-neutral-900">Bantuan Fasilitator</h4>
              <p className="text-xs text-neutral-500">
                Gunakan portal resmi atau manfaatkan bimbingan tim Djoeragan Nusantara.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F7] border border-neutral-200 space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h4 className="font-bold text-sm text-neutral-900">Sertifikat Terbit</h4>
              <p className="text-xs text-neutral-500">
                Izin resmi terbit dan produk Anda siap dipamerkan di katalog Djoeragan Nusantara!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation & Assistance Inquiry Form */}
      <section id="konsultasi" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Bimbingan Personal Gratis
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900">
              Formulir Bantuan & Pendampingan Sertifikasi
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Punya pertanyaan atau butuh dibimbing saat pengurusan dokumen? Isi data singkat di bawah ini, tim Djoeragan Nusantara akan segera membantu Anda.
            </p>
          </div>

          <form onSubmit={handleSubmitConsultation} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Layanan Sertifikasi yang Diminati *
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Nama Pemilik Usaha *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Nama Toko / Usaha *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dapur Serabi Notosuman"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Kabupaten / Kota Domisili
                </label>
                <input
                  type="text"
                  placeholder="Kota Surakarta / Kabupaten ..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Catatan / Kendala yang Dihadapi (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Ceritakan kendala Anda (misal: belum paham cara daftar akun OSS, belum punya uji lab, dsb)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shadow-lg shadow-[#D90816]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Permohonan Pendampingan</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
