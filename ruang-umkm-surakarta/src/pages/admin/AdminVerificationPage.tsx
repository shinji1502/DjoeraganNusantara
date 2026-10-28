import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  FileText,
  AlertTriangle,
  Search,
  Users,
  CheckSquare,
  Building2,
  UserCheck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTanggal, getVerificationStatusBadge } from '../../utils/formatters';
import { VerificationRequest, Member } from '../../types';

export const AdminVerificationPage: React.FC = () => {
  const {
    verifications,
    approveVerification,
    rejectVerification,
    pendingVerification,
    members,
    approveMember,
    rejectMember,
    pendingMember,
    showToast,
  } = useApp();

  // Primary section tab: 'anggota' or 'legalitas'
  const [activeSection, setActiveSection] = useState<'anggota' | 'legalitas'>('anggota');

  // Filter & search states
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>('semua');
  const [legalStatusFilter, setLegalStatusFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected for modals
  const [selectedVerif, setSelectedVerif] = useState<VerificationRequest | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Approval/Rejection inputs
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectMode, setIsRejectMode] = useState(false);

  // Count pending items
  const pendingMemberCount = members.filter((m) => m.verificationStatus === 'menunggu').length;
  const pendingLegalCount = verifications.filter((v) => v.status === 'menunggu').length;

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

  // Filtered legalities
  const filteredVerifications = verifications.filter((v) => {
    if (legalStatusFilter !== 'semua' && v.status !== legalStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.storeName.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q) ||
        v.nib.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Actions for Legality Verifications
  const handleApproveLegal = () => {
    if (!selectedVerif) return;
    approveVerification(selectedVerif.id, approvalNotes);
    setSelectedVerif(null);
    setApprovalNotes('');
  };

  const handleRejectLegal = () => {
    if (!selectedVerif) return;
    if (!rejectReason.trim()) {
      showToast('Harap masukkan alasan penolakan untuk evaluasi UMKM.', 'error');
      return;
    }
    rejectVerification(selectedVerif.id, rejectReason);
    setSelectedVerif(null);
    setRejectReason('');
    setIsRejectMode(false);
  };

  // Actions for Member Verifications
  const handleApproveMember = () => {
    if (!selectedMember) return;
    approveMember(selectedMember.id, approvalNotes || 'Data dan persyaratan pendaftaran anggota telah diverifikasi lengkap dan disetujui.');
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

      {/* Main Section Navigation */}
      <div className="flex border-b border-[#E7DFD5] gap-4">
        <button
          onClick={() => {
            setActiveSection('anggota');
            setSearchQuery('');
          }}
          className={`pb-3 text-xs font-bold transition relative flex items-center gap-2 ${
            activeSection === 'anggota'
              ? 'text-[#B81D24] border-b-2 border-[#B81D24]'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verifikasi Pendaftaran Anggota</span>
          {pendingMemberCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#B81D24] text-white">
              {pendingMemberCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveSection('legalitas');
            setSearchQuery('');
          }}
          className={`pb-3 text-xs font-bold transition relative flex items-center gap-2 ${
            activeSection === 'legalitas'
              ? 'text-[#B81D24] border-b-2 border-[#B81D24]'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verifikasi Legalitas & Dokumen NIB Usaha</span>
          {pendingLegalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C5A059] text-white">
              {pendingLegalCount}
            </span>
          )}
        </button>
      </div>

      {/* SECTION 1: VERIFIKASI ANGGOTA */}
      {activeSection === 'anggota' && (
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
                                    title="Approve / Setujui Seller"
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
                                    title="Reject / Tolak Seller"
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
      )}

      {/* SECTION 2: VERIFIKASI LEGALITAS NIB USAHA */}
      {activeSection === 'legalitas' && (
        <div className="space-y-4">
          {/* Sub Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { key: 'semua', label: 'Semua Pengajuan' },
                { key: 'menunggu', label: `Menunggu (${pendingLegalCount})` },
                { key: 'disetujui', label: 'Disetujui (Resmi)' },
                { key: 'ditolak', label: 'Perlu Revisi' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setLegalStatusFilter(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    legalStatusFilter === tab.key
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
                placeholder="Cari toko, nama pemilik, atau NIB..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D6CEC2] text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Legality Table */}
          <div className="card-heritage overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#57534E]">
                <thead className="bg-[#F5EFEB] text-[#1C1917] font-extrabold uppercase tracking-wider text-[10px] border-b border-[#E7DFD5]">
                  <tr>
                    <th className="py-3.5 px-6">Toko / Usaha</th>
                    <th className="py-3.5 px-4">Pemilik & NIK</th>
                    <th className="py-3.5 px-4">Nomor NIB OSS</th>
                    <th className="py-3.5 px-4">Wilayah</th>
                    <th className="py-3.5 px-4">Tanggal Pengajuan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DFD5]/70">
                  {filteredVerifications.length > 0 ? (
                    filteredVerifications.map((v) => {
                      const badge = getVerificationStatusBadge(v.status);
                      return (
                        <tr key={v.id} className="hover:bg-neutral-50/80 transition">
                          <td className="py-4 px-6">
                            <div className="font-bold text-neutral-900">{v.storeName}</div>
                            <span className="text-[10px] text-neutral-400">{v.category} • Skala {v.businessScale}</span>
                          </td>

                          <td className="py-4 px-4">
                            <p className="font-semibold text-neutral-800">{v.ownerName}</p>
                            <p className="font-mono text-[10px] text-neutral-400">{v.nik}</p>
                          </td>

                          <td className="py-4 px-4 font-mono font-bold text-neutral-900">
                            {v.nib}
                          </td>

                          <td className="py-4 px-4 text-neutral-700">
                            {v.district}, Surakarta
                          </td>

                          <td className="py-4 px-4 text-neutral-500">
                            {formatTanggal(v.submittedDate)}
                          </td>

                          <td className="py-4 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${badge.bg} ${badge.text} ${badge.border}`}>
                              {badge.label}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedVerif(v);
                                  setIsRejectMode(false);
                                  setApprovalNotes('Dokumen legalitas NIB dan kesesuaian operasional UMKM dinyatakan lengkap dan sah.');
                                }}
                                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
                                title="Tinjau Berkas Legalitas"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {v.status === 'menunggu' && (
                                <>
                                  <button
                                    onClick={() => approveVerification(v.id, 'Disetujui langsung oleh kurator admin.')}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs flex items-center gap-1"
                                    title="Approve / Setujui Legalitas Seller"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>ACC</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedVerif(v);
                                      setIsRejectMode(true);
                                      setRejectReason('');
                                    }}
                                    className="px-2 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition"
                                    title="Reject / Tolak Legalitas Seller"
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
                        Tidak ada pengajuan legalitas pada filter ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PERIKSA ANGGOTA BARU */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
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
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF8F7] rounded-2xl text-xs">
              <div>
                <span className="text-neutral-400 block">Jenis Kelamin & Usia:</span>
                <strong className="text-neutral-900">{selectedMember.gender} • {selectedMember.ageGroup} thn</strong>
              </div>
              <div>
                <span className="text-neutral-400 block">Kota / Kabupaten:</span>
                <strong className="text-neutral-900">{selectedMember.cityDistrict || selectedMember.city}, Jawa Tengah</strong>
              </div>
              <div>
                <span className="text-neutral-400 block">Kontak Email:</span>
                <strong className="text-neutral-900 font-mono">{selectedMember.email}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block">WhatsApp:</span>
                <strong className="text-neutral-900 font-mono">{selectedMember.phone}</strong>
              </div>
              <div className="col-span-2 pt-2 border-t border-neutral-200">
                <span className="text-neutral-400 block">Status Kepemilikan Usaha:</span>
                <strong className="text-neutral-900">
                  {selectedMember.hasBusiness
                    ? `Punya Usaha: ${selectedMember.businessName} (${selectedMember.businessType || selectedMember.businessCategory || 'Usaha'})`
                    : 'Belum Memiliki Usaha (Calon Wirausaha / Pelatihan)'}
                </strong>
              </div>
            </div>

            {/* Checklist Persyaratan Dokumen */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-800 block uppercase tracking-wider">
                Checklist Persyaratan Dokumen Terunggah
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className={`w-4 h-4 ${selectedMember.documents?.ktp ? 'text-emerald-600' : 'text-neutral-300'}`} />
                    <span className="font-semibold text-neutral-800">KTP Kependudukan (WNI)</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedMember.documents?.ktp ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                    {selectedMember.documents?.ktp ? 'Lengkap & Terlampir' : 'Tidak Ada'}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className={`w-4 h-4 ${selectedMember.documents?.nib ? 'text-emerald-600' : 'text-neutral-300'}`} />
                    <span className="font-semibold text-neutral-800">Nomor Induk Berusaha (NIB OSS)</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedMember.documents?.nib ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                    {selectedMember.documents?.nib ? 'Lengkap & Terlampir' : 'Belum Ada (Opsional)'}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className={`w-4 h-4 ${selectedMember.documents?.qris ? 'text-emerald-600' : 'text-neutral-300'}`} />
                    <span className="font-semibold text-neutral-800">QRIS Atas Nama Usaha</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedMember.documents?.qris ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                    {selectedMember.documents?.qris ? 'Lengkap & Terlampir' : 'Belum Memiliki'}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className={`w-4 h-4 ${selectedMember.documents?.fotoUsaha ? 'text-emerald-600' : 'text-neutral-300'}`} />
                    <span className="font-semibold text-neutral-800">Foto Tempat Usaha / Produk Fisik</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedMember.documents?.fotoUsaha ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                    {selectedMember.documents?.fotoUsaha ? 'Lengkap & Terlampir' : 'Tidak Ada'}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className={`w-4 h-4 ${selectedMember.documents?.suratPernyataan ? 'text-emerald-600' : 'text-neutral-300'}`} />
                    <span className="font-semibold text-neutral-800">Surat Pernyataan Keabsahan Data UMKM</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedMember.documents?.suratPernyataan ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                    {selectedMember.documents?.suratPernyataan ? 'Lengkap & Terlampir' : 'Tidak Ada'}
                  </span>
                </div>
              </div>
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
                      <strong className={selectedMember.verificationStatus === 'disetujui' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {selectedMember.verificationStatus === 'disetujui' ? '✓ Telah Disetujui (ACC)' : 'Ditolak (Perlu Revisi)'}
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

      {/* MODAL 2: PERIKSA LEGALITAS NIB USAHA */}
      {selectedVerif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D90816]">
                  Evaluasi Tim Verifikator Diskop UKM & Kepatuhan
                </span>
                <h3 className="text-lg font-extrabold text-neutral-900">
                  {selectedVerif.storeName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVerif(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF8F7] rounded-2xl text-xs">
              <div>
                <span className="text-neutral-400 block">Penanggung Jawab:</span>
                <strong className="text-neutral-900">{selectedVerif.ownerName}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block">NIK Kependudukan:</span>
                <strong className="text-neutral-900 font-mono">{selectedVerif.nik}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block">Nomor NIB OSS:</span>
                <strong className="text-[#D90816] font-mono">{selectedVerif.nib}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block">Kecamatan:</span>
                <strong className="text-neutral-900">{selectedVerif.district}, Surakarta</strong>
              </div>
            </div>

            {/* Checklist Persyaratan Dokumen NIB & Usaha */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-800 block uppercase tracking-wider">
                Checklist Dokumen Legalitas
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D90816]" />
                    <span className="font-semibold">{selectedVerif.documents.nibDoc}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    NIB OSS Terverifikasi
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">KTP Elektronik Pemilik Usaha</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Sesuai Disdukcapil
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold">Standar Mutu Produk (Permendag 19/2026)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Lolos Kurasi
                  </span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            {!isRejectMode ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Catatan Verifikasi (Disetujui)
                  </label>
                  <textarea
                    rows={2}
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {selectedVerif.status === 'menunggu' ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setIsRejectMode(true)}
                      className="px-4 py-2.5 rounded-full border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 transition"
                    >
                      Tolak / Minta Revisi Dokumen
                    </button>

                    <button
                      onClick={handleApproveLegal}
                      className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui (Lolos Permendag 19/2026)</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-xs text-neutral-500 font-medium">
                      Status legalitas:{' '}
                      <strong className={selectedVerif.status === 'disetujui' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {selectedVerif.status === 'disetujui' ? '✓ Telah Disetujui (ACC)' : 'Ditolak (Perlu Revisi)'}
                      </strong>
                    </span>
                    <button
                      onClick={() => setSelectedVerif(null)}
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
                  <span>Alasan Penolakan / Permintaan Revisi</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Jelaskan alasan mengapa berkas NIB belum memenuhi syarat Permendag 19/2026..."
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
                    onClick={handleRejectLegal}
                    className="px-5 py-2 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                  >
                    Kirim Penolakan Resmi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
