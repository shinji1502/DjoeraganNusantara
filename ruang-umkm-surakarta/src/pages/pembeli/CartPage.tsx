import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal, showToast } = useApp();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const shippingFee = cartSubtotal > 150000 || cartSubtotal === 0 ? 0 : 15000;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SOLOBERKAH') {
      setDiscountAmount(20000);
      showToast('Kupon "SOLOBERKAH" berhasil diterapkan! Diskon Rp 20.000.');
    } else {
      showToast('Kode kupon tidak valid. Coba gunakan: SOLOBERKAH', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Keranjang Belanja Anda Kosong</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Jelajahi batik, kuliner, dan kerajinan khas Solo di katalog kami untuk mulai berbelanja.
        </p>
        <Link
          to="/katalog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition shadow-md shadow-[#D90816]/20"
        >
          <span>Jelajahi Produk UMKM</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Keranjang Belanja</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Tinjau item yang dipilih sebelum melanjutkan ke pembayaran.</p>
        </div>
        <Link
          to="/katalog"
          className="text-xs font-semibold text-[#D90816] hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Tambah Produk Lain</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-neutral-100 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    {item.product.sellerName}
                  </span>
                  <Link
                    to={`/produk/${item.product.id}`}
                    className="font-bold text-sm text-neutral-900 hover:text-[#D90816] transition line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs font-extrabold text-[#D90816]">
                    {formatRupiah(item.product.price)}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-[#FAF8F7]">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-200 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-neutral-900 min-w-[30px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-200 font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <span className="text-[10px] text-neutral-400 block">Subtotal:</span>
                  <span className="text-xs font-extrabold text-neutral-900">
                    {formatRupiah(item.product.price * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 transition"
                  title="Hapus dari keranjang"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-neutral-900">Ringkasan Belanja</h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Kode kupon (SOLOBERKAH)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 uppercase focus:outline-none focus:border-[#D90816]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition"
              >
                Gunakan
              </button>
            </form>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Subtotal Barang:</span>
                <span className="font-semibold text-neutral-900">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Ongkir (Kota Solo):</span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">GRATIS (&gt;150rb)</strong> : formatRupiah(shippingFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Kupon:</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm font-extrabold text-neutral-900">
                <span>Total Tagihan:</span>
                <span className="text-[#D90816] text-base">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/pembeli/checkout')}
              className="w-full py-3.5 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shadow-lg shadow-[#D90816]/25 flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Checkout Simulasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simulasi pembayaran aman berstandar QRIS Bank Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
