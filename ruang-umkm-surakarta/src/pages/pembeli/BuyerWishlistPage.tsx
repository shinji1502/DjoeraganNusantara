import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';

export const BuyerWishlistPage: React.FC = () => {
  const { wishlist, products } = useApp();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Wishlist Favorit Saya</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Daftar karya perajin dan produk UMKM Solo yang Anda simpan untuk dibeli nanti.
        </p>
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Wishlist Anda Masih Kosong</h3>
          <p className="text-xs text-neutral-500">
            Klik ikon hati pada produk di katalog untuk menyimpannya di daftar favorit Anda.
          </p>
          <Link
            to="/pembeli/katalog"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D90816] text-white text-xs font-bold"
          >
            <span>Jelajahi Produk UMKM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
