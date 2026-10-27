import React from 'react';
import {
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTanggal } from '../../utils/formatters';

export const AdminComplaintsPage: React.FC = () => {
  const { complaints, updateComplaintStatus, showToast } = useApp();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">
          Layanan Pengaduan Konsumen & UMKM (SLA 24 Jam)
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Penyelesaian sengketa transaksi, keterlambatan logistik, dan aduan standar mutu sesuai regulasi Permendag 19/2026.
        </p>
      </div>

      {/* SLA Policy Banner */}
      <div className="bg-[#171717] rounded-3xl p-6 text-white text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Target Respons Pengaduan: &lt; 1 x 24 Jam</span>
          </div>
          <p className="text-neutral-300">
            Setiap keluhan konsumen harus ditindaklanjuti untuk menjamin kepercayaan masyarakat terhadap ekosistem digital Kota Surakarta.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-bold shrink-0">
          Tingkat Kepatuhan SLA: 100%
        </span>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAF8F7] text-neutral-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-6">No. Tiket</th>
                <th className="py-3.5 px-4">Pengadu</th>
                <th className="py-3.5 px-4">Topik Pengaduan</th>
                <th className="py-3.5 px-4">Prioritas</th>
                <th className="py-3.5 px-4">Sisa SLA</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/80 transition">
                  <td className="py-4 px-6 font-mono font-bold text-neutral-900">{c.ticketNumber}</td>

                  <td className="py-4 px-4">
                    <p className="font-semibold text-neutral-800">{c.complainantName}</p>
                    <span className="text-[10px] text-neutral-400 capitalize">{c.userRole}</span>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-bold text-neutral-900 line-clamp-1">{c.subject}</p>
                    <p className="text-[11px] text-neutral-500 line-clamp-1">{c.message}</p>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.priority === 'tinggi'
                        ? 'bg-rose-50 text-rose-700'
                        : c.priority === 'sedang'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {c.priority}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-neutral-800">
                    {c.status === 'selesai' ? (
                      <span className="text-emerald-600">Terselesaikan</span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        {c.slaHoursLeft} Jam Tersisa
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'selesai'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {c.status === 'selesai' ? 'Selesai' : 'Dalam Penanganan'}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    {c.status !== 'selesai' ? (
                      <button
                        onClick={() => updateComplaintStatus(c.id, 'selesai')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1 ml-auto"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Selesaikan</span>
                      </button>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">Telah Ditutup</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
