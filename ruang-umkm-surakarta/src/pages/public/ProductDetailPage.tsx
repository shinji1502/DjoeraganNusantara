import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  MapPin,
  Heart,
  ShoppingBag,
  Share2,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Store,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { ProductCard } from '../../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, currentUser, addToCart, wishlist, toggleWishlist, showToast } = useApp();

  const product = products.find((p) => p.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product || (currentUser.role !== 'admin' && currentUser.id !== product.sellerId && product.status !== 'aktif')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Produk Tidak Tersedia</h2>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          {product?.status === 'ditinjau'
            ? 'Produk ini sedang dalam proses peninjauan (Pending Moderasi) oleh Kurator Admin dan belum dapat dilihat publik.'
            : 'Produk yang Anda cari tidak tersedia atau sedang dinonaktifkan.'}
        </p>
        <Link
          to="/katalog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D90816] text-white text-xs font-semibold hover:bg-[#b80512] transition"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/" className="hover:text-neutral-900">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/katalog" className="hover:text-neutral-900">Katalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-400">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery Images */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-neutral-200/90 bg-neutral-100 shadow-xs">
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
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D90816] text-white text-xs font-extrabold shadow-sm">
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
                    selectedImageIndex === idx ? 'border-[#D90816] shadow-sm' : 'border-neutral-200 opacity-60 hover:opacity-100'
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
              <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
                {product.category}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                Kecamatan {product.district}, Surakarta
              </span>
              {product.isCurated && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Produk Terkurasi
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] leading-tight">
              {product.name}
            </h1>

            {/* Rating and Sold */}
            <div className="flex items-center gap-4 text-xs text-neutral-600 mt-3 pb-4 border-b border-neutral-100">
              <div className="flex items-center text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                <span>{product.rating}</span>
                <span className="text-neutral-400 font-normal ml-1">({product.reviewCount} ulasan)</span>
              </div>
              <span>•</span>
              <span>Terjual <strong>{product.soldCount} item</strong></span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Stok: {product.stock} pcs</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-[#FAF8F7] border border-neutral-200/80 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#D90816]">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-neutral-400 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Seller / Store Box */}
          <div className="p-4 rounded-2xl border border-neutral-200/90 bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FDEBEC] text-[#D90816] flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-neutral-900">{product.sellerName}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-neutral-500">Izin Usaha NIB Terverifikasi OSS • Surakarta</p>
              </div>
            </div>

            <Link
              to={`/katalog?cari=${encodeURIComponent(product.sellerName)}`}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:border-neutral-900 transition whitespace-nowrap"
            >
              Kunjungi Toko
            </Link>
          </div>

          {/* Certifications and Compliance */}
          {product.certifications.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-700 block uppercase tracking-wider">
                Sertifikasi & Kepatuhan Produk
              </span>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
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
            <span className="text-xs font-bold text-neutral-700 block uppercase tracking-wider">
              Deskripsi Produk
            </span>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity & CTA Area */}
          <div className="pt-4 border-t border-neutral-100 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-neutral-700">Jumlah Beli:</span>
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-neutral-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-neutral-400">Tersisa {product.stock} buah</span>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 rounded-2xl border-2 border-[#D90816] text-[#D90816] font-bold text-sm hover:bg-[#FDEBEC] transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>+ Keranjang</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#D90816] text-white font-bold text-sm hover:bg-[#b80512] transition shadow-lg shadow-[#D90816]/25 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>Beli Sekarang</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition ${
                  isWishlisted
                    ? 'bg-[#D90816] text-white border-[#D90816]'
                    : 'border-neutral-300 text-neutral-600 hover:border-neutral-900'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Permendag 19/2026 Customer Protection Notice */}
          <div className="p-4 rounded-xl bg-neutral-100 text-xs text-neutral-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
        <div className="pt-12 border-t border-neutral-200">
          <h3 className="text-xl font-bold text-[#171717] mb-6">
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
