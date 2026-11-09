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
  AlertCircle,
  MessageSquareWarning,
  Send,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatTanggal, getOrderStatusBadge } from '../../utils/formatters';
import { Order, OrderItem } from '../../types';

export const BuyerOrdersPage: React.FC = () => {
  const { orders, currentUser, updateOrderStatus, reviews, addReview, addComplaint, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Confirmation modal state
  const [orderToConfirm, setOrderToConfirm] = useState<Order | null>(null);

  // Review modal state
  const [reviewTarget, setReviewTarget] = useState<{
    orderId: string;
    item: OrderItem;
    sellerName: string;
  } | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');

  // Complaint modal state
  const [complaintOrder, setComplaintOrder] = useState<Order | null>(null);
  const [complaintCategory, setComplaintCategory] = useState<string>('Barang Rusak / Cacat');
  const [complaintMessage, setComplaintMessage] = useState<string>('');
  const [complaintPriority, setComplaintPriority] = useState<'rendah' | 'sedang' | 'tinggi'>('sedang');

  // Buyer orders
  const myOrders = orders.filter((o) => o.buyerId === currentUser.id);

  const filteredOrders = myOrders.filter((ord) => {
    if (statusFilter === 'semua') return true;
    return ord.orderStatus === statusFilter;
  });

  const handleConfirmReceived = () => {
    if (!orderToConfirm) return;
    updateOrderStatus(orderToConfirm.id, 'selesai');
    showToast(`Pesanan #${orderToConfirm.orderNumber} berhasil dikonfirmasi selesai!`, 'success');

    // Prompt user to review the first item
    const firstItem = orderToConfirm.items[0];
    setOrderToConfirm(null);

    if (firstItem) {
      setReviewTarget({
        orderId: orderToConfirm.id,
        item: firstItem,
        sellerName: orderToConfirm.sellerName,
      });
      setRatingInput(5);
      setCommentInput('');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget || !commentInput.trim()) {
      showToast('Harap tuliskan komentar ulasan Anda.', 'error');
      return;
    }

    addReview({
      productId: reviewTarget.item.productId,
      orderId: reviewTarget.orderId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      rating: ratingInput,
      comment: commentInput.trim(),
    });

    setReviewTarget(null);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintOrder || !complaintMessage.trim()) {
      showToast('Harap tuliskan detail kendala pesanan Anda.', 'error');
      return;
    }

    addComplaint({
      complainantName: `${currentUser.name} (Pesanan #${complaintOrder.orderNumber} - Toko: ${complaintOrder.sellerName})`,
      userRole: 'pembeli',
      subject: `Kendala ${complaintCategory} - Pesanan #${complaintOrder.orderNumber}`,
      message: `[Kategori: ${complaintCategory}] Toko: ${complaintOrder.sellerName}. Keterangan: ${complaintMessage.trim()}`,
      priority: complaintPriority,
    });

    setComplaintOrder(null);
    setComplaintMessage('');
  };

  const ratingDescriptions: Record<number, string> = {
    1: 'Sangat Buruk - Tidak sesuai deskripsi',
    2: 'Kurang Puas - Ada kendala/cacat',
    3: 'Cukup Baik - Standar',
    4: 'Bagus - Kualitas sesuai harapan',
    5: 'Sangat Istimewa - Sangat direkomendasikan!',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Pesanan Saya</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Pantau status pemrosesan pesanan, konfirmasi penerimaan barang, resi kurir, dan testimoni produk UMKM Solo.
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
                    <Link
                      to={`/toko/${ord.sellerId}`}
                      className="font-semibold text-neutral-800 hover:text-[#D90816] transition"
                    >
                      {ord.sellerName}
                    </Link>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {ord.items.map((it) => {
                    const hasReviewed = reviews.some(
                      (r) => r.productId === it.productId && r.orderId === ord.id
                    );

                    return (
                      <div key={it.productId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 first:pt-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.productImage}
                            alt={it.productName}
                            className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                          />
                          <div>
                            <Link
                              to={`/produk/${it.productId}`}
                              className="font-bold text-xs sm:text-sm text-neutral-900 hover:text-[#D90816] transition line-clamp-1"
                            >
                              {it.productName}
                            </Link>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {it.quantity} barang x {formatRupiah(it.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="font-extrabold text-xs sm:text-sm text-neutral-900">
                            {formatRupiah(it.price * it.quantity)}
                          </span>

                          {/* Review Button for individual item if finished */}
                          {ord.orderStatus === 'selesai' && (
                            <button
                              onClick={() => {
                                setReviewTarget({
                                  orderId: ord.id,
                                  item: it,
                                  sellerName: ord.sellerName,
                                });
                                setRatingInput(5);
                                setCommentInput('');
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                hasReviewed
                                  ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{hasReviewed ? 'Ulas Lagi' : 'Beri Ulasan'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer card: grand total & action buttons */}
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-neutral-500">Total Pembayaran ({ord.paymentMethod}): </span>
                    <strong className="text-sm font-extrabold text-[#D90816] ml-1">
                      {formatRupiah(ord.grandTotal)}
                    </strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Action 1: Konfirmasi Pesanan Diterima (HANYA SAAT DIKIRIM) */}
                    {ord.orderStatus === 'dikirim' && (
                      <button
                        onClick={() => setOrderToConfirm(ord)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm animate-pulse"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Konfirmasi Pesanan Diterima</span>
                      </button>
                    )}

                    {/* Action 2: Ajukan Komplain */}
                    <button
                      onClick={() => {
                        setComplaintOrder(ord);
                        setComplaintCategory('Barang Rusak / Cacat');
                        setComplaintMessage('');
                        setComplaintPriority('sedang');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-600 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition flex items-center gap-1"
                      title="Ajukan Pengaduan Konsumen"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-neutral-400 hover:text-red-600" />
                      <span>Komplain</span>
                    </button>

                    {/* Action 3: Nota Digital */}
                    <button
                      onClick={() => setSelectedOrderForInvoice(ord)}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Nota Digital</span>
                    </button>

                    {/* Action 4: Lacak Pengiriman */}
                    <button
                      onClick={() => setSelectedOrderForTracking(ord)}
                      className="px-4 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-xs"
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

      {/* Modal: Konfirmasi Pesanan Diterima */}
      {orderToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-neutral-200 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif font-extrabold text-lg text-neutral-900">
                Konfirmasi Paket Telah Tiba?
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Pastikan Anda telah memeriksa paket #{orderToConfirm.orderNumber} dari <strong>{orderToConfirm.sellerName}</strong> dan seluruh barang dalam kondisi baik dan sesuai pesanan.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setOrderToConfirm(null)}
                className="flex-1 py-2.5 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition"
              >
                Belum Tiba
              </button>
              <button
                onClick={handleConfirmReceived}
                className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                Ya, Paket Diterima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Beri Ulasan & Rating */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSubmitReview}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-neutral-200 animate-scale-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif font-extrabold text-base text-neutral-900">Beri Ulasan Produk</h3>
                <p className="text-[11px] text-neutral-500">{reviewTarget.sellerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-2xl border border-neutral-200">
              <img
                src={reviewTarget.item.productImage}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
              />
              <div className="text-xs">
                <p className="font-bold text-neutral-900 line-clamp-1">{reviewTarget.item.productName}</p>
                <p className="text-[11px] text-neutral-500">{formatRupiah(reviewTarget.item.price)}</p>
              </div>
            </div>

            {/* Interactive Stars */}
            <div className="text-center space-y-2 py-2">
              <span className="text-xs font-bold text-neutral-700 block">Kualitas Produk Secara Keseluruhan:</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-amber-800 bg-amber-50 py-1 px-3 rounded-full inline-block border border-amber-200/60">
                {ratingDescriptions[ratingInput]}
              </p>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Tulis Ulasan / Pengalaman Belanja:
              </label>
              <textarea
                rows={4}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Bagikan pengalaman Anda tentang bahan, keaslian, pengemasan, atau aroma produk..."
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-neutral-300 focus:outline-none focus:border-[#D90816] focus:ring-1 focus:ring-[#D90816]"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="px-5 py-2 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#D90816] to-[#98141A] text-white text-xs font-bold hover:from-[#98141A] hover:to-[#7A0D13] transition shadow-sm"
              >
                Kirim Ulasan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Form Pengaduan Konsumen */}
      {complaintOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSubmitComplaint}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-neutral-200 animate-scale-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-50 text-red-700">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-extrabold text-base text-neutral-900">Layanan Pengaduan Konsumen</h3>
                  <p className="text-[11px] text-neutral-500">SLA Tanggapan &lt;24 Jam (Permendag 19/2026)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setComplaintOrder(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#FAF8F7] rounded-xl text-xs space-y-1 border border-neutral-200">
              <p><strong>Nomor Pesanan:</strong> {complaintOrder.orderNumber}</p>
              <p><strong>Mitra Toko Terlapor:</strong> {complaintOrder.sellerName}</p>
            </div>

            <div className="text-xs space-y-1">
              <label className="font-bold text-neutral-700 block">Kategori Kendala</label>
              <select
                value={complaintCategory}
                onChange={(e) => setComplaintCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:outline-none focus:border-[#D90816]"
              >
                <option value="Barang Rusak / Cacat">Barang Rusak / Cacat Fisik</option>
                <option value="Salah Kirim Barang">Salah Kirim Barang / Varian</option>
                <option value="Keterlambatan Ekspedisi">Keterlambatan Pengiriman Melebihi Batas</option>
                <option value="Ketidaksesuaian Mutu/Sertifikasi">Ketidaksesuaian Mutu / Keaslian Produk</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="text-xs space-y-1">
              <label className="font-bold text-neutral-700 block">Tingkat Urgensi</label>
              <div className="grid grid-cols-3 gap-2">
                {(['rendah', 'sedang', 'tinggi'] as const).map((prio) => (
                  <button
                    key={prio}
                    type="button"
                    onClick={() => setComplaintPriority(prio)}
                    className={`py-2 rounded-xl font-bold capitalize transition border text-xs ${
                      complaintPriority === prio
                        ? 'border-[#D90816] bg-[#FDEBEC] text-[#D90816]'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {prio}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="font-bold text-neutral-700 block">Kronologi & Keterangan Rinci:</label>
              <textarea
                rows={4}
                value={complaintMessage}
                onChange={(e) => setComplaintMessage(e.target.value)}
                placeholder="Jelaskan kendala yang dialami, nomor resi, atau kondisi saat paket diterima..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setComplaintOrder(null)}
                className="px-5 py-2 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Tiket Pengaduan</span>
              </button>
            </div>
          </form>
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
