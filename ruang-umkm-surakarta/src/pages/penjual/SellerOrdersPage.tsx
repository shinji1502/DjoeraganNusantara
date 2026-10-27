import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Search,
  ChevronRight,
  MapPin,
  Phone,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatTanggal, getOrderStatusBadge } from '../../utils/formatters';
import { OrderStatus } from '../../types';

export const SellerOrdersPage: React.FC = () => {
  const { orders, currentUser, updateOrderStatus, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<string>('semua');
  const [searchOrder, setSearchOrder] = useState('');

  // Seller orders
  const myOrders = orders.filter((o) => o.sellerId === currentUser.id);

  const filteredOrders = myOrders.filter((ord) => {
    if (activeTab !== 'semua' && ord.orderStatus !== activeTab) return false;
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.buyerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Pesanan Masuk</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Proses pesanan konsumen, update proses pengemasan, dan input status pengiriman kurir.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'semua', label: 'Semua' },
          { key: 'menunggu_konfirmasi', label: 'Menunggu Konfirmasi' },
          { key: 'diproses', label: 'Sedang Diproses' },
          { key: 'dikirim', label: 'Dalam Pengiriman' },
          { key: 'selesai', label: 'Selesai' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab.key
                ? 'bg-[#171717] text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const badge = getOrderStatusBadge(ord.orderStatus);
            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-4"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-neutral-900">{ord.orderNumber}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500">{formatTanggal(ord.createdAt)}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Bayar via {ord.paymentMethod}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Buyer info & delivery note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FAF8F7] rounded-2xl text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      {ord.buyerName} ({ord.buyerPhone})
                    </p>
                    <p className="text-neutral-600 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#D90816] shrink-0 mt-0.5" />
                      {ord.buyerAddress}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-neutral-700">
                      Ekspedisi: <strong className="text-neutral-900">{ord.courier}</strong>
                    </p>
                    {ord.trackingNumber && (
                      <p className="text-neutral-600 font-mono text-[11px]">
                        No. Resi: <strong>{ord.trackingNumber}</strong>
                      </p>
                    )}
                    {ord.notes && (
                      <p className="text-amber-800 text-[11px] bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                        Catatan: "{ord.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {ord.items.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.productImage}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-neutral-900">{it.productName}</p>
                          <p className="text-neutral-500">{it.quantity} buah x {formatRupiah(it.price)}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-neutral-900">
                        {formatRupiah(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom actions & status progression */}
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-neutral-500">Total Transaksi: </span>
                    <strong className="text-base font-extrabold text-[#D90816] ml-1">
                      {formatRupiah(ord.grandTotal)}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.orderStatus === 'menunggu_konfirmasi' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'diproses')}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm"
                      >
                        Konfirmasi & Proses Pesanan
                      </button>
                    )}

                    {ord.orderStatus === 'diproses' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'dikirim')}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition shadow-sm flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Kirim Paket & Resi Otomatis</span>
                      </button>
                    )}

                    {ord.orderStatus === 'dikirim' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'selesai')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Konfirmasi Paket Tiba (Selesai)</span>
                      </button>
                    )}

                    {ord.orderStatus === 'selesai' && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pesanan Telah Tuntas</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 text-xs text-neutral-400">
          Tidak ada pesanan pada kategori filter ini.
        </div>
      )}
    </div>
  );
};
