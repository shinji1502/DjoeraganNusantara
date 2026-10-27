import React, { useState } from 'react';
import { Package, Clock, CheckCircle2, Search, FileText, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatTanggal, getOrderStatusBadge } from '../../utils/formatters';

export const AdminOrdersPage: React.FC = () => {
  const { orders, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'semua' && o.orderStatus !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q) ||
        o.sellerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalValue = filteredOrders.reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Manajemen Pesanan Platform</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitoring seluruh arus transaksi ritel (B2C) dan belanja dinas pemerintah (B2G).
          </p>
        </div>

        <button
          onClick={() => showToast('Data rekap transaksi berhasil diekspor (Format CSV demo)!', 'info')}
          className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-800 text-xs font-bold hover:border-neutral-900 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor Rekap Data</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Cari nomor pesanan, pembeli, toko..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF8F7] border border-neutral-300 focus:outline-none focus:border-[#D90816]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F7] border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none"
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
            <option value="diproses">Sedang Diproses</option>
            <option value="dikirim">Dalam Pengiriman</option>
            <option value="selesai">Selesai</option>
          </select>

          <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-3 py-2 rounded-xl">
            Total: {formatRupiah(totalValue)}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAF8F7] text-neutral-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-6">No. Pesanan</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Pembeli</th>
                <th className="py-3.5 px-4">Mitra Penjual</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((o) => {
                const badge = getOrderStatusBadge(o.orderStatus);
                return (
                  <tr key={o.id} className="hover:bg-neutral-50/80 transition">
                    <td className="py-4 px-6 font-mono font-bold text-neutral-900">{o.orderNumber}</td>
                    <td className="py-4 px-4 text-neutral-500">{formatTanggal(o.createdAt)}</td>
                    <td className="py-4 px-4 font-medium text-neutral-900">{o.buyerName}</td>
                    <td className="py-4 px-4 text-neutral-700">{o.sellerName}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-[10px]">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-neutral-900">{formatRupiah(o.grandTotal)}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
