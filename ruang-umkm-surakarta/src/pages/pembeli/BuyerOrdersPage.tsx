import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  Star,
  ExternalLink,
  ChevronDown,
  X,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatTanggal, getOrderStatusBadge } from '../../utils/formatters';
import { Order } from '../../types';

export const BuyerOrdersPage: React.FC = () => {
  const { orders, currentUser, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Buyer orders
  const myOrders = orders.filter((o) => o.buyerId === currentUser.id);

  const filteredOrders = myOrders.filter((ord) => {
    if (statusFilter === 'semua') return true;
    return ord.orderStatus === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Pesanan Saya</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Pantau status pemrosesan pesanan, resi pengiriman kurir, dan riwayat belanja produk UMKM Solo.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'semua', label: 'Semua Pesanan' },
          { key: 'diproses', label: 'Sedang Diproses' },
          { key: 'dikirim', label: 'Dalam Pengiriman' },
          { key: 'selesai', label: 'Pesanan Selesai' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === tab.key
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
                className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Header card */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-neutral-900">{ord.orderNumber}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500">{formatTanggal(ord.createdAt)}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="font-semibold text-neutral-800">{ord.sellerName}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {ord.items.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.productImage}
                          alt={it.productName}
                          className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1">
                            {it.productName}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {it.quantity} barang x {formatRupiah(it.price)}
                          </p>
                        </div>
                      </div>

                      <span className="font-extrabold text-xs sm:text-sm text-neutral-900">
                        {formatRupiah(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer card: grand total & action buttons */}
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-neutral-500">Total Pembayaran ({ord.paymentMethod}): </span>
                    <strong className="text-sm font-extrabold text-[#D90816] ml-1">
                      {formatRupiah(ord.grandTotal)}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrderForInvoice(ord)}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Nota Digital</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrderForTracking(ord)}
                      className="px-4 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Lacak Pengiriman</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Belum ada pesanan dengan status ini</h3>
          <p className="text-xs text-neutral-500">Pesanan baru yang Anda buat akan langsung muncul di sini.</p>
          <Link
            to="/pembeli/katalog"
            className="inline-block px-5 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold"
          >
            Mulai Belanja
          </Link>
        </div>
      )}

      {/* Modal: Live Tracking Simulation */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Pelacakan Paket Pengiriman</h3>
                <p className="text-xs text-neutral-500">{selectedOrderForTracking.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Courier & Resi Info */}
            <div className="p-3 bg-[#FAF8F7] rounded-2xl border border-neutral-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-500 block">Jasa Ekspedisi:</span>
                <strong className="text-neutral-900">{selectedOrderForTracking.courier}</strong>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 block">Nomor Resi:</span>
                <strong className="text-[#D90816] font-mono">{selectedOrderForTracking.trackingNumber || 'JN-SKT-88291039'}</strong>
              </div>
            </div>

            {/* Timeline steps */}
            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {selectedOrderForTracking.trackingHistory.map((step, idx) => (
                <div key={idx} className="relative text-xs space-y-0.5">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#D90816] ring-4 ring-[#FDEBEC]"></div>
                  <p className="font-bold text-neutral-900">{step.status}</p>
                  <p className="text-neutral-500">{step.location}</p>
                  <p className="text-[10px] text-neutral-400">{step.time}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-2.5 rounded-full bg-neutral-900 text-white font-bold text-xs"
            >
              Tutup Pelacakan
            </button>
          </div>
        </div>
      )}

      {/* Modal: Nota / Invoice Digital */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D90816] text-white flex items-center justify-center font-bold text-sm">
                  RU
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Nota Resmi Transaksi UMKM</h3>
                  <p className="text-[11px] text-neutral-500">Ruang UMKM Surakarta</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-50 rounded-xl">
                <div>
                  <span className="text-neutral-500 block">No. Transaksi:</span>
                  <strong className="text-neutral-900 font-mono">{selectedOrderForInvoice.orderNumber}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Tanggal:</span>
                  <strong className="text-neutral-900">{formatTanggal(selectedOrderForInvoice.createdAt)}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Mitra Toko:</span>
                  <strong className="text-neutral-900">{selectedOrderForInvoice.sellerName}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Metode Bayar:</span>
                  <strong className="text-emerald-700">{selectedOrderForInvoice.paymentMethod} (LUNAS)</strong>
                </div>
              </div>

              {/* Items in invoice */}
              <div className="divide-y divide-neutral-100 border-y border-neutral-200 py-2">
                {selectedOrderForInvoice.items.map((it) => (
                  <div key={it.productId} className="py-2 flex justify-between">
                    <div>
                      <p className="font-bold text-neutral-900">{it.productName}</p>
                      <p className="text-neutral-500">{it.quantity} x {formatRupiah(it.price)}</p>
                    </div>
                    <span className="font-bold text-neutral-900">{formatRupiah(it.quantity * it.price)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right">
                <p className="text-neutral-500">Subtotal: {formatRupiah(selectedOrderForInvoice.subtotal)}</p>
                <p className="text-neutral-500">Ongkir ({selectedOrderForInvoice.courier}): {formatRupiah(selectedOrderForInvoice.shippingFee)}</p>
                <p className="text-base font-extrabold text-[#D90816] pt-1">
                  Grand Total: {formatRupiah(selectedOrderForInvoice.grandTotal)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Fitur cetak PDF invoice demo diunduh!', 'info');
                setSelectedOrderForInvoice(null);
              }}
              className="w-full py-3 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition"
            >
              Cetak / Simpan Nota Digital
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
