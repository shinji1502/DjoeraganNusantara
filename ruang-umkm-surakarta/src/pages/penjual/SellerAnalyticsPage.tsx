import React from 'react';
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart as BarIcon,
  Award,
  Users,
  Building,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatRupiah } from '../../utils/formatters';

const CHANNEL_DATA = [
  { name: 'B2C (Konsumen Umum)', value: 50, color: '#D90816' },
  { name: 'B2B (Hotel & Resto Solo)', value: 30, color: '#171717' },
  { name: 'B2G (e-Katalog LKPP Pemkot)', value: 20, color: '#10B981' },
];

const MONTHLY_GMV = [
  { month: 'Mei', gmv: 18500000 },
  { month: 'Jun', gmv: 21200000 },
  { month: 'Jul', gmv: 24800000 },
  { month: 'Agu', gmv: 29000000 },
  { month: 'Sep', gmv: 33500000 },
  { month: 'Okt (Berjalan)', gmv: 38200000 },
];

export const SellerAnalyticsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Analitik & Performa Bisnis</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Laporan penjualan berbasis data riil transaksi, distribusi saluran pemasaran B2C/B2B/B2G, dan kepuasan pelanggan.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Gross Merchandise Value (GMV)</span>
          <p className="text-2xl font-extrabold text-[#D90816]">Rp 38.200.000</p>
          <p className="text-[11px] text-emerald-600 font-semibold">+22.4% MoM</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Tepat Waktu (OTIF)</span>
          <p className="text-2xl font-extrabold text-neutral-900">98.6%</p>
          <p className="text-[11px] text-neutral-500">SLA Ekspedisi Logistik Terpenuhi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Kepuasan Pelanggan (CSAT)</span>
          <p className="text-2xl font-extrabold text-emerald-600">4.9 / 5.0</p>
          <p className="text-[11px] text-neutral-500">Berdasarkan 92 ulasan pembeli</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Tingkat Retensi Pembeli</span>
          <p className="text-2xl font-extrabold text-neutral-900">44.8%</p>
          <p className="text-[11px] text-neutral-500">Pelanggan membeli ulang &gt;1 kali</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pie Chart: Channel Distribution (PDF Page 7 reference) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-[#D90816]" />
              <h3 className="font-extrabold text-base text-neutral-900">Distribusi Pendapatan per Channel (%)</h3>
            </div>
            <p className="text-xs text-neutral-500">
              Sesuai spesifikasi arsitektur platform UMKM (B2C: 50%, B2B: 30%, B2G: 20%).
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CHANNEL_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {CHANNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, 'Proporsi Penjualan']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-[#FAF8F7] rounded-xl text-xs text-neutral-600 space-y-1 border border-neutral-200/60">
            <p className="font-bold text-neutral-800">Peluang Skala Usaha:</p>
            <p>
              Kanal B2G e-Katalog LKPP Pemkot Surakarta memberikan nilai kontrak pengadaan yang stabil dan volume pesanan berskala besar.
            </p>
          </div>
        </div>

        {/* Bar Chart: GMV Growth */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarIcon className="w-4 h-4 text-[#D90816]" />
                <h3 className="font-extrabold text-base text-neutral-900">Pertumbuhan Nilai Transaksi (GMV)</h3>
              </div>
              <p className="text-xs text-neutral-500">Tren akumulasi penjualan 6 bulan terakhir dalam Rupiah.</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Tren Positif
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_GMV} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `Rp${(val / 1000000).toFixed(0)}Jt`}
                />
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val)), 'GMV']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }}
                />
                <Bar dataKey="gmv" fill="#D90816" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
