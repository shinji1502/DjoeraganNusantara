import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, ChevronLeft, Store } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal, showToast } = useApp();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Group cart items by seller
  const itemsBySeller = useMemo(() => {
    const map = new Map<string, { sellerId: string; sellerName: string; items: typeof cart }>();
    cart.forEach((item) => {
      const sId = item.product.sellerId;
      const sName = item.product.sellerName;
      if (!map.has(sId)) {
        map.set(sId, { sellerId: sId, sellerName: sName, items: [] });
      }
      map.get(sId)!.items.push(item);
    });
    return Array.from(map.values());
  }, [cart]);

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
      <div className="card-heritage p-12 text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#8C5835] mx-auto border border-[#E7DFD5]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1C1917]">Keranjang Belanja Anda Kosong</h2>
        <p className="text-xs text-[#57534E] max-w-sm mx-auto leading-relaxed">
          Jelajahi batik, kuliner, dan kerajinan khas Solo di katalog kurasi kami untuk mulai berbelanja.
        </p>
        <Link
          to="/katalog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20"
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
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">Keranjang Belanja</h1>
          <p className="text-xs text-[#57534E] mt-0.5">Tinjau item pilihan sebelum melanjutkan ke konfirmasi dan pembayaran.</p>
        </div>
        <Link
          to="/katalog"
          className="text-xs font-semibold text-[#8C5835] hover:text-[#B81D24] transition flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Tambah Produk Lain</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item List */}
        {/* Cart Item List Grouped by Seller */}
        <div className="lg:col-span-8 space-y-6">
          {itemsBySeller.map((group) => (
            <div key={group.sellerId} className="card-heritage p-5 sm:p-6 space-y-4">
              {/* Store Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5]">
                <Link
                  to={`/toko/${group.sellerId}`}
                  className="flex items-center gap-2 group/store"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 text-[#8C5835] flex items-center justify-center font-bold border border-[#C5A059]/30">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1C1917] group-hover/store:text-[#B81D24] transition">
                      {group.sellerName}
                    </h3>
                    <p className="text-[10px] text-[#78716C]">Mitra Terverifikasi OSS Surakarta</p>
                  </div>
                </Link>

                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C5835] text-[10px] font-bold border border-[#E7DFD5]">
                  {group.items.length} Barang
                </span>
              </div>

              {/* Items in this Store */}
              <div className="space-y-3 divide-y divide-[#E7DFD5]/60">
                {group.items.map((item) => (
                  <div
                    key={item.productId}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-[#E7DFD5] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="space-y-1">
                        <Link
                          to={`/produk/${item.product.id}`}
                          className="font-bold text-sm text-[#1C1917] hover:text-[#B81D24] transition line-clamp-1 max-w-[280px]"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs font-extrabold text-[#B81D24]">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-5">
                      <div className="flex items-center border border-[#D6CEC2] rounded-xl overflow-hidden bg-[#FAF7F2]">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="px-2.5 py-1 text-[#57534E] hover:bg-[#E7DFD5] font-bold text-xs transition"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-[#1C1917] min-w-[30px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="px-2.5 py-1 text-[#57534E] hover:bg-[#E7DFD5] font-bold text-xs transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="text-[10px] text-[#A8A29E] block">Subtotal:</span>
                        <span className="text-xs font-extrabold text-[#1C1917]">
                          {formatRupiah(item.product.price * item.quantity)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 text-[#A8A29E] hover:text-rose-600 transition"
                        title="Hapus dari keranjang"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-heritage p-6 space-y-5">
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">Ringkasan Belanja</h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Kode kupon (SOLOBERKAH)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D6CEC2] uppercase focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-[#292524] transition shadow-xs"
              >
                Gunakan
              </button>
            </form>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-[#57534E] pt-2 border-t border-[#E7DFD5]">
              <div className="flex justify-between">
                <span>Subtotal Barang:</span>
                <span className="font-semibold text-[#1C1917]">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Ongkir (Kota Solo):</span>
                <span className="font-semibold text-[#1C1917]">
                  {shippingFee === 0 ? <strong className="text-emerald-700">GRATIS (&gt;150rb)</strong> : formatRupiah(shippingFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon Kupon:</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#E7DFD5] flex justify-between text-sm font-extrabold text-[#1C1917]">
                <span>Total Tagihan:</span>
                <span className="text-[#B81D24] text-base">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/pembeli/checkout')}
              className="w-full py-3.5 rounded-full bg-[#B81D24] text-white font-bold text-xs hover:bg-[#98141A] transition shadow-lg shadow-[#B81D24]/25 flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Checkout Simulasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-[#78716C] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simulasi pembayaran aman berstandar QRIS Bank Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
