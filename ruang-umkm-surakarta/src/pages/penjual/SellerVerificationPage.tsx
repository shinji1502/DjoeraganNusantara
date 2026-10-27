import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTanggal, getVerificationStatusBadge } from '../../utils/formatters';

export const SellerVerificationPage: React.FC = () => {
  const { currentUser, verifications } = useApp();

  // Find verification request for this seller or fallback
  const myVerif = verifications.find((v) => v.sellerId === currentUser.id) || verifications[1];

  const badge = getVerificationStatusBadge(myVerif.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Verifikasi Legalitas UMKM</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Kepatuhan status izin usaha Nomor Induk Berusaha (NIB) sesuai ketentuan Permendag 19/2026.
        </p>
      </div>

      {/* Main Status Banner */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Status Legalitas Terdaftar
            </span>
            <h2 className="text-xl font-bold text-neutral-900 mt-0.5">{myVerif.storeName}</h2>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
            {badge.label}
          </span>
        </div>

        {myVerif.adminNotes && (
          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-neutral-200 text-xs text-neutral-700 space-y-1">
            <p className="font-bold text-neutral-900">Catatan Evaluasi Verifikator Diskop UKM:</p>
            <p>{myVerif.adminNotes}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <span className="text-neutral-400 block">Nomor Induk Berusaha (NIB):</span>
            <strong className="text-neutral-900 font-mono text-sm">{myVerif.nib}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">NIK Pemilik:</span>
            <strong className="text-neutral-900 font-mono text-sm">{myVerif.nik}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">Skala Usaha:</span>
            <strong className="text-neutral-900">{myVerif.businessScale} (Surakarta)</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">Kategori Produk:</span>
            <strong className="text-neutral-900">{myVerif.category}</strong>
          </div>
        </div>
      </div>

      {/* Dokumen Terlampir */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-neutral-900">Berkas Pendukung Legalitas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-neutral-200 bg-[#FAF8F7] space-y-2">
            <FileText className="w-6 h-6 text-[#D90816]" />
            <h4 className="font-bold text-xs text-neutral-900">Dokumen NIB OSS</h4>
            <p className="text-[11px] text-neutral-500 truncate">{myVerif.documents.nibDoc}</p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
              Terverifikasi OSS
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-neutral-200 bg-[#FAF8F7] space-y-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-xs text-neutral-900">KTP Penanggung Jawab</h4>
            <p className="text-[11px] text-neutral-500">NIK terdaftar kependudukan Solo</p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
              Valid Disdukcapil
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-neutral-200 bg-[#FAF8F7] space-y-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <h4 className="font-bold text-xs text-neutral-900">Foto Sampel Produk</h4>
            <p className="text-[11px] text-neutral-500">Standar mutu & kemasan layak</p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
              Lolos Kurasi
            </span>
          </div>
        </div>
      </div>

      {/* Regulasi Permendag Notice */}
      <div className="bg-[#171717] rounded-3xl p-6 text-white text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Kepatuhan Permendag 19/2026</span>
        </div>
        <p className="text-neutral-300 leading-relaxed">
          Toko dengan status legalitas terverifikasi berhak mendapatkan lencana "Mitra Resmi Surakarta", bebas biaya pendaftaran etalase e-Katalog B2G pengadaan pemerintah, serta diprioritaskan dalam program subsidi bazzar & display kios stasiun.
        </p>
      </div>
    </div>
  );
};
