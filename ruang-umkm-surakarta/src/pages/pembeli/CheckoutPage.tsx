import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  ShieldCheck,
  ChevronLeft,
  CheckCircle2,
  Building,
  Store,
  Plus,
  Check,
  Edit2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { QRISModal } from '../../components/common/QRISModal';
import { PaymentMethod, Address } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, currentUser, createOrder, addresses, showToast } = useApp();
  const navigate = useNavigate();

  // Find primary address or first saved address
  const defaultAddress = useMemo(() => {
    return addresses.find((a) => a.isPrimary) || addresses[0] || null;
  }, [addresses]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id || 'default');
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);

  const [recipientName, setRecipientName] = useState(defaultAddress?.recipientName || currentUser.name);
  const [recipientPhone, setRecipientPhone] = useState(defaultAddress?.phone || currentUser.phone);
  const [recipientAddress, setRecipientAddress] = useState(
    defaultAddress?.fullAddress || currentUser.address || 'Jl. Slamet Riyadi No. 142, Banjarsari, Kota Surakarta'
  );

  // When selected address changes, auto-populate inputs
  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setRecipientName(addr.recipientName);
    setRecipientPhone(addr.phone);
    setRecipientAddress(addr.fullAddress);
    setIsAddressSelectorOpen(false);
    showToast(`Alamat pengiriman dialihkan ke "${addr.title}".`, 'info');
  };

  const [selectedCourier, setSelectedCourier] = useState('JNE Reguler Solo');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('QRIS');
  const [orderNotes, setOrderNotes] = useState('');
  const [isQRISOpen, setIsQRISOpen] = useState(false);

  // Group items by seller
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

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 card-heritage p-8">
        <h2 className="text-2xl font-serif font-bold text-[#1C1917]">Tidak ada item untuk di-checkout</h2>
        <Link
          to="/katalog"
          className="inline-block px-6 py-2.5 rounded-full bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const shippingFee = cartSubtotal > 150000 ? 0 : 15000;
  const grandTotal = cartSubtotal + shippingFee;

  const handleOpenPayment = () => {
    if (!recipientAddress.trim() || !recipientPhone.trim()) {
      showToast('Harap lengkapi alamat dan nomor telepon pengiriman.', 'error');
      return;
    }
    setIsQRISOpen(true);
  };

  const handleSimulatedPaymentSuccess = () => {
    setIsQRISOpen(false);

    // Create split orders for each seller in cart so each seller sees their respective sub-orders
    itemsBySeller.forEach((sellerGroup) => {
      const sellerSubtotal = sellerGroup.items.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
      const sellerShipping = sellerSubtotal > 150000 ? 0 : Math.round(shippingFee / itemsBySeller.length);

      createOrder({
        buyerName: recipientName,
        buyerPhone: recipientPhone,
        buyerAddress: recipientAddress,
        sellerId: sellerGroup.sellerId,
        sellerName: sellerGroup.sellerName,
        items: sellerGroup.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
        })),
        subtotal: sellerSubtotal,
        shippingFee: sellerShipping,
        discount: 0,
        grandTotal: sellerSubtotal + sellerShipping,
        paymentMethod: selectedPayment,
        courier: selectedCourier,
        notes: orderNotes,
      });
    });

    navigate('/pembeli/pesanan');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/pembeli/keranjang"
          className="p-2 rounded-full hover:bg-[#E7DFD5]/60 text-[#57534E] transition border border-[#E7DFD5]"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">Checkout Pesanan</h1>
          <p className="text-xs text-[#57534E]">Konfirmasi alamat dan selesaikan transaksi pembayaran Ruang UMKM Surakarta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Alamat, Kurir, Metode Pembayaran */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Alamat Pengiriman */}
          <div className="card-heritage p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5]">
              <div className="flex items-center gap-2 text-[#1C1917] font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#B81D24]" />
                <span>Alamat Pengiriman (Surakarta)</span>
              </div>

              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddressSelectorOpen(!isAddressSelectorOpen)}
                  className="text-xs font-bold text-[#8C5835] hover:text-[#B81D24] transition flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isAddressSelectorOpen ? 'Tutup Pilihan' : 'Pilih Alamat Lain'}</span>
                </button>
              )}
            </div>

            {/* Address Switcher Accordion */}
            {isAddressSelectorOpen && addresses.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3 animate-fade-in">
                <span className="text-xs font-bold text-[#1C1917] block">Pilih dari Alamat Tersimpan:</span>
                <div className="space-y-2">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleSelectAddress(a)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                        selectedAddressId === a.id
                          ? 'border-[#B81D24] bg-white ring-1 ring-[#B81D24]'
                          : 'border-[#E7DFD5] bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-[#1C1917]">{a.title}</strong>
                          {a.isPrimary && (
                            <span className="px-2 py-0.2 bg-[#FDEBEC] text-[#B81D24] text-[10px] font-bold rounded">
                              Utama
                            </span>
                          )}
                          <span className="text-[10px] text-stone-500">Kec. {a.district}</span>
                        </div>
                        <p className="text-stone-600 font-medium">{a.recipientName} ({a.phone})</p>
                        <p className="text-stone-500 text-[11px] leading-relaxed">{a.fullAddress}</p>
                      </div>
                      {selectedAddressId === a.id && (
                        <Check className="w-4 h-4 text-[#B81D24] shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-right">
                  <Link
                    to="/pembeli/alamat"
                    className="text-xs font-bold text-[#B81D24] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Kelola & Tambah Alamat Baru</span>
                  </Link>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#57534E] block mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D6CEC2] focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#57534E] block mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D6CEC2] focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#57534E] block mb-1">Alamat Lengkap di Surakarta</label>
                <textarea
                  rows={2}
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D6CEC2] focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#57534E] block mb-1">Catatan Tambahan untuk Kurir (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Titipkan di pos satpam bila rumah kosong"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D6CEC2] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Opsi Kurir */}
          <div className="card-heritage p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#1C1917] font-bold text-sm">
              <Truck className="w-4 h-4 text-[#B81D24]" />
              <span>Pilihan Ekspedisi Pengiriman</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'JNE Reguler Solo', eta: '1-2 Hari', fee: 15000 },
                { name: 'SiCepat Ekspres', eta: '1 Hari', fee: 15000 },
                { name: 'GoSend Instant Solo', eta: '2-3 Jam', fee: 20000 },
              ].map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setSelectedCourier(c.name)}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    selectedCourier === c.name
                      ? 'border-[#B81D24] bg-[#FDF2F2] ring-1 ring-[#B81D24]'
                      : 'border-[#E7DFD5] hover:border-[#C5A059] bg-[#FAF7F2]'
                  }`}
                >
                  <p className="font-bold text-xs text-[#1C1917]">{c.name}</p>
                  <p className="text-[10px] text-[#78716C] mt-0.5">Estimasi: {c.eta}</p>
                  <p className="text-xs font-extrabold text-[#B81D24] mt-2">{formatRupiah(c.fee)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Pilihan Metode Pembayaran */}
          <div className="card-heritage p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#1C1917] font-bold text-sm">
              <CreditCard className="w-4 h-4 text-[#B81D24]" />
              <span>Metode Pembayaran</span>
            </div>

            <div className="space-y-2.5">
              {/* QRIS Option */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPayment === 'QRIS'
                    ? 'border-[#B81D24] bg-[#FDF2F2] ring-1 ring-[#B81D24]'
                    : 'border-[#E7DFD5] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPayment === 'QRIS'}
                    onChange={() => setSelectedPayment('QRIS')}
                    className="text-[#B81D24] focus:ring-[#B81D24]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1C1917]">QRIS Dinamis (Rekomendasi)</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#B81D24] text-white text-[9px] font-bold">
                        INSTAN
                      </span>
                    </div>
                    <p className="text-[11px] text-[#78716C] mt-0.5">
                      Satu kode QR untuk semua e-wallet & m-banking (BCA, Mandiri, BRImo, GoPay, OVO, ShopeePay).
                    </p>
                  </div>
                </div>
                <QrCode className="w-6 h-6 text-[#B81D24]" />
              </label>

              {/* Virtual Account BCA */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPayment === 'VA_BCA'
                    ? 'border-[#B81D24] bg-[#FDF2F2] ring-1 ring-[#B81D24]'
                    : 'border-[#E7DFD5] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPayment === 'VA_BCA'}
                    onChange={() => setSelectedPayment('VA_BCA')}
                    className="text-[#B81D24] focus:ring-[#B81D24]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#1C1917]">BCA Virtual Account</span>
                    <p className="text-[11px] text-[#78716C] mt-0.5">Transfer via m-BCA / KlikBCA</p>
                  </div>
                </div>
              </label>

              {/* SPM Pemkot (B2G LKPP) */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPayment === 'SPM_PEMKOT'
                    ? 'border-[#B81D24] bg-[#FDF2F2] ring-1 ring-[#B81D24]'
                    : 'border-[#E7DFD5] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPayment === 'SPM_PEMKOT'}
                    onChange={() => setSelectedPayment('SPM_PEMKOT')}
                    className="text-[#B81D24] focus:ring-[#B81D24]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#1C1917]">Surat Perintah Membayar (SPM) Pemkot B2G</span>
                    <p className="text-[11px] text-[#78716C] mt-0.5">Khusus Pengadaan e-Katalog Belanja Dinas APBD</p>
                  </div>
                </div>
                <Building className="w-5 h-5 text-[#8C5835]" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary: Ringkasan Produk & Bayar Button */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-heritage p-6 space-y-5">
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">Ringkasan Belanja ({itemsBySeller.length} Toko)</h3>

            {/* Items Grouped by Seller */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {itemsBySeller.map((group) => (
                <div key={group.sellerId} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2.5">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-[#E7DFD5] text-xs font-bold text-[#1C1917]">
                    <Store className="w-3.5 h-3.5 text-[#8C5835]" />
                    <span>{group.sellerName}</span>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-[#E7DFD5]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div>
                            <p className="font-bold text-[#1C1917] line-clamp-1 max-w-[150px]">{item.product.name}</p>
                            <p className="text-[10px] text-[#78716C]">{item.quantity} x {formatRupiah(item.product.price)}</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-[#1C1917]">
                          {formatRupiah(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Total calculation breakdown */}
            <div className="pt-3 border-t border-[#E7DFD5] space-y-2 text-xs text-[#57534E]">
              <div className="flex justify-between">
                <span>Subtotal Barang:</span>
                <span className="font-semibold text-[#1C1917]">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pengiriman:</span>
                <span className="font-semibold text-[#1C1917]">{formatRupiah(shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan Platform:</span>
                <span className="text-emerald-700 font-semibold">Rp 0 (Subsidi Pemkot)</span>
              </div>
              <div className="pt-3 border-t border-[#E7DFD5] flex justify-between text-base font-extrabold text-[#1C1917]">
                <span>Total Pembayaran:</span>
                <span className="text-[#B81D24] text-xl font-serif font-bold">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleOpenPayment}
              className="w-full py-3.5 rounded-full bg-[#B81D24] text-white font-bold text-xs hover:bg-[#98141A] transition shadow-lg shadow-[#B81D24]/25 flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Bayar Sekarang (Buka QRIS Simulasi)</span>
            </button>

            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#C5A059]/40 text-[11px] text-[#57534E] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C5835] shrink-0 mt-0.5" />
              <span>
                <strong>Simulasi Prototipe:</strong> Anda akan melihat tampilan QRIS dinamis yang dapat diklik untuk menguji penyelesaian pesanan tanpa biaya nyata.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QRIS Interactive Modal */}
      <QRISModal
        isOpen={isQRISOpen}
        onClose={() => setIsQRISOpen(false)}
        onSimulateSuccess={handleSimulatedPaymentSuccess}
        amount={grandTotal}
        merchantName={`RUANG UMKM SURAKARTA - ${itemsBySeller[0]?.sellerName || 'SENTRA UMKM'}`}
        orderNumber={`SKT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-DEMO`}
      />
    </div>
  );
};
