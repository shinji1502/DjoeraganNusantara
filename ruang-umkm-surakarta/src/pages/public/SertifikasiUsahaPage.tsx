import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Building2,
  FileCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BatikParang, BatikDivider } from '../../components/common/BatikOrnament';

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
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300/70',
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
      badgeColor: 'bg-[#C5A059]/15 text-[#8C5835] border-[#C5A059]/40',
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
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300/70',
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
      badgeColor: 'bg-[#B81D24]/10 text-[#98141A] border-[#B81D24]/25',
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
      badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
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
    <div className="space-y-12 sm:space-y-16 pb-20 bg-theme-pasar min-h-screen">
      {/* Header with Square Grid, Parang watermark, & Faint Artisan Photo */}
      <section className="relative overflow-hidden bg-transparent border-b border-[#E7DFD5] bg-heritage-artisan-watermark py-14 sm:py-16">
        <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none opacity-40 hidden md:block">
          <BatikParang className="h-full w-full" color="#C5A059" opacity={0.12} />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B81D24]/10 text-[#98141A] text-xs font-bold border border-[#B81D24]/20">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Pusat Layanan Legalitas & Perizinan Usaha</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#1C1917] tracking-tight">
            Sertifikasi Usaha & Kepastian Hukum
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Legalitas lengkap bikin usaha tenang, dipercaya pembeli, dan gampang tembus pasar modern. Kami menyediakan panduan syarat, alur pendaftaran, tautan resmi ke lembaga terkait, dan pendampingan personal.
          </p>
        </div>
      </section>

      {/* 5 Core Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#8C5835] uppercase tracking-wider">Layanan Tersedia</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917]">
            Daftar Layanan Sertifikasi & Izin Usaha
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C]">
            Pilih layanan yang dibutuhkan untuk melihat persyaratan dan tautan portal resmi lembaga negara.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="card-heritage p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header card */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${svc.badgeColor}`}>
                      {svc.badge}
                    </span>
                    <h3 className="font-serif font-extrabold text-xl text-[#1C1917] mt-2 leading-snug">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-[#78716C] font-medium">{svc.organizer}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                  {svc.desc}
                </p>

                {/* Duration & Cost */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] text-xs">
                  <div>
                    <span className="text-[10px] text-[#78716C] block">Estimasi Waktu:</span>
                    <strong className="text-[#1C1917] text-[11px] sm:text-xs flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                      {svc.duration}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78716C] block">Biaya Layanan:</span>
                    <strong className="text-emerald-800 text-[11px] sm:text-xs flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      {svc.cost}
                    </strong>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="space-y-2.5 pt-2 border-t border-[#E7DFD5]">
                  <span className="text-xs font-bold text-[#1C1917] block">
                    Dokumen & Persyaratan Utama:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#57534E]">
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
              <div className="pt-4 border-t border-[#E7DFD5] flex flex-wrap items-center justify-between gap-3">
                {svc.officialUrl.startsWith('http') ? (
                  <a
                    href={svc.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D6CEC2] bg-white text-xs font-bold text-[#1C1917] hover:border-[#C5A059] hover:bg-[#FAF7F2] transition"
                  >
                    <span>Buka Portal Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#8C5835]" />
                  </a>
                ) : (
                  <span className="text-[11px] text-[#78716C] italic">
                    Disediakan langsung oleh tim fasilitator
                  </span>
                )}

                <button
                  onClick={() => {
                    setSelectedService(svc.title);
                    document.getElementById('konsultasi')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20 cursor-pointer"
                >
                  Ajukan Pendampingan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BatikDivider />

      {/* 4-Step Process Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-heritage p-8 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#8C5835] uppercase tracking-wider">Alur Mudah</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917]">
              4 Langkah Mudah Mengurus Legalitas Usaha
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#C5A059] font-serif font-extrabold flex items-center justify-center mx-auto text-base border border-[#C5A059]/40">
                1
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">Pilih Jenis Izin</h4>
              <p className="text-xs text-[#78716C]">
                Tentukan sertifikasi yang paling dibutuhkan usaha Anda saat ini (mulai dari NIB OSS).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#C5A059] font-serif font-extrabold flex items-center justify-center mx-auto text-base border border-[#C5A059]/40">
                2
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">Lengkapi Dokumen</h4>
              <p className="text-xs text-[#78716C]">
                Siapkan KTP, foto produk, informasi bahan, atau etiket logo sesuai checklist.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#C5A059] font-serif font-extrabold flex items-center justify-center mx-auto text-base border border-[#C5A059]/40">
                3
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">Bantuan Fasilitator</h4>
              <p className="text-xs text-[#78716C]">
                Gunakan portal resmi atau manfaatkan bimbingan tim Djoeragan Nusantara.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#B81D24] text-white font-serif font-extrabold flex items-center justify-center mx-auto text-base border border-[#B81D24]">
                4
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">Sertifikat Terbit</h4>
              <p className="text-xs text-[#78716C]">
                Izin resmi terbit dan produk Anda siap dipamerkan di katalog Djoeragan Nusantara!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation & Assistance Inquiry Form */}
      <section id="konsultasi" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-heritage p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C5A059]/15 text-[#8C5835] text-xs font-bold border border-[#C5A059]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Bimbingan Personal Gratis
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917]">
              Formulir Bantuan & Pendampingan Sertifikasi
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
              Punya pertanyaan atau butuh dibimbing saat pengurusan dokumen? Isi data singkat di bawah ini, tim Djoeragan Nusantara akan segera membantu Anda.
            </p>
          </div>

          <form onSubmit={handleSubmitConsultation} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#1C1917] block mb-1">
                Layanan Sertifikasi yang Diminati *
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
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
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  Nama Pemilik Usaha *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  Nama Toko / Usaha *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dapur Serabi Notosuman"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  Kabupaten / Kota Domisili
                </label>
                <input
                  type="text"
                  placeholder="Kota Surakarta / Kabupaten ..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1C1917] block mb-1">
                Catatan / Kendala yang Dihadapi (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Ceritakan kendala Anda (misal: belum paham cara daftar akun OSS, belum punya uji lab, dsb)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#B81D24] text-white font-bold text-xs hover:bg-[#98141A] transition shadow-lg shadow-[#B81D24]/20 flex items-center justify-center gap-2 cursor-pointer"
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

