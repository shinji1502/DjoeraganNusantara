import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Store,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  FileText,
  Upload,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckSquare,
  Square,
  Lock,
  XCircle,
  FileCheck,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, User, Gender, AgeGroup } from '../../types';
import { JAWA_TENGAH_REGIONS } from '../../data/memberData';
import { BatikParang } from '../../components/common/BatikOrnament';

interface DocumentState {
  file: File | null;
  fileName: string;
  fileSize: string;
  status: 'empty' | 'validating' | 'valid' | 'invalid';
  error?: string;
}

export const RegisterPage: React.FC = () => {
  const { setCurrentUser, addUser, submitVerification, addMember, showToast } = useApp();
  const navigate = useNavigate();

  const [registerType, setRegisterType] = useState<'penjual' | 'pembeli'>('penjual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<Gender>('Laki-laki');
  const [age, setAge] = useState<number>(28);
  const [selectedRegion, setSelectedRegion] = useState<string>('Kota Surakarta');

  // Business details
  const [hasBusiness, setHasBusiness] = useState(true);
  const [storeName, setStoreName] = useState('');
  const [nik, setNik] = useState('');
  const [nib, setNib] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Batik & Fashion');
  const [businessScale, setBusinessScale] = useState<'Mikro' | 'Kecil' | 'Menengah'>('Mikro');

  // Document Upload States
  const [docs, setDocs] = useState<{
    ktp: DocumentState;
    nib: DocumentState;
    qris: DocumentState;
    dokumenPendukung: DocumentState;
  }>({
    ktp: { file: null, fileName: '', fileSize: '', status: 'empty' },
    nib: { file: null, fileName: '', fileSize: '', status: 'empty' },
    qris: { file: null, fileName: '', fileSize: '', status: 'empty' },
    dokumenPendukung: { file: null, fileName: '', fileSize: '', status: 'empty' },
  });

  // Requirement Checklist States (strictly disabled until document upload succeeds)
  const [checklist, setChecklist] = useState({
    ktp: false,
    nib: false,
    qris: false,
    dokumenPendukung: false,
  });

  const getAgeGroup = (val: number): AgeGroup => {
    if (val <= 23) return '17-23';
    if (val <= 35) return '24-35';
    if (val <= 45) return '36-45';
    return '46+';
  };

  // Handle document upload and simulated system validation
  const handleFileUpload = (
    key: keyof typeof docs,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setDocs((prev) => ({
        ...prev,
        [key]: {
          file: null,
          fileName: file.name,
          fileSize: `${fileSizeMb} MB`,
          status: 'invalid',
          error: 'Ukuran file melebihi batas 5MB.',
        },
      }));
      setChecklist((prev) => ({ ...prev, [key]: false }));
      showToast(`Gagal: File "${file.name}" melebihi batas 5MB.`, 'error');
      return;
    }

    // Validate allowed file extensions
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.includes(extension)) {
      setDocs((prev) => ({
        ...prev,
        [key]: {
          file: null,
          fileName: file.name,
          fileSize: `${fileSizeMb} MB`,
          status: 'invalid',
          error: 'Format harus berupa PDF, JPG, atau PNG.',
        },
      }));
      setChecklist((prev) => ({ ...prev, [key]: false }));
      showToast('Format berkas tidak didukung. Harap unggah PDF, JPG, atau PNG.', 'error');
      return;
    }

    // Set validating status momentarily to provide authentic system validation feedback
    setDocs((prev) => ({
      ...prev,
      [key]: {
        file,
        fileName: file.name,
        fileSize: `${fileSizeMb} MB`,
        status: 'validating',
      },
    }));

    setTimeout(() => {
      setDocs((prev) => ({
        ...prev,
        [key]: {
          file,
          fileName: file.name,
          fileSize: `${fileSizeMb} MB`,
          status: 'valid',
        },
      }));
      showToast(`Berkas ${key.toUpperCase()} berhasil divalidasi sistem! Checklist persyaratan kini aktif.`, 'success');
    }, 400);
  };

  const removeDoc = (key: keyof typeof docs) => {
    setDocs((prev) => ({
      ...prev,
      [key]: { file: null, fileName: '', fileSize: '', status: 'empty' },
    }));
    setChecklist((prev) => ({ ...prev, [key]: false }));
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    // Only allow toggle if upload is valid!
    if (docs[key].status !== 'valid') {
      showToast('Harap unggah dokumen terlebih dahulu sebelum mencentang persyaratan.', 'info');
      return;
    }
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast('Harap lengkapi nama, email, dan nomor telepon.', 'error');
      return;
    }

    if (registerType === 'penjual') {
      if (hasBusiness && (!storeName || !nib)) {
        showToast('Bagi pemilik usaha, Nama Toko dan NIB OSS wajib diisi.', 'error');
        return;
      }

      // Check upload requirement for KTP
      if (docs.ktp.status !== 'valid' || !checklist.ktp) {
        showToast('Unggah dokumen KTP dan centang konfirmasi keaslian KTP wajib dipenuhi.', 'error');
        return;
      }

      // If hasBusiness, check NIB, QRIS, Dokumen Pendukung
      if (hasBusiness) {
        if (docs.nib.status !== 'valid' || !checklist.nib) {
          showToast('Dokumen NIB OSS wajib diunggah dan dicentang.', 'error');
          return;
        }
        if (docs.qris.status !== 'valid' || !checklist.qris) {
          showToast('Dokumen QRIS / Rekening Usaha wajib diunggah dan dicentang.', 'error');
          return;
        }
        if (docs.dokumenPendukung.status !== 'valid' || !checklist.dokumenPendukung) {
          showToast('Dokumen Pendukung (foto tempat usaha/produk) wajib diunggah dan dicentang.', 'error');
          return;
        }
      }

      const ageGroup = getAgeGroup(age);

      const newSeller: User = {
        id: 'user-seller-' + Date.now(),
        name,
        email,
        phone,
        role: 'penjual',
        storeName: hasBusiness ? storeName : `Calon Wirausaha - ${name}`,
        nib: hasBusiness ? nib : 'Tahap Bimbingan OSS',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
        address: address || selectedRegion,
        isVerified: false, // Wajib ACC Admin
        sellerVerificationStatus: 'Waiting Verification', // Feature 3 & 4
      };

      // Set user into session and permanent users list
      setCurrentUser(newSeller);
      addUser(newSeller);

      // Add to member registry with status 'menunggu'
      addMember({
        name,
        gender,
        age: Number(age) || 25,
        ageGroup,
        cityDistrict: selectedRegion,
        regencyType: selectedRegion.startsWith('Kota') ? 'Kota' : 'Kabupaten',
        hasBusiness,
        businessName: hasBusiness ? storeName : undefined,
        businessType: hasBusiness ? category : undefined,
        businessScale: hasBusiness ? businessScale : undefined,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        phone,
        email,
        bio: hasBusiness
          ? `Usaha ${category} dari ${selectedRegion}. Sedang menunggu verifikasi resmi admin Djoeragan Nusantara.`
          : `Calon wirausaha dari ${selectedRegion} yang sedang mengikuti bimbingan rintisan usaha.`,
        documents: {
          ktp: docs.ktp.status === 'valid',
          nib: hasBusiness ? docs.nib.status === 'valid' : undefined,
          qris: hasBusiness ? docs.qris.status === 'valid' : undefined,
          fotoUsaha: docs.dokumenPendukung.status === 'valid',
          suratPernyataan: true,
        },
      });

      // Submit verification request to admin
      submitVerification({
        sellerId: newSeller.id,
        storeName: hasBusiness ? storeName : name,
        ownerName: name,
        nik: nik || '3372000000000001',
        nib: hasBusiness ? nib : 'Tahap Bimbingan',
        address: address || selectedRegion,
        district: selectedRegion,
        cityDistrict: selectedRegion,
        category,
        businessScale,
        annualRevenue: 50000000,
        checklist: {
          ktpChecked: checklist.ktp,
          nibChecked: checklist.nib,
          qrisChecked: checklist.qris,
          fotoUsahaChecked: checklist.dokumenPendukung,
          suratPernyataanChecked: true,
        },
        documents: {
          ktp: docs.ktp.fileName || 'KTP_PenanggungJawab.jpg',
          nibDoc: docs.nib.fileName || 'NIB_OSS_Resmi.pdf',
          productPhoto: docs.dokumenPendukung.fileName || 'Foto_Tempat_Usaha.jpg',
          qrisDoc: docs.qris.fileName || 'QRIS_Merchant_Usaha.png',
          suratPernyataan: 'Surat_Pernyataan_Bermaterai.pdf',
        },
      });

      showToast('Formulir dan berkas berhasil diajukan! Mengalihkan ke Halaman Menunggu Verifikasi...', 'info');

      // CRITICAL: FEATURE 4 — DO NOT open Seller Dashboard. Redirect directly to Waiting Verification Page!
      navigate('/menunggu-verifikasi');
    } else {
      // Pembeli biasa
      const newBuyer: User = {
        id: 'user-buyer-' + Date.now(),
        name,
        email,
        phone,
        role: 'pembeli',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        address: selectedRegion,
      };
      setCurrentUser(newBuyer);
      addUser(newBuyer);
      showToast('Pendaftaran akun pembeli berhasil! Selamat berbelanja di Djoeragan Nusantara.', 'success');
      navigate('/katalog');
    }
  };

  // Helper render for document upload card
  const renderDocumentUploadCard = (
    key: keyof typeof docs,
    title: string,
    description: string,
    isRequired: boolean,
    acceptedTypes: string
  ) => {
    const doc = docs[key];
    const isChecked = checklist[key];
    const isUploadValid = doc.status === 'valid';

    return (
      <div
        className={`p-4 rounded-2xl border transition-all space-y-3 ${
          isUploadValid
            ? 'bg-emerald-50/50 border-emerald-300'
            : doc.status === 'invalid'
            ? 'bg-rose-50/50 border-rose-300'
            : 'bg-[#FAF7F2] border-[#E7DFD5]'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${isUploadValid ? 'text-emerald-700' : 'text-[#8C5835]'}`} />
              <strong className="text-xs font-serif font-extrabold text-[#1C1917]">{title}</strong>
              {isRequired && (
                <span className="text-[10px] font-bold text-[#98141A] bg-[#B81D24]/10 px-2.5 py-0.5 rounded-full border border-[#B81D24]/20">
                  Wajib
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#78716C] mt-0.5">{description}</p>
          </div>

          {isUploadValid && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Tervalidasi
            </span>
          )}
        </div>

        {/* Step 1: Upload Dropzone / Button */}
        <div className="pt-1">
          {doc.status === 'empty' ? (
            <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-[#D6CEC2] hover:border-[#C5A059] rounded-xl bg-white hover:bg-[#FAF7F2] cursor-pointer transition text-xs font-bold text-[#1C1917]">
              <Upload className="w-4 h-4 text-[#8C5835]" />
              <span>Unggah Dokumen ({acceptedTypes})</span>
              <input
                type="file"
                accept={acceptedTypes}
                onChange={(e) => handleFileUpload(key, e)}
                className="hidden"
              />
            </label>
          ) : doc.status === 'validating' ? (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              <Clock className="w-4 h-4 animate-spin text-amber-600" />
              <span>Memvalidasi integritas dokumen...</span>
            </div>
          ) : doc.status === 'valid' ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[#1C1917] truncate">{doc.fileName}</span>
                <span className="text-[10px] text-[#78716C] shrink-0">({doc.fileSize})</span>
              </div>
              <button
                type="button"
                onClick={() => removeDoc(key)}
                className="text-xs text-rose-700 hover:text-rose-900 font-bold shrink-0 ml-2 cursor-pointer"
              >
                Ganti Berkas
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-200 text-xs text-rose-700">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{doc.error || 'Dokumen gagal divalidasi.'}</span>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C1917] text-[#FAF7F2] text-xs font-bold hover:bg-[#292524] cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Berkas Lain</span>
                <input
                  type="file"
                  accept={acceptedTypes}
                  onChange={(e) => handleFileUpload(key, e)}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Step 2: Requirement Checklist (MUST stay disabled until upload succeeds) */}
        <div className="pt-2 border-t border-[#E7DFD5]">
          <label
            onClick={() => {
              if (isUploadValid) toggleCheck(key);
            }}
            className={`flex items-start gap-2.5 p-2 rounded-xl transition ${
              !isUploadValid
                ? 'opacity-60 cursor-not-allowed bg-stone-100 text-[#A8A29E]'
                : 'cursor-pointer hover:bg-white/80 text-[#1C1917]'
            }`}
          >
            <input
              type="checkbox"
              disabled={!isUploadValid}
              checked={isChecked}
              onChange={() => {}}
              className="mt-0.5 rounded accent-[#B81D24] disabled:opacity-40"
            />
            <div className="text-xs flex-1">
              <span className="font-bold">
                Konfirmasi Kelengkapan & Keaslian Dokumen {title}
              </span>
              <p className="text-[10px] mt-0.5 text-[#78716C]">
                {!isUploadValid ? (
                  <span className="text-amber-800 font-medium flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Unggah dokumen terlebih dahulu untuk mengaktifkan checklist ini.
                  </span>
                ) : isChecked ? (
                  <span className="text-emerald-700 font-semibold">
                    ✓ Dicentang: Anda menyatakan dokumen ini sah dan siap diverifikasi admin.
                  </span>
                ) : (
                  <span className="text-blue-700 font-medium">
                    Dokumen tervalidasi. Klik kotak centang untuk melengkapi persyaratan.
                  </span>
                )}
              </p>
            </div>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-theme-auth min-h-screen py-10 sm:py-14 relative overflow-hidden bg-heritage-artisan-watermark">
      <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none opacity-30 hidden lg:block">
        <BatikParang className="h-full w-full" color="#C5A059" opacity={0.12} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B81D24]/10 text-[#98141A] text-xs font-bold border border-[#B81D24]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Pendaftaran Djoeragan Nusantara
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#1C1917] tracking-tight">
            Gabung Menjadi Anggota UMKM
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-lg mx-auto leading-relaxed">
            Dapatkan pendampingan izin resmi, sertifikasi mutu, akses pelatihan gratis, serta peluang pasar pengadaan resmi.
          </p>
        </div>

        {/* Registration Form */}
        <div className="card-heritage p-6 sm:p-10 space-y-7">
          {/* Toggle Role Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-[#F5EFEB] rounded-2xl border border-[#E7DFD5]">
            <button
              type="button"
              onClick={() => setRegisterType('penjual')}
              className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                registerType === 'penjual'
                  ? 'bg-[#B81D24] text-white shadow-md'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Store className="w-4 h-4 text-[#C5A059]" />
              <span>Daftar Anggota / Pelaku UMKM</span>
            </button>

            <button
              type="button"
              onClick={() => setRegisterType('pembeli')}
              className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                registerType === 'pembeli'
                  ? 'bg-[#1C1917] text-[#FAF7F2] shadow-md border border-[#C5A059]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Daftar sebagai Pembeli Umum</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* SECTION 1: IDENTITAS DIRI */}
            <div className="space-y-4">
              <h3 className="text-sm font-serif font-extrabold text-[#1C1917] flex items-center gap-2 pb-2 border-b border-[#E7DFD5]">
                <span>1. Identitas Penanggung Jawab</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1C1917] block mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sesuai KTP"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1C1917] block mb-1">
                    Nomor KTP / NIK *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="16 digit NIK"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1C1917] block mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1C1917] block mb-1">
                    Usia (Tahun) *
                  </label>
                  <input
                    type="number"
                    required
                    min={17}
                    max={90}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1C1917] block mb-1">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1C1917] block mb-1">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@anda.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1C1917] block mb-1">
                    Wilayah Kabupaten / Kota Jawa Tengah *
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  >
                    <optgroup label="6 Kota di Jawa Tengah">
                      {JAWA_TENGAH_REGIONS.filter((r) => r.type === 'Kota').map((r) => (
                        <option key={r.name} value={r.name}>{r.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="29 Kabupaten di Jawa Tengah">
                      {JAWA_TENGAH_REGIONS.filter((r) => r.type === 'Kabupaten').map((r) => (
                        <option key={r.name} value={r.name}>{r.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: DATA USAHA (KHUSUS PENJUAL) */}
            {registerType === 'penjual' && (
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-serif font-extrabold text-[#1C1917] flex items-center justify-between pb-2 border-b border-[#E7DFD5]">
                  <span>2. Informasi Usaha UMKM</span>
                  <label className="flex items-center gap-2 cursor-pointer font-normal text-xs text-[#57534E]">
                    <input
                      type="checkbox"
                      checked={hasBusiness}
                      onChange={(e) => setHasBusiness(e.target.checked)}
                      className="rounded accent-[#B81D24]"
                    />
                    <span>Sudah Memiliki Usaha Berjalan</span>
                  </label>
                </h3>

                {hasBusiness ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#1C1917] block mb-1">
                          Nama Toko / Usaha UMKM *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Batik Danar Solo"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#1C1917] block mb-1">
                          Nomor Induk Berusaha (NIB) OSS *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="13 digit NIB OSS"
                          value={nib}
                          onChange={(e) => setNib(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#1C1917] block mb-1">
                          Kategori Komoditas Usaha
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as ProductCategory)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                        >
                          <option value="Batik & Fashion">Batik & Fashion</option>
                          <option value="Kuliner Tradisional">Kuliner Tradisional</option>
                          <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                          <option value="Herbal & Kebugaran">Herbal & Kebugaran</option>
                          <option value="Pertanian & Olahan">Pertanian & Olahan</option>
                          <option value="Jasa Kreatif">Jasa Kreatif</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#1C1917] block mb-1">
                          Skala Usaha
                        </label>
                        <select
                          value={businessScale}
                          onChange={(e) => setBusinessScale(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                        >
                          <option value="Mikro">Usaha Mikro (Omzet &lt; 2 Miliar/th)</option>
                          <option value="Kecil">Usaha Kecil (Omzet 2 - 15 Miliar/th)</option>
                          <option value="Menengah">Usaha Menengah (&gt; 15 Miliar/th)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#1C1917] block mb-1">
                        Alamat Lengkap Tempat Usaha / Produksi *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-[#8C5835] space-y-1">
                    <p className="font-bold">Mendaftar sebagai Rintisan Pemula / Inkubasi:</p>
                    <p className="leading-relaxed text-[#57534E]">
                      Belum punya usaha? Tidak masalah! Anda akan didampingi mulai dari pembuatan NIB mandiri gratis, riset ide produk, hingga kelas kewirausahaan bersama Djoeragan Nusantara.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: UNGGAH DOKUMEN & CHECKLIST PERSYARATAN */}
            {registerType === 'penjual' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD5]">
                  <div>
                    <h3 className="text-sm font-serif font-extrabold text-[#1C1917]">
                      3. Unggah Dokumen & Checklist Persyaratan
                    </h3>
                    <p className="text-[11px] text-[#78716C] mt-0.5">
                      Alur: Unggah berkas dokumen terlebih dahulu → Sistem memvalidasi dokumen → Checklist aktif → Centang checklist persetujuan.
                    </p>
                  </div>
                  <span className="text-[10px] text-[#98141A] font-bold bg-[#B81D24]/10 px-2.5 py-1 rounded-full border border-[#B81D24]/20 shrink-0">
                    Wajib Validasi Admin
                  </span>
                </div>

                {/* Workflow Guidance Card */}
                <div className="p-3.5 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] text-xs text-[#57534E] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#1C1917]">
                    <ShieldCheck className="w-4 h-4 text-[#8C5835]" />
                    <span>Perhatian Ketentuan Verifikasi:</span>
                  </div>
                  <p className="text-[11px] text-[#78716C] leading-relaxed">
                    Checklist persyaratan <strong>dikunci otomatis</strong> dan hanya dapat dicentang setelah Anda mengunggah dokumen yang valid (PDF/JPG/PNG maksimal 5MB).
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Doc 1: KTP */}
                  {renderDocumentUploadCard(
                    'ktp',
                    'KTP Elektronik Penanggung Jawab',
                    'Identitas resmi pemilik atau penanggung jawab UMKM sesuai data kependudukan.',
                    true,
                    '.pdf,.jpg,.jpeg,.png'
                  )}

                  {/* Doc 2: NIB (If has business) */}
                  {hasBusiness &&
                    renderDocumentUploadCard(
                      'nib',
                      'NIB (Nomor Induk Berusaha) OSS',
                      'Dokumen izin legalitas berusaha resmi yang diterbitkan melalui OSS BKPM.',
                      true,
                      '.pdf,.jpg,.jpeg,.png'
                    )}

                  {/* Doc 3: QRIS Usaha (If has business) */}
                  {hasBusiness &&
                    renderDocumentUploadCard(
                      'qris',
                      'QRIS Usaha / Rekening Usaha',
                      'QRIS Merchant Bank Indonesia atau bukti rekening operasional atas nama usaha.',
                      true,
                      '.pdf,.jpg,.jpeg,.png'
                    )}

                  {/* Doc 4: Dokumen Pendukung */}
                  {renderDocumentUploadCard(
                    'dokumenPendukung',
                    'Dokumen Pendukung (Foto Tempat Usaha / Produk Fisik)',
                    'Bukti otentik kegiatan produksi, gerai toko, atau sampel produk fisik.',
                    hasBusiness,
                    '.jpg,.jpeg,.png,.webp'
                  )}
                </div>
              </div>
            )}

            {/* Notice regarding verification flow */}
            <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] text-xs text-[#57534E] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#8C5835] shrink-0 mt-0.5" />
              <div className="leading-relaxed space-y-1">
                <p>
                  <strong className="text-[#1C1917]">Alur Setelah Pengajuan:</strong> Setelah formulir ini dikirimkan, Anda akan diarahkan ke <strong>Halaman Menunggu Verifikasi</strong>.
                </p>
                <p className="text-[11px] text-[#78716C]">
                  Dashboard Penjual belum dapat diakses sebelum pengajuan Anda disetujui resmi oleh Kurator Admin (estimasi 1–3 hari kerja).
                </p>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#B81D24] text-white font-bold text-xs hover:bg-[#98141A] transition shadow-lg shadow-[#B81D24]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ajukan Pendaftaran & Masuk Antrean Verifikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-[#78716C]">
              Sudah memiliki akun terverifikasi?{' '}
              <Link to="/masuk" className="text-[#98141A] font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
