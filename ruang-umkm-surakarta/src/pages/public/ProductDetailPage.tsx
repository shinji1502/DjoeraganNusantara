import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  MapPin,
  Heart,
  ShoppingBag,
  CheckCircle2,
  Store,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { ProductCard } from '../../components/common/ProductCard';
import { BatikDivider } from '../../components/common/BatikOrnament';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, currentUser, addToCart, wishlist, toggleWishlist } = useApp();

  const product = products.find((p) => p.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product || (currentUser.role !== 'admin' && currentUser.id !== product.sellerId && product.status !== 'aktif')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#1C1917]">Produk Tidak Tersedia</h2>
        <p className="text-sm text-[#78716C] max-w-md mx-auto">
          {product?.status === 'ditinjau'
            ? 'Produk ini sedang dalam proses peninjauan (Pending Moderasi) oleh Kurator Admin dan belum dapat dilihat publik.'
            : 'Produk yang Anda cari tidak tersedia atau sedang dinonaktifkan.'}
        </p>
        <Link
          to="/katalog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B81D24] text-white text-xs font-semibold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Publik</span>
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/pembeli/keranjang');
  };

  // Related products (strictly approved products only)
  const relatedProducts = products
    .filter((p) => p.status === 'aktif' && p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-theme-katalog min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#78716C]">
          <Link to="/" className="hover:text-[#1C1917] transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <Link to="/katalog" className="hover:text-[#1C1917] transition">Katalog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <span className="text-[#8C5835] font-medium">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <span className="text-[#1C1917] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery Images */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#D6CEC2] bg-[#F5EFEB] shadow-xs">
              <img
                src={product.images[selectedImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
                }}
              />
              {discountPercentage > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#B81D24] text-white text-xs font-extrabold shadow-sm">
                  Diskon {discountPercentage}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                      selectedImageIndex === idx ? 'border-[#C5A059] shadow-sm' : 'border-[#D6CEC2] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info, Price & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold border border-[#C5A059]/40">
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#B81D24]/10 text-[#98141A] text-xs font-semibold border border-[#B81D24]/20">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  Kecamatan {product.district}, Surakarta
                </span>
                {product.isCurated && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#8C5835] text-xs font-semibold border border-[#C5A059]/30">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    Produk Terkurasi
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-[#1C1917] leading-tight">
                {product.name}
              </h1>

              {/* Rating and Sold */}
              <div className="flex items-center gap-4 text-xs text-[#57534E] mt-3 pb-4 border-b border-[#E7DFD5]">
                <div className="flex items-center text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>{product.rating}</span>
                  <span className="text-[#A8A29E] font-normal ml-1">({product.reviewCount} ulasan)</span>
                </div>
                <span>•</span>
                <span>Terjual <strong>{product.soldCount} item</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">Stok: {product.stock} pcs</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#98141A]">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#A8A29E] line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Seller / Store Box */}
            <div className="p-4 rounded-2xl card-heritage flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 text-[#8C5835] flex items-center justify-center font-bold border border-[#C5A059]/30">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-[#1C1917]">{product.sellerName}</h4>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-[#78716C]">Izin Usaha NIB Terverifikasi OSS • Surakarta</p>
                </div>
              </div>

              <Link
                to={`/katalog?cari=${encodeURIComponent(product.sellerName)}`}
                className="px-4 py-2 rounded-xl border border-[#D6CEC2] bg-white text-xs font-semibold text-[#1C1917] hover:border-[#C5A059] hover:bg-[#FAF7F2] transition whitespace-nowrap"
              >
                Kunjungi Toko
              </Link>
            </div>

            {/* Certifications and Compliance */}
            {product.certifications.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#8C5835] block uppercase tracking-wider">
                  Sertifikasi & Kepatuhan Produk
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-300/60"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#8C5835] block uppercase tracking-wider">
                Deskripsi Produk
              </span>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity & CTA Area */}
            <div className="pt-4 border-t border-[#E7DFD5] space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#1C1917]">Jumlah Beli:</span>
                <div className="flex items-center border border-[#D6CEC2] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-[#57534E] hover:bg-[#FAF7F2] font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-[#1C1917] min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 text-[#57534E] hover:bg-[#FAF7F2] font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#78716C]">Tersisa {product.stock} buah</span>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 px-6 rounded-xl border border-[#B81D24] bg-white text-[#B81D24] font-bold text-sm hover:bg-[#B81D24]/5 transition flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4 text-[#8C5835]" />
                  <span>+ Keranjang</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#B81D24] text-white font-bold text-sm hover:bg-[#98141A] transition shadow-lg shadow-[#B81D24]/20 flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <span>Beli Sekarang</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition ${
                    isWishlisted
                      ? 'bg-[#B81D24] text-white border-[#B81D24]'
                      : 'border-[#D6CEC2] bg-white text-[#57534E] hover:border-[#C5A059]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Permendag 19/2026 Customer Protection Notice */}
            <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#E7DFD5] text-xs text-[#57534E] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Transparansi Konsumen (Permendag 19/2026)</span>
              </div>
              <p>
                Produk ini tunduk pada perlindungan hak konsumen, garansi keaslian asal produk Surakarta, dan fasilitas penyelesaian pengaduan resmi 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-10">
            <BatikDivider />
            <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-[#1C1917] mb-6">
              Produk Lainnya dalam Kategori {product.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

