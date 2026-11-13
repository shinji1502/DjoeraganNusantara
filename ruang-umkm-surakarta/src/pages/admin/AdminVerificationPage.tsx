import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Eye,
  X,
  FileText,
  AlertTriangle,
  Search,
  CheckSquare,
  Building2,
  UserCheck,
  CreditCard,
  Maximize2,
  ExternalLink,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTanggal } from '../../utils/formatters';
import { Member } from '../../types';

export const AdminVerificationPage: React.FC = () => {
  const {
    members,
    approveMember,
    rejectMember,
    showToast,
  } = useApp();

  /* kyc-update: Tab legalitas dihapus, langsung fokus pada pendaftaran anggota (KYC) */
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected for inspection modal
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Lightbox preview for documents
  const [lightboxDoc, setLightboxDoc] = useState<{
    title: string;
    url: string;
    isPdf: boolean;
  } | null>(null);

  // Approval/Rejection inputs
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectMode, setIsRejectMode] = useState(false);

  // Keyboard shortcut: Esc to close lightbox or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxDoc) {
          setLightboxDoc(null);
        } else if (selectedMember) {
          setSelectedMember(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxDoc, selectedMember]);

  // Count pending items
  const pendingMemberCount = members.filter((m) => m.verificationStatus === 'menunggu').length;

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (memberStatusFilter !== 'semua' && m.verificationStatus !== memberStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const city = (m.cityDistrict || m.city || '').toLowerCase();
      const bName = (m.businessName || '').toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        city.includes(q) ||
        bName.includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Actions for Member Verifications
  const handleApproveMember = () => {
    if (!selectedMember) return;
    approveMember(
      selectedMember.id,
      approvalNotes || 'Data dan berkas KYC pendaftaran anggota telah diverifikasi lengkap dan disetujui.'
    );
    setSelectedMember(null);
    setApprovalNotes('');
  };

  const handleRejectMember = () => {
    if (!selectedMember) return;
    if (!rejectReason.trim()) {
      showToast('Harap tuliskan arahan revisi atau dokumen yang belum lengkap.', 'error');
      return;
    }
    rejectMember(selectedMember.id, rejectReason);
    setSelectedMember(null);
    setRejectReason('');
    setIsRejectMode(false);
  };

  /* kyc-update: Helper untuk mendeteksi tipe file (PDF vs Gambar) */
  const checkIsPdf = (val: unknown): boolean => {
    if (typeof val === 'string') {
      return val.startsWith('data:application/pdf') || val.toLowerCase().endsWith('.pdf');
    }
    return false;
  };

  /* kyc-update: Helper untuk mendapatkan URL dokumen valid */
  const getDocumentUrl = (
    docValue: boolean | string | undefined,
    fallbackPlaceholder?: string
  ): string | null => {
    if (!docValue) return null;
    if (typeof docValue === 'string') return docValue;
    if (docValue === true && fallbackPlaceholder) return fallbackPlaceholder;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
          Pusat Verifikasi & Persetujuan Admin
        </h1>
        <p className="text-xs text-[#57534E] mt-0.5">
          Pemeriksaan berkas pendaftaran anggota baru, validasi identitas dan NIB usaha, serta kepatuhan standar UMKM Djoeragan Nusantara.
        </p>
      </div>

      {/* kyc-update: Bilah tab kedua dihapus, langsung menampilkan daftar pendaftaran anggota */}
      <div className="space-y-4">
        {/* Sub Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: 'semua', label: 'Semua Anggota' },
              { key: 'menunggu', label: `Menunggu ACC (${pendingMemberCount})` },
              { key: 'disetujui', label: 'Disetujui' },
              { key: 'ditolak', label: 'Perlu Revisi / Ditolak' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMemberStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  memberStatusFilter === tab.key
                    ? 'bg-[#1C1917] text-[#C5A059] shadow-xs'
                    : 'bg-white border border-[#E7DFD5] text-[#57534E] hover:bg-[#FAF7F2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nama, kota, usaha, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D6CEC2] text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
            />
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Members Table */}
        <div className="card-heritage overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#57534E]">
              <thead className="bg-[#F5EFEB] text-[#1C1917] font-extrabold uppercase tracking-wider text-[10px] border-b border-[#E7DFD5]">
                <tr>
                  <th className="py-3.5 px-6">Nama Anggota</th>
                  <th className="py-3.5 px-4">Gender & Usia</th>
                  <th className="py-3.5 px-4">Kota/Kabupaten</th>
                  <th className="py-3.5 px-4">Status & Nama Usaha</th>
                  <th className="py-3.5 px-4">Tanggal Daftar</th>
                  <th className="py-3.5 px-4">Status ACC</th>
                  <th className="py-3.5 px-6 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DFD5]/70">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((m) => {
                    return (
                      <tr key={m.id} className="hover:bg-neutral-50/80 transition">
                        <td className="py-4 px-6">
                          <div className="font-bold text-neutral-900">{m.name}</div>
                          <span className="text-[10px] text-neutral-400 font-mono">{m.email}</span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-semibold text-neutral-800">{m.gender}</span>
                          <p className="text-[10px] text-neutral-400">{m.ageGroup} thn</p>
                        </td>

                        <td className="py-4 px-4 font-medium text-neutral-800">
                          {m.cityDistrict || m.city}
                        </td>

                        <td className="py-4 px-4">
                          {m.hasBusiness ? (
                            <div>
                              <span className="font-bold text-[#D90816]">{m.businessName}</span>
                              <span className="text-[10px] text-neutral-400 block">{m.businessType || m.businessCategory}</span>
                            </div>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-500">
                              Belum Memiliki Usaha
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-neutral-500">
                          {formatTanggal(m.joinDate || m.registrationDate || '')}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                              m.verificationStatus === 'disetujui'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : m.verificationStatus === 'ditolak'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {m.verificationStatus === 'disetujui'
                              ? '✓ Disetujui'
                              : m.verificationStatus === 'ditolak'
                              ? '✕ Perlu Revisi'
                              : '⏳ Menunggu ACC'}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedMember(m);
                                setIsRejectMode(false);
                                setApprovalNotes('Data pendaftaran dan checklist berkas persyaratan telah diverifikasi lengkap.');
                              }}
                              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
                              title="Periksa Detail & Dokumen"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {m.verificationStatus === 'menunggu' && (
                              <>
                                <button
                                  onClick={() => approveMember(m.id, 'Disetujui langsung oleh kurator admin.')}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs flex items-center gap-1"
                                  title="Approve / Setujui Anggota"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>ACC</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedMember(m);
                                    setIsRejectMode(true);
                                    setRejectReason('');
                                  }}
                                  className="px-2 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition"
                                  title="Reject / Tolak Anggota"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-400 text-xs">
                      Tidak ada anggota pada filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* kyc-update: MODAL PEMERIKSAAN PENDAFTARAN ANGGOTA */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl sm:max-w-3xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D90816]">
                  Pemeriksaan Pendaftaran Anggota Djoeragan Nusantara
                </span>
                <h3 className="text-lg font-extrabold text-neutral-900">
                  {selectedMember.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* kyc-update: Detail Informasi Anggota Termasuk Bank, No Rekening, dan Kode Pos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAF8F7] rounded-2xl text-xs border border-[#E7DFD5]">
              <div>
                <span className="text-neutral-400 block text-[11px]">Penanggung Jawab & Usia:</span>
                <strong className="text-neutral-900 text-xs">
                  {selectedMember.name} ({selectedMember.gender}, {selectedMember.ageGroup} thn)
                </strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Wilayah & Kode Pos:</span>
                <strong className="text-neutral-900 text-xs">
                  {selectedMember.cityDistrict || selectedMember.city}, Jawa Tengah
                  {selectedMember.postalCode ? ` (Kode Pos: ${selectedMember.postalCode})` : ''}
                </strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Kontak Email:</span>
                <strong className="text-neutral-900 font-mono text-xs">{selectedMember.email}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Nomor WhatsApp:</span>
                <strong className="text-neutral-900 font-mono text-xs">{selectedMember.phone}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Rekening Bank Pencairan:</span>
                <div className="mt-0.5">
                  {selectedMember.bankName ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#1C1917] text-[#C5A059] font-bold text-[10px]">
                        {selectedMember.bankName}
                      </span>
                      <strong className="text-neutral-900 font-mono text-xs">
                        {selectedMember.accountNumber || '-'}
                      </strong>
                    </span>
                  ) : (
                    <span className="text-neutral-400 italic text-xs">Belum diisi</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Status Kepemilikan Usaha:</span>
                <strong className="text-neutral-900 text-xs">
                  {selectedMember.hasBusiness
                    ? `${selectedMember.businessName} (${selectedMember.businessType || selectedMember.businessCategory || 'Usaha'})`
                    : 'Belum Memiliki Usaha'}
                </strong>
              </div>
            </div>

            {/* kyc-update: GALERI DOKUMEN VERIFIKASI (4 DOKUMEN: KTP, NIB, SELFIE KTP, FOTO USAHA) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                    Galeri Dokumen Verifikasi (KYC)
                  </span>
                  <p className="text-[11px] text-neutral-500">
                    Klik kartu dokumen untuk memperbesar (resolusi penuh). Pastikan data KTP dan NIK terbaca jelas.
                  </p>
                </div>
              </div>

              {(() => {
                const docConfigs = [
                  {
                    id: 'ktp',
                    label: 'KTP Elektronik (e-KTP)',
                    required: true,
                    value: selectedMember.documents?.ktp,
                    fallback: '/images/placeholders/placeholder-ktp.svg',
                  },
                  {
                    id: 'nib',
                    label: 'Nomor Induk Berusaha (NIB OSS)',
                    required: selectedMember.hasBusiness,
                    value: selectedMember.documents?.nib,
                    fallback: '/images/placeholders/placeholder-nib.svg',
                  },
                  {
                    id: 'selfieKtp',
                    label: 'Foto Selfie Bersama KTP',
                    required: true,
                    value: selectedMember.documents?.selfieKtp,
                    fallback: '/images/placeholders/placeholder-selfie.svg',
                  },
                  {
                    id: 'fotoUsaha',
                    label: 'Foto Tempat Usaha / Produk Fisik',
                    required: selectedMember.hasBusiness,
                    value: selectedMember.documents?.fotoUsaha,
                    fallback: '/images/placeholders/placeholder-usaha.svg',
                  },
                ];

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {docConfigs.map((doc) => {
                      const docUrl = getDocumentUrl(doc.value, doc.fallback);
                      const isUploaded = !!docUrl;
                      const isPdf = checkIsPdf(docUrl);
                      const isDummy =
                        selectedMember.documents?.isDummy ||
                        (typeof docUrl === 'string' && docUrl.includes('/images/placeholders/'));

                      return (
                        <div
                          key={doc.id}
                          className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50 flex flex-col justify-between space-y-2.5 transition hover:border-[#C5A059]"
                        >
                          {/* Card Header: Label & Badges */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-neutral-800 text-xs">
                              {doc.label}
                            </span>
                            <div className="flex flex-wrap items-center gap-1 justify-end shrink-0">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  doc.required
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                }`}
                              >
                                {doc.required ? 'Wajib' : 'Opsional'}
                              </span>

                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isUploaded
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-neutral-200 text-neutral-600'
                                }`}
                              >
                                {isUploaded ? '✓ Terunggah' : 'Belum diunggah'}
                              </span>

                              {isDummy && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                  Dokumen contoh
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Body: Thumbnail Preview / PDF / Placeholder */}
                          {isUploaded && docUrl ? (
                            isPdf ? (
                              <div
                                onClick={() =>
                                  setLightboxDoc({
                                    title: doc.label,
                                    url: docUrl,
                                    isPdf: true,
                                  })
                                }
                                className="group relative w-full h-32 rounded-xl border border-neutral-200 bg-white flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-neutral-100 transition shadow-2xs"
                              >
                                <FileText className="w-10 h-10 text-rose-600 mb-1 group-hover:scale-110 transition" />
                                <span className="text-xs font-bold text-neutral-800 text-center line-clamp-1">
                                  Dokumen PDF Resmi NIB
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  Klik untuk membuka berkas PDF
                                </span>
                                <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-900 text-[#C5A059] text-[10px] font-bold">
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Buka Dokumen PDF</span>
                                </span>
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  setLightboxDoc({
                                    title: doc.label,
                                    url: docUrl,
                                    isPdf: false,
                                  })
                                }
                                className="group relative w-full h-32 rounded-xl overflow-hidden cursor-pointer border border-neutral-200 bg-neutral-100 shadow-2xs"
                              >
                                <img
                                  src={docUrl}
                                  alt={doc.label}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                                  <Maximize2 className="w-4 h-4" />
                                  <span>Perbesar Preview</span>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="w-full h-32 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-100/70 flex flex-col items-center justify-center p-4 text-center">
                              <FileText className="w-6 h-6 text-neutral-400 mb-1" />
                              <span className="text-xs font-semibold text-neutral-500">
                                Dokumen belum diunggah pendaftar
                              </span>
                              <span className="text-[10px] text-neutral-400 mt-0.5">
                                {doc.required ? 'Harus dilengkapi sebelum disetujui' : 'Tidak wajib diisi'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Action Section */}
            {!isRejectMode ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Catatan Pemeriksaan Admin
                  </label>
                  <textarea
                    rows={2}
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {selectedMember.verificationStatus === 'menunggu' ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setIsRejectMode(true)}
                      className="px-4 py-2.5 rounded-full border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 transition"
                    >
                      Tolak / Beri Arahan Revisi
                    </button>

                    <button
                      onClick={handleApproveMember}
                      className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACC & Aktifkan Anggota</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-xs text-neutral-500 font-medium">
                      Status pendaftaran:{' '}
                      <strong
                        className={
                          selectedMember.verificationStatus === 'disetujui'
                            ? 'text-emerald-700 font-bold'
                            : 'text-rose-700 font-bold'
                        }
                      >
                        {selectedMember.verificationStatus === 'disetujui'
                          ? '✓ Telah Disetujui (ACC)'
                          : 'Ditolak (Perlu Revisi)'}
                      </strong>
                    </span>
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
                    >
                      Tutup
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 pt-2 bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Arahan Bagian Dokumen yang Harus Diperbaiki Pendaftar</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Jelaskan secara ramah dokumen apa yang perlu dilengkapi atau diperbaiki pendaftar..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 focus:outline-none focus:border-rose-600 bg-white"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsRejectMode(false)}
                    className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleRejectMember}
                    className="px-5 py-2 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                  >
                    Kirim Arahan Revisi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* kyc-update: LIGHTBOX PREVIEW UKURAN PENUH */}
      {lightboxDoc && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLightboxDoc(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-[#1C1917] rounded-3xl overflow-hidden shadow-2xl border border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900 border-b border-neutral-800 text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <h4 className="text-sm font-bold tracking-wide">{lightboxDoc.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                {lightboxDoc.isPdf && (
                  <a
                    href={lightboxDoc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1 transition"
                  >
                    <span>Buka di Tab Baru</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setLightboxDoc(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Body */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/50 min-h-[300px]">
              {lightboxDoc.isPdf ? (
                <iframe
                  src={lightboxDoc.url}
                  title={lightboxDoc.title}
                  className="w-full h-[70vh] rounded-xl border border-neutral-700 bg-white"
                />
              ) : (
                <img
                  src={lightboxDoc.url}
                  alt={lightboxDoc.title}
                  className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-lg"
                />
              )}
            </div>

            {/* Lightbox Footer */}
            <div className="px-5 py-2.5 bg-neutral-900/90 border-t border-neutral-800 text-center text-xs text-neutral-400">
              Tekan <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-[10px]">Esc</kbd> atau klik di luar modal untuk menutup
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
