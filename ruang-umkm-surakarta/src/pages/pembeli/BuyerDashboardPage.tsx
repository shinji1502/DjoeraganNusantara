import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Search,
  ArrowRight,
  Store,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, getOrderStatusBadge } from '../../utils/formatters';
import { ProductCard } from '../../components/common/ProductCard';

export const BuyerDashboardPage: React.FC = () => {
  const { currentUser, orders, products } = useApp();
  const navigate = useNavigate();
  const [searchWord, setSearchWord] = useState('');

  // Orders for current buyer
  const buyerOrders = orders.filter((o) => o.buyerId === currentUser.id);

  const pendingOrders = buyerOrders.filter(
    (o) => o.orderStatus === 'menunggu_konfirmasi' || o.orderStatus === 'diproses'
  );
  const completedOrders = buyerOrders.filter((o) => o.orderStatus === 'selesai');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchWord.trim()) {
      navigate(`/pembeli/katalog?cari=${encodeURIComponent(searchWord.trim())}`);
    }
  };

  const recommendedProducts = products.filter((p) => p.isCurated).slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Personal Greeting Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Konsumen Resmi Surakarta</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Sugeng Rawuh, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Temukan produk khas Solo berkualitas dari perajin lokal yang terjamin keasliannya dan dukung pertumbuhan ekonomi UMKM Surakarta.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari batik tulis, serabi, kerajinan..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-[#FAF8F7] border border-neutral-300 focus:outline-none focus:border-[#D90816] focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition shrink-0"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* KPI Status Pesanan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-medium">Total Pesanan</span>
            <p className="text-2xl font-extrabold text-neutral-900 mt-1">{buyerOrders.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-medium">Sedang Diproses/Dikirim</span>
            <p className="text-2xl font-extrabold text-[#D90816] mt-1">{pendingOrders.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FDEBEC] text-[#D90816] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-medium">Pesanan Selesai</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{completedOrders.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Pesanan Terbaru Anda</h2>
          <Link
            to="/pembeli/pesanan"
            className="text-xs font-bold text-[#D90816] hover:underline flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {buyerOrders.length > 0 ? (
          <div className="space-y-3">
            {buyerOrders.slice(0, 3).map((ord) => {
              const badge = getOrderStatusBadge(ord.orderStatus);
              return (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl border border-neutral-200 bg-[#FAF8F7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-neutral-900">{ord.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Toko: <strong className="text-neutral-800">{ord.sellerName}</strong> • {ord.items.length} Barang
                    </p>
                    <p className="text-xs font-bold text-neutral-900">
                      Total: {formatRupiah(ord.grandTotal)}
                    </p>
                  </div>

                  <Link
                    to="/pembeli/pesanan"
                    className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-800 hover:border-neutral-900 transition self-end sm:self-center"
                  >
                    Lacak Pengiriman
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-400 text-xs">
            Belum ada pesanan aktif. Mulai belanja produk UMKM favorit Anda!
          </div>
        )}
      </div>

      {/* Recommended Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Rekomendasi Produk Pilihan</h2>
          <Link
            to="/pembeli/katalog"
            className="text-xs font-bold text-[#D90816] hover:underline flex items-center gap-1"
          >
            <span>Buka Katalog Lengkap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
