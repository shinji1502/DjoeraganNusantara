import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* District Tag */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-[#D90816]" />
              {product.district}
            </span>

            {discountPercentage > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#D90816] text-white text-[10px] font-bold">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-[#D90816] text-white'
                : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-[#D90816]'
            }`}
            aria-label="Simpan ke wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>

          {/* Status Badge if Out of Stock */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="px-3 py-1 bg-white text-neutral-900 rounded-full font-bold text-xs uppercase tracking-wider">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5">
          {/* Toko & Badge Kurasi */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span className="font-medium truncate max-w-[170px] hover:text-[#D90816] transition">
              {product.sellerName}
            </span>
            {product.isCurated && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Kurasi
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/produk/${product.id}`} className="block">
            <h3 className="font-bold text-sm sm:text-base text-neutral-900 leading-snug line-clamp-2 hover:text-[#D90816] transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Certifications preview */}
          {product.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.certifications.slice(0, 2).map((cert) => (
                <span
                  key={cert}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FDEBEC] text-[#D90816]"
                >
                  {cert}
                </span>
              ))}
              {product.certifications.length > 2 && (
                <span className="text-[10px] text-neutral-400 self-center">
                  +{product.certifications.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Rating & Sold count */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
            <div className="flex items-center text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
              <span>{product.rating}</span>
            </div>
            <span>•</span>
            <span>Terjual {product.soldCount}</span>
          </div>

          {/* Price */}
          <div className="pt-2 border-t border-neutral-100 flex items-baseline gap-2">
            <span className="font-extrabold text-base sm:text-lg text-[#171717]">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-5 gap-2">
        <Link
          to={`/produk/${product.id}`}
          className="col-span-3 py-2 px-3 text-center rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition"
        >
          Lihat Detail
        </Link>
        <button
          onClick={() => addToCart(product, 1)}
          disabled={product.stock <= 0}
          className="col-span-2 py-2 px-2.5 rounded-xl bg-[#D90816] text-white text-xs font-semibold hover:bg-[#b80512] disabled:opacity-40 disabled:pointer-events-none transition flex items-center justify-center gap-1 shadow-sm"
          title="Tambah ke Keranjang"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>+Beli</span>
        </button>
      </div>
    </div>
  );
};
