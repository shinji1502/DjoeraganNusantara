import React from 'react';
import { History, Shield, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTanggalWaktu } from '../../utils/formatters';

export const AdminActivityLogPage: React.FC = () => {
  const { adminActivities } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Audit Trail & Catatan Aktivitas Admin</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Rekam jejak setiap keputusan administratif, persetujuan NIB, moderasi produk, dan pengaturan operasional.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 space-y-4">
        <div className="divide-y divide-neutral-100">
          {adminActivities.map((act) => (
            <div key={act.id} className="py-4 flex items-start gap-4 text-xs">
              <div className="w-9 h-9 rounded-xl bg-[#FAF8F7] border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                {act.type === 'verifikasi' && <FileCheck className="w-4 h-4 text-[#D90816]" />}
                {act.type === 'moderasi' && <Shield className="w-4 h-4 text-blue-600" />}
                {act.type === 'sistem' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {act.type === 'pengguna' && <History className="w-4 h-4 text-neutral-600" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 text-sm">{act.action}</span>
                  <span className="text-[10px] text-neutral-400">{formatTanggalWaktu(act.timestamp)}</span>
                </div>
                <p className="text-neutral-600">
                  Target Entitas: <strong className="text-neutral-800">{act.target}</strong>
                </p>
                <p className="text-[11px] text-neutral-400">
                  Petugas Administrator: {act.adminName} (Diskop UKM Kota Surakarta)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
