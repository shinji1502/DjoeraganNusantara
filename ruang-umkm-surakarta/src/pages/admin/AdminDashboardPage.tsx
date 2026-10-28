import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  FileCheck,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  MessageSquareWarning,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatTanggal, getVerificationStatusBadge } from '../../utils/formatters';
import { BatikKawung } from '../../components/common/BatikOrnament';

const PLATFORM_ACTIVITY_DATA = [
  { day: 'Sen', transaksi: 42, penggunaBaru: 12 },
  { day: 'Sel', transaksi: 58, penggunaBaru: 18 },
  { day: 'Rab', transaksi: 65, penggunaBaru: 15 },
  { day: 'Kam', transaksi: 71, penggunaBaru: 22 },
  { day: 'Jum', transaksi: 89, penggunaBaru: 30 },
  { day: 'Sab', transaksi: 114, penggunaBaru: 45 },
  { day: 'Min', transaksi: 132, penggunaBaru: 50 },
];

export const AdminDashboardPage: React.FC = () => {
  const {
    users,
    products,
    orders,
    verifications,
    complaints,
    adminActivities,
    approveVerification,
    rejectVerification,
  } = useApp();

  const pendingVerifications = verifications.filter((v) => v.status === 'menunggu');
  const sellers = users.filter((u) => u.role === 'penjual');
  const buyers = users.filter((u) => u.role === 'pembeli');

  const totalGMV = orders.reduce((sum, o) => sum + o.grandTotal, 0) + 148500000;

  const activeComplaints = complaints.filter((c) => c.status !== 'selesai');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="card-heritage p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle Kawung watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none hidden md:block">
          <BatikKawung className="w-56 h-56 text-[#8C5835]" />
        </div>

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1917] text-[#C5A059] text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Pusat Kendali Pengawasan Pemkot Surakarta</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
            Ringkasan Platform & Tata Kelola
          </h1>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Monitoring perizinan NIB, transaksi belanja UMKM, moderasi katalog, dan layanan perlindungan konsumen Permendag 19/2026.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <Link
            to="/admin/verifikasi"
            className="px-5 py-2.5 rounded-full bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20 flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>Verifikasi UMKM ({pendingVerifications.length})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-heritage p-5 space-y-1">
          <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
            <span>Total Pengguna Aktif</span>
            <Users className="w-4 h-4 text-[#8C5835]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1917]">{users.length + 1420} Akun</p>
          <p className="text-[11px] text-[#78716C]">{buyers.length + 1240} Pembeli • {sellers.length + 180} UMKM</p>
        </div>

        <div className="card-heritage p-5 space-y-1">
          <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
            <span>Antrean Verifikasi Legalitas</span>
            <FileCheck className="w-4 h-4 text-[#B81D24]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#B81D24]">{pendingVerifications.length} Pengajuan</p>
          <Link to="/admin/verifikasi" className="text-[11px] text-[#8C5835] hover:text-[#B81D24] font-semibold hover:underline block">
            Tinjau berkas NIB &rarr;
          </Link>
        </div>

        <div className="card-heritage p-5 space-y-1">
          <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
            <span>Total Transaksi (GMV Simulasi)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1917]">{formatRupiah(totalGMV)}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">+18.5% belanja daerah</p>
        </div>

        <div className="card-heritage p-5 space-y-1">
          <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
            <span>Pengaduan Aktif (SLA 24 Jam)</span>
            <MessageSquareWarning className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-amber-600">{activeComplaints.length} Tiket</p>
          <Link to="/admin/pengaduan" className="text-[11px] text-[#78716C] hover:text-[#1C1917] hover:underline block">
            Respon dalam batas SLA
          </Link>
        </div>
      </div>

      {/* Chart: Aktivitas Platform */}
      <div className="card-heritage p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
              Aktivitas Transaksi & Registrasi Pengguna Baru (7 Hari Terakhir)
            </h3>
            <p className="text-xs text-[#57534E]">
              Pola lonjakan transaksi harian tertinggi pada akhir pekan di sentra belanja Solo.
            </p>
          </div>
          <span className="text-xs bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E7DFD5] text-[#57534E] font-medium">
            Kota Surakarta
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PLATFORM_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7DFD5" />
              <XAxis dataKey="day" stroke="#78716C" fontSize={11} tickLine={false} />
              <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #E7DFD5', backgroundColor: '#FAF7F2', fontSize: '12px' }} />
              <Bar dataKey="transaksi" name="Transaksi QRIS/B2G" fill="#B81D24" radius={[6, 6, 0, 0]} />
              <Bar dataKey="penggunaBaru" name="Pengguna Baru" fill="#8C5835" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Antrean Verifikasi Cepat & Log Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Verification Requests */}
        <div className="lg:col-span-7 card-heritage p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">Pengajuan Verifikasi Menunggu</h3>
            <Link to="/admin/verifikasi" className="text-xs font-bold text-[#8C5835] hover:text-[#B81D24] transition flex items-center gap-1">
              <span>Buka Menu Verifikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingVerifications.length > 0 ? (
            <div className="space-y-3">
              {pendingVerifications.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl border border-[#E7DFD5] bg-[#FAF7F2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-[#1C1917]">{v.storeName}</p>
                    <p className="text-[#57534E]">
                      Pemilik: <span className="text-[#1C1917] font-semibold">{v.ownerName}</span> • NIB: <span className="font-mono">{v.nib}</span>
                    </p>
                    <p className="text-[11px] text-[#78716C]">
                      Kecamatan {v.district} • Skala: {v.businessScale}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => approveVerification(v.id, 'Disetujui cepat via dashboard overview')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                    <button
                      onClick={() => {
                        const reason = window.prompt('Alasan penolakan / revisi dokumen:', 'Nomor NIB belum dapat divalidasi sistem OSS.');
                        if (reason) rejectVerification(v.id, reason);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 font-bold hover:bg-rose-50 transition"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#A8A29E]">
              Tidak ada antrean verifikasi yang menunggu saat ini. Semua dokumen telah diproses.
            </div>
          )}
        </div>

        {/* Right: Log Aktivitas Admin */}
        <div className="lg:col-span-5 card-heritage p-6 sm:p-8 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1C1917]">Catatan Aktivitas Admin</h3>

          <div className="space-y-3">
            {adminActivities.slice(0, 5).map((act) => (
              <div key={act.id} className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E7DFD5] text-xs space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-[#78716C]">
                  <span className="font-semibold text-[#1C1917]">{act.adminName}</span>
                  <span>{formatTanggal(act.timestamp)}</span>
                </div>
                <p className="font-bold text-[#1C1917]">{act.action}</p>
                <p className="text-[#57534E] text-[11px]">Sasaran: {act.target}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
