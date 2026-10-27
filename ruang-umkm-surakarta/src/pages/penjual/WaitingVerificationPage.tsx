import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Store,
  ArrowRight,
  ArrowLeft,
  XCircle,
  RotateCcw,
  Sparkles,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WaitingVerificationPage: React.FC = () => {
  const { currentUser, switchRole, verifications } = useApp();
  const navigate = useNavigate();

  // Find latest verification request for current user/store
  const myVerif = verifications.find(
    (v) => v.sellerId === currentUser.id || (currentUser.storeName && v.storeName === currentUser.storeName)
  );

  const status = currentUser.sellerVerificationStatus || (currentUser.isVerified ? 'Approved' : 'Waiting Verification');
  const isApproved = status === 'Approved' || currentUser.isVerified;
  const isRejected = status === 'Rejected' || myVerif?.status === 'ditolak';

  return (
    <div className="min-h-screen bg-theme-auth py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-neutral-200/90 shadow-xl p-6 sm:p-10 text-center space-y-7 animate-fade-in">
        {/* Status Icon */}
        <div className="flex justify-center">
          {isApproved ? (
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          ) : isRejected ? (
            <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
              <XCircle className="w-10 h-10" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm relative">
              <Clock className="w-10 h-10 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
              </span>
            </div>
          )}
        </div>

        {/* Badge & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border">
            {isApproved ? (
              <span className="bg-emerald-50 text-emerald-800 border-emerald-200">
                Status: Disetujui (Approved)
              </span>
            ) : isRejected ? (
              <span className="bg-rose-50 text-rose-800 border-rose-200">
                Status: Perlu Revisi / Ditolak (Rejected)
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-800 border-amber-200">
                Status: Menunggu Verifikasi (Waiting Verification)
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            {isApproved
              ? 'Akun Penjual Anda Telah Aktif!'
              : isRejected
              ? 'Pengajuan Memerlukan Perbaikan'
              : 'Verifikasi Pendaftaran Penjual UMKM'}
          </h1>
        </div>

        {/* Mandatory Prompt Message Box */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border text-left space-y-3 ${
            isApproved
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : isRejected
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-amber-50/80 border-amber-200/90 text-amber-950'
          }`}
        >
          {isApproved ? (
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="font-bold text-base text-emerald-900">
                Selamat! Verifikasi legalitas Anda telah disetujui Admin.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Toko <strong>{currentUser.storeName || 'Usaha Anda'}</strong> kini telah berstatus resmi. Anda dapat mengakses seluruh fitur Dashboard Penjual, menambahkan produk ke etalase, dan memproses pesanan konsumen.
              </p>
            </div>
          ) : isRejected ? (
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="font-bold text-rose-900">
                Catatan Penolakan / Evaluasi dari Admin:
              </p>
              <p className="p-3 bg-white/80 rounded-xl border border-rose-200 text-rose-800 font-medium leading-relaxed">
                {currentUser.rejectionReason || myVerif?.adminNotes || 'Dokumen belum memenuhi kelengkapan atau kejelasan NIB OSS. Silakan periksa kembali berkas persyaratan.'}
              </p>
              <p className="text-xs text-neutral-600">
                Anda dapat memperbarui berkas dan mengajukan ulang pendaftaran akun.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 text-xs sm:text-sm">
              <p className="font-bold text-base text-amber-900">
                Pengajuan Anda sedang diverifikasi oleh Admin.
              </p>
              <p className="text-amber-800 leading-relaxed font-medium">
                Estimasi proses verifikasi sekitar 1–3 hari kerja.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Dashboard Penjual akan aktif setelah pengajuan disetujui Admin.
              </p>
            </div>
          )}
        </div>

        {/* Process Timeline Steps */}
        {!isApproved && (
          <div className="p-5 rounded-2xl bg-[#FAF8F7] border border-neutral-200 text-left space-y-3">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Alur Verifikasi Penjual:
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-neutral-900">1. Unggah Dokumen & Pengajuan Formulir</strong>
                  <p className="text-neutral-500 text-[11px]">Berkas KTP, NIB, QRIS, dan foto usaha telah diterima sistem.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  2
                </div>
                <div>
                  <strong className="text-neutral-900">2. Validasi & Pemeriksaan Legalitas oleh Admin Diskop</strong>
                  <p className="text-neutral-500 text-[11px]">Kurator memeriksa keaslian NIB OSS dan kesesuaian izin usaha.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  3
                </div>
                <div>
                  <strong className="text-neutral-500">3. Persetujuan (Approved) & Pembukaan Dashboard Penjual</strong>
                  <p className="text-neutral-400 text-[11px]">Dashboard Penjual terbuka otomatis setelah disetujui admin.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Toko Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
          <div>
            <span className="text-neutral-400 block text-[10.5px]">Nama Pemilik / Pendaftar:</span>
            <strong className="text-neutral-900 font-semibold">{currentUser.name}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10.5px]">Nama Usaha / Toko:</span>
            <strong className="text-neutral-900 font-semibold">{currentUser.storeName || 'Usaha UMKM Baru'}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10.5px]">Nomor NIB OSS:</span>
            <strong className="text-neutral-900 font-mono">{currentUser.nib || '13 digit NIB'}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10.5px]">Akses Dashboard:</span>
            <strong className={isApproved ? 'text-emerald-700' : 'text-amber-700'}>
              {isApproved ? 'Aktif (Dapat Diakses)' : 'Terkunci Sementara (Belum ACC)'}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isApproved ? (
            <Link
              to="/penjual/dashboard"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shadow-lg shadow-[#D90816]/25 flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Buka Dashboard Penjual</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : isRejected ? (
            <Link
              to="/daftar"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shadow-lg shadow-[#D90816]/25 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Perbaiki & Ajukan Ulang</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition shadow-xs flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          )}

          <button
            onClick={() => {
              switchRole('pembeli');
              navigate('/katalog');
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-100 transition"
          >
            Beralih ke Akun Pembeli (Jelajah Produk)
          </button>
        </div>

        {/* Demo Helper Switcher Note */}
        <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-400">
          <p>
            💡 <em>Untuk keperluan pengujian kurasi admin: Beralih ke peran <strong>Admin Diskop</strong> di bar atas untuk menyetujui pengajuan toko ini.</em>
          </p>
        </div>
      </div>
    </div>
  );
};
