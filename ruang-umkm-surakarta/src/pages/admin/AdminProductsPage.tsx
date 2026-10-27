import React, { useState } from 'react';
import {
  Package,
  ShieldCheck,
  Eye,
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  FileText,
  Store,
  Tag,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { Product } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const { products, updateProduct, approveProduct, rejectProduct, setProductPending, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<'semua' | 'ditinjau' | 'aktif' | 'ditolak'>('ditinjau');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectModalProduct, setRejectModalProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingCount = products.filter((p) => p.status === 'ditinjau').length;
  const activeCount = products.filter((p) => p.status === 'aktif').length;
  const rejectedCount = products.filter((p) => p.status === 'ditolak').length;

  const filteredProducts = products.filter((p) => {
    // Status tab filter
    if (statusTab !== 'semua' && p.status !== statusTab) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleCuration = (id: string, current: boolean) => {
    updateProduct(id, { isCurated: !current });
    showToast(`Status kurasi produk diperbarui menjadi: ${!current ? 'Lolos Kurasi' : 'Standar'}`);
  };

  const handleApprove = (id: string) => {
    approveProduct(id);
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectModalProduct) return;
    if (!rejectionReason.trim()) {
      showToast('Harap masukkan alasan penolakan untuk bahan evaluasi UMKM.', 'error');
      return;
    }
    rejectProduct(rejectModalProduct.id, rejectionReason.trim());
    setRejectModalProduct(null);
    setRejectionReason('');
    if (selectedProduct?.id === rejectModalProduct.id) {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">
          Moderasi & Persetujuan Produk UMKM
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Tinjau kepatuhan produk yang diajukan oleh UMKM. Hanya produk yang disetujui (ACC) oleh admin yang akan ditampilkan di katalog publik.
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusTab('ditinjau')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              statusTab === 'ditinjau'
                ? 'bg-[#D90816] text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Moderasi</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-[#D90816] rounded-full text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setStatusTab('aktif')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              statusTab === 'aktif'
                ? 'bg-[#171717] text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Disetujui ({activeCount})</span>
          </button>

          <button
            onClick={() => setStatusTab('ditolak')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              statusTab === 'ditolak'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setStatusTab('semua')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              statusTab === 'semua'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Semua ({products.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari produk, toko, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-neutral-300 focus:outline-none focus:border-[#D90816]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAF8F7] text-neutral-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-6">Produk</th>
                <th className="py-3.5 px-4">Toko / UMKM</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Jual</th>
                <th className="py-3.5 px-4">Status Moderasi</th>
                <th className="py-3.5 px-4 text-center">Kurasi Mutu</th>
                <th className="py-3.5 px-6 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/80 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0 cursor-pointer"
                            onClick={() => setSelectedProduct(p)}
                          />
                          <div className="max-w-xs">
                            <p
                              onClick={() => setSelectedProduct(p)}
                              className="font-bold text-neutral-900 line-clamp-1 hover:text-[#D90816] cursor-pointer"
                            >
                              {p.name}
                            </p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              Stok: {p.stock} • Wilayah: {p.district}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-neutral-800">{p.sellerName}</td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 bg-neutral-100 rounded text-[11px] font-medium text-neutral-700">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-extrabold text-neutral-900">
                        {formatRupiah(p.price)}
                      </td>

                      <td className="py-4 px-4">
                        {p.status === 'ditinjau' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Menunggu ACC
                          </span>
                        )}
                        {p.status === 'aktif' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Tayang di Katalog
                          </span>
                        )}
                        {p.status === 'ditolak' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Ditolak
                          </span>
                        )}
                        {p.status === 'draft' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleCuration(p.id, p.isCurated)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                            p.isCurated
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          {p.isCurated ? 'Lolos Kurasi' : 'Standar'}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
                            title="Tinjau Detail Produk"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {p.status === 'ditinjau' && (
                            <>
                              <button
                                onClick={() => handleApprove(p.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Setujui (ACC)</span>
                              </button>
                              <button
                                onClick={() => {
                                  setRejectModalProduct(p);
                                  setRejectionReason('');
                                }}
                                className="px-2.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition"
                              >
                                Tolak
                              </button>
                            </>
                          )}

                          {p.status === 'aktif' && (
                            <>
                              <button
                                onClick={() => {
                                  setRejectModalProduct(p);
                                  setRejectionReason('Produk diturunkan untuk perbaikan deskripsi/izin');
                                }}
                                className="px-2.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition"
                              >
                                Takedown
                              </button>
                              <button
                                onClick={() => setProductPending(p.id)}
                                className="px-2 py-1.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 font-bold text-[11px] transition"
                                title="Kembalikan ke status Menunggu Moderasi (Pending)"
                              >
                                Pending
                              </button>
                            </>
                          )}

                          {p.status === 'ditolak' && (
                            <>
                              <button
                                onClick={() => handleApprove(p.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition"
                              >
                                Setujui Ulang
                              </button>
                              <button
                                onClick={() => setProductPending(p.id)}
                                className="px-2 py-1.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 font-bold text-[11px] transition"
                                title="Kembalikan ke status Menunggu Moderasi (Pending)"
                              >
                                Pending
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Package className="w-8 h-8 mx-auto mb-2 stroke-1" />
                    <p className="font-semibold">Tidak ada produk dalam kategori status ini</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-neutral-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-up relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full sm:w-52 h-52 rounded-2xl object-cover border border-neutral-200 shrink-0"
              />
              <div className="space-y-2 flex-1">
                <span className="text-[11px] font-bold text-[#D90816] uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <h3 className="text-xl font-extrabold text-neutral-900 leading-tight">
                  {selectedProduct.name}
                </h3>
                <p className="text-lg font-extrabold text-emerald-700">
                  {formatRupiah(selectedProduct.price)}
                </p>
                <div className="text-xs text-neutral-500 space-y-1 pt-1">
                  <p>
                    <strong>Toko:</strong> {selectedProduct.sellerName}
                  </p>
                  <p>
                    <strong>Kecamatan / Asal:</strong> {selectedProduct.district}
                  </p>
                  <p>
                    <strong>Stok Awal:</strong> {selectedProduct.stock} unit
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
              <span className="font-bold text-neutral-800 block">Deskripsi Produk:</span>
              <p className="text-neutral-600 leading-relaxed bg-[#FAF8F7] p-3 rounded-xl border border-neutral-200">
                {selectedProduct.description}
              </p>
            </div>

            {selectedProduct.certifications.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-neutral-800 block">Sertifikasi & Kepatuhan:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.certifications.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="text-xs">
                Status saat ini:{' '}
                <strong className="uppercase font-bold text-[#D90816]">
                  {selectedProduct.status}
                </strong>
              </div>

              <div className="flex items-center gap-2">
                {selectedProduct.status === 'ditinjau' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedProduct.id);
                      }}
                      className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui (ACC) Produk</span>
                    </button>
                    <button
                      onClick={() => {
                        setRejectModalProduct(selectedProduct);
                        setRejectionReason('');
                      }}
                      className="px-4 py-2.5 rounded-full border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 transition"
                    >
                      Tolak
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-neutral-200 shadow-2xl p-6 sm:p-7 space-y-4 animate-scale-up">
            <h3 className="text-base font-extrabold text-neutral-900">
              Alasan Penolakan Produk
            </h3>
            <p className="text-xs text-neutral-500">
              Berikan catatan yang jelas agar UMKM mengetahui perbaikan yang diperlukan (misal: foto produk kurang jelas, izin edar belum terlampir, atau harga tidak wajar).
            </p>

            <textarea
              rows={3}
              placeholder="Tuliskan catatan evaluasi untuk pemilik UMKM..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalProduct(null)}
                className="px-4 py-2 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
              >
                Konfirmasi Tolak Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
