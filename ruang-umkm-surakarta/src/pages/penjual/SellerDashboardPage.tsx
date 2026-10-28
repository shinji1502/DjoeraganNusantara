import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
  FileCheck,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  PlusCircle,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatTanggal, getOrderStatusBadge } from '../../utils/formatters';
import { BatikKawung } from '../../components/common/BatikOrnament';

const SALES_TREND_DATA = [
  { day: 'Sen', omzet: 2400000, pesanan: 6 },
  { day: 'Sel', omzet: 3100000, pesanan: 8 },
  { day: 'Rab', omzet: 2800000, pesanan: 7 },
  { day: 'Kam', omzet: 4200000, pesanan: 11 },
  { day: 'Jum', omzet: 5600000, pesanan: 15 },
  { day: 'Sab', omzet: 7800000, pesanan: 22 },
  { day: 'Min', omzet: 8900000, pesanan: 26 },
];

export const SellerDashboardPage: React.FC = () => {
  const { currentUser, products, orders, updateOrderStatus } = useApp();

  const isDemoSeller = currentUser.id === 'user-seller-1';

  // Products belonging to this seller
  const myProducts = products.filter((p) => p.sellerId === currentUser.id);

  // Orders for this seller
  const myOrders = orders.filter((o) => o.sellerId === currentUser.id);

  // Stats
  const activeProducts = myProducts.filter((p) => p.status === 'aktif');
  const lowStockProducts = myProducts.filter((p) => p.stock < 5 && p.stock > 0);
  const newOrders = myOrders.filter((o) => o.orderStatus === 'menunggu_konfirmasi');
  const processingOrders = myOrders.filter((o) => o.orderStatus === 'diproses');

  const totalRevenue = myOrders
    .filter((o) => o.orderStatus !== 'dibatalkan')
    .reduce((sum, o) => sum + o.grandTotal, 0) + (isDemoSeller ? 18500000 : 0);

  const salesTrendData = isDemoSeller
    ? SALES_TREND_DATA
    : [
        { day: 'Sen', omzet: 0, pesanan: 0 },
        { day: 'Sel', omzet: 0, pesanan: 0 },
        { day: 'Rab', omzet: 0, pesanan: 0 },
        { day: 'Kam', omzet: 0, pesanan: 0 },
        { day: 'Jum', omzet: 0, pesanan: 0 },
        { day: 'Sab', omzet: 0, pesanan: 0 },
        { day: 'Min', omzet: 0, pesanan: 0 },
      ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner with Store Name & Verification Status */}
      <div className="card-heritage p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle Kawung watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none hidden md:block">
          <BatikKawung className="w-56 h-56 text-[#8C5835]" />
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C5835]">
              Operasional Toko UMKM
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C5835] text-[11px] font-bold border border-[#C5A059]/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              NIB {currentUser.nib || (isDemoSeller ? '0220009831921' : '-')} Terverifikasi
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917]">
            {currentUser.storeName || (isDemoSeller ? 'Batik Danar Srikandi Solo' : 'Toko UMKM')}
          </h1>
          <p className="text-xs text-[#57534E]">
            Penanggung Jawab: <strong className="text-[#1C1917]">{currentUser.name}</strong> • Wilayah: {currentUser.address || 'Surakarta'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link
            to="/penjual/produk/tambah"
            className="px-5 py-2.5 rounded-full bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition flex items-center gap-1.5 shadow-md shadow-[#B81D24]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </Link>
          <Link
            to="/penjual/pesanan"
            className="px-4 py-2.5 rounded-full border border-[#D6CEC2] text-[#1C1917] text-xs font-bold hover:border-[#8C5835] bg-white transition"
          >
            Kelola Pesanan
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-heritage p-5 space-y-1">
          <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
            <span>Total Omzet Toko</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1917]">{formatRupiah(totalRevenue)}</p>
          {isDemoSeller ? (
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +14.8% dari bulan lalu
            </p>
          ) : totalRevenue > 0 ? (
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Akumulasi pesanan masuk
            </p>
          ) : (
            <p className="text-[11px] text-[#A8A29E] font-medium">
              0% • Belum ada transaksi penjualan
            </p>
          )}
        </div>

        <div className="card-heritage p-5 space-y-1">
          <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
            <span>Pesanan Perlu Diproses</span>
            <Clock className="w-4 h-4 text-[#B81D24]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#B81D24]">
            {newOrders.length + processingOrders.length} Pesanan
          </p>
          <p className="text-[11px] text-[#78716C]">
            {newOrders.length} baru, {processingOrders.length} sedang dikemas
          </p>
        </div>

        <div className="card-heritage p-5 space-y-1">
          <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
            <span>Produk Aktif di Etalase</span>
            <Package className="w-4 h-4 text-[#8C5835]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1917]">{activeProducts.length} Produk</p>
          <p className="text-[11px] text-[#78716C]">Katalog live di portal belanja</p>
        </div>

        <div className="card-heritage p-5 space-y-1">
          <div className="flex items-center justify-between text-[#78716C] text-xs font-medium">
            <span>Peringatan Stok Menipis</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-amber-600">{lowStockProducts.length} Produk</p>
          <Link to="/penjual/stok" className="text-[11px] text-[#8C5835] hover:text-[#B81D24] font-semibold hover:underline block">
            Perbarui stok produk &rarr;
          </Link>
        </div>
      </div>

      {/* Chart: Tren Penjualan Mingguan */}
      <div className="card-heritage p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">Grafik Penjualan & Tren Transaksi</h3>
            <p className="text-xs text-[#57534E]">Pantau pertumbuhan omzet harian dari kanal B2C dan QRIS.</p>
          </div>
          <span className="text-xs text-[#57534E] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E7DFD5]">
            {isDemoSeller || myOrders.length > 0 ? 'Rentang: 7 Hari Terakhir' : 'Belum Ada Transaksi (Rp 0)'}
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B81D24" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#B81D24" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7DFD5" />
              <XAxis dataKey="day" stroke="#78716C" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#78716C"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => val === 0 ? 'Rp0' : `Rp${(val / 1000000).toFixed(1)}Jt`}
              />
              <Tooltip
                formatter={(value: any) => [formatRupiah(Number(value)), 'Omzet']}
                contentStyle={{ borderRadius: '16px', border: '1px solid #E7DFD5', backgroundColor: '#FAF7F2', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="omzet" stroke="#B81D24" strokeWidth={3} fillOpacity={1} fill="url(#colorOmzet)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pesanan Masuk Terbaru */}
      <div className="card-heritage p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#1C1917]">Pesanan Masuk Terbaru</h3>
          <Link to="/penjual/pesanan" className="text-xs font-bold text-[#8C5835] hover:text-[#B81D24] transition">
            Buka Semua Pesanan &rarr;
          </Link>
        </div>

        {myOrders.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {myOrders.slice(0, 4).map((ord) => {
              const badge = getOrderStatusBadge(ord.orderStatus);
              return (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{ord.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-neutral-500">
                      Pembeli: <strong className="text-neutral-800">{ord.buyerName}</strong> ({ord.buyerPhone}) • {ord.courier}
                    </p>
                    <p className="font-bold text-neutral-900">
                      Nilai: {formatRupiah(ord.grandTotal)} ({ord.paymentMethod})
                    </p>
                  </div>

                  {/* Quick Action Button for Seller */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {ord.orderStatus === 'menunggu_konfirmasi' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'diproses')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                      >
                        Konfirmasi & Kemas
                      </button>
                    )}
                    {ord.orderStatus === 'diproses' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'dikirim')}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition"
                      >
                        Serahkan ke Kurir
                      </button>
                    )}
                    {ord.orderStatus === 'dikirim' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'selesai')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                      >
                        Tandai Selesai
                      </button>
                    )}
                    <Link
                      to="/penjual/pesanan"
                      className="px-3 py-1.5 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 py-6 text-center">Belum ada pesanan masuk.</p>
        )}
      </div>

      {/* Produk & Etalase Toko with Photos */}
      <div className="card-heritage p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">Foto & Etalase Produk Toko</h3>
            <p className="text-xs text-[#57534E]">Visual produk aktif yang tampil di portal pembeli.</p>
          </div>
          <Link to="/penjual/produk" className="text-xs font-bold text-[#8C5835] hover:text-[#B81D24] transition">
            Kelola Semua Produk &rarr;
          </Link>
        </div>

        {myProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {myProducts.slice(0, 4).map((p) => {
              const photo = p.images?.[0] || '';
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl border border-[#E7DFD5] bg-[#FAF7F2] hover:border-[#C5A059] transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-200 mb-2.5">
                      {photo ? (
                        <img
                          src={photo}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#A8A29E]">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold">
                        Stok: {p.stock} pcs
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#1C1917] line-clamp-1">{p.name}</h4>
                    <p className="text-[10px] text-[#78716C] mt-0.5">{p.category}</p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#E7DFD5] flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#1C1917]">{formatRupiah(p.price)}</span>
                    <span className="text-[10px] text-[#78716C]">Terjual {p.soldCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-dashed border-[#D6CEC2] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F5EFEB] flex items-center justify-center mx-auto text-[#8C5835] border border-[#E7DFD5]">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#1C1917]">Belum ada produk di etalase toko Anda</p>
              <p className="text-[11px] text-[#78716C]">Mulai tambahkan produk pertama Anda agar pembeli dapat melihat dan berbelanja.</p>
            </div>
            <Link
              to="/penjual/produk/tambah"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Produk Sekarang</span>
            </Link>
          </div>
        )}
      </div>
      </div>
  );
};
