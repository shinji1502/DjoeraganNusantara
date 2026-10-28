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
import { BatikKawung } from '../../components/common/BatikOrnament';

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
      <div className="card-heritage p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle Kawung background watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <BatikKawung className="w-64 h-64 text-[#8C5835]" />
        </div>

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#C5A059]/40 text-[#8C5835] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Portal Konsumen Resmi Djoeragan Nusantara</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
            Sugeng Rawuh, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Temukan produk khas Nusantara berkualitas kurasi perajin lokal yang terjamin keasliannya dan dukung pertumbuhan UMKM mandiri.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari batik tulis, serabi, kerajinan..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-full bg-[#FAF7F2] border border-[#D6CEC2] text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition"
              />
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20 shrink-0"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* KPI Status Pesanan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-heritage p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#78716C] font-medium">Total Pesanan</span>
            <p className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{buyerOrders.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#F5EFEB] text-[#8C5835] border border-[#E7DFD5] flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="card-heritage p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#78716C] font-medium">Sedang Diproses/Dikirim</span>
            <p className="text-2xl font-serif font-bold text-[#B81D24] mt-1">{pendingOrders.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FDF2F2] text-[#B81D24] border border-[#F5C2C4] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="card-heritage p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#78716C] font-medium">Pesanan Selesai</span>
            <p className="text-2xl font-serif font-bold text-emerald-700 mt-1">{completedOrders.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="card-heritage p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">Pesanan Terbaru Anda</h2>
          <Link
            to="/pembeli/pesanan"
            className="text-xs font-bold text-[#8C5835] hover:text-[#B81D24] transition flex items-center gap-1"
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
                  className="p-4 rounded-2xl border border-[#E7DFD5] bg-[#FAF7F2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-[#1C1917]">{ord.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C]">
                      Toko: <strong className="text-[#1C1917]">{ord.sellerName}</strong> • {ord.items.length} Barang
                    </p>
                    <p className="text-xs font-bold text-[#1C1917]">
                      Total: {formatRupiah(ord.grandTotal)}
                    </p>
                  </div>

                  <Link
                    to="/pembeli/pesanan"
                    className="px-4 py-2 rounded-xl bg-white border border-[#D6CEC2] text-xs font-bold text-[#1C1917] hover:border-[#8C5835] transition self-end sm:self-center"
                  >
                    Lacak Pengiriman
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-[#A8A29E] text-xs">
            Belum ada pesanan aktif. Mulai belanja produk UMKM favorit Anda!
          </div>
        )}
      </div>

      {/* Recommended Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">Rekomendasi Produk Pilihan</h2>
          <Link
            to="/pembeli/katalog"
            className="text-xs font-bold text-[#8C5835] hover:text-[#B81D24] transition flex items-center gap-1"
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
