import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  ShoppingBag,
  Sparkles,
  Share2,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Building,
  Award,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { INITIAL_SELLER_STORES } from '../../data/mockData';
import { BatikParang, BatikDivider } from '../../components/common/BatikOrnament';

export const StoreProfilePage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const { products, users, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Look up store info from INITIAL_SELLER_STORES, users, or products
  const storeInfo = useMemo(() => {
    if (!sellerId) return null;

    // Check predefined stores
    if (INITIAL_SELLER_STORES[sellerId]) {
      return INITIAL_SELLER_STORES[sellerId];
    }

    // Check in users list
    const matchedUser = users.find(
      (u) => u.id === sellerId || (u.storeName && u.storeName.toLowerCase() === decodeURIComponent(sellerId).toLowerCase())
    );

    if (matchedUser && matchedUser.storeName) {
      return {
        sellerId: matchedUser.id,
        storeName: matchedUser.storeName,
        ownerName: matchedUser.name,
        avatar: matchedUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
        phone: matchedUser.phone || '0812-3456-7890',
        email: matchedUser.email,
        address: matchedUser.address || 'Surakarta, Jawa Tengah',
        district: 'Surakarta',
        nib: matchedUser.nib || '0220009831921',
        isVerified: matchedUser.isVerified ?? true,
        bio: `Pelaku usaha resmi ${matchedUser.storeName} binaan ekosistem Ruang UMKM Surakarta yang menjaga warisan kearifan lokal Kota Solo.`,
        joinedYear: 2023,
        rating: 4.8,
        totalSold: 120,
        categories: ['Semua'],
      };
    }

    // Check from products
    const sampleProduct = products.find(
      (p) => p.sellerId === sellerId || p.sellerName.toLowerCase() === decodeURIComponent(sellerId).toLowerCase()
    );

    if (sampleProduct) {
      return {
        sellerId: sampleProduct.sellerId,
        storeName: sampleProduct.sellerName,
        ownerName: sampleProduct.sellerName,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        banner: sampleProduct.images[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
        phone: '0813-8899-7711',
        email: 'toko@ruangumkm.test',
        address: `Kecamatan ${sampleProduct.district}, Kota Surakarta`,
        district: sampleProduct.district,
        nib: '0220009831921',
        isVerified: true,
        bio: `Produsen UMKM resmi ${sampleProduct.sellerName} Surakarta. Memproduksi aneka karya terkurasi dengan standar kualitas tinggi.`,
        joinedYear: 2022,
        rating: sampleProduct.rating,
        totalSold: sampleProduct.soldCount,
        categories: [sampleProduct.category],
      };
    }

    return null;
  }, [sellerId, users, products]);

  // Products belonging strictly to this store
  const storeProducts = useMemo(() => {
    if (!storeInfo) return [];
    return products.filter(
      (p) =>
        p.status === 'aktif' &&
        (p.sellerId === storeInfo.sellerId || p.sellerName.toLowerCase() === storeInfo.storeName.toLowerCase())
    );
  }, [storeInfo, products]);

  // Categories available in this store
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    storeProducts.forEach((p) => set.add(p.category));
    return ['Semua', ...Array.from(set)];
  }, [storeProducts]);

  // Filtered store products
  const filteredProducts = useMemo(() => {
    return storeProducts.filter((p) => {
      const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [storeProducts, selectedCategory, searchQuery]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan profil toko berhasil disalin ke clipboard!', 'success');
    }
  };

  const handleWhatsApp = () => {
    if (!storeInfo) return;
    const cleanPhone = storeInfo.phone.replace(/\D/g, '');
    const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = encodeURIComponent(
      `Halo ${storeInfo.storeName}, saya melihat etalase toko Anda di platform Ruang UMKM Surakarta dan tertarik untuk berdiskusi/bertanya mengenai produk Anda.`
    );
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  if (!storeInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#8C5835] mx-auto flex items-center justify-center border border-[#E7DFD5]">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1C1917]">Toko Tidak Ditemukan</h2>
        <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto leading-relaxed">
          Toko UMKM yang Anda tuju mungkin belum terdaftar atau tautan yang Anda gunakan tidak sesuai.
        </p>
        <Link
          to="/katalog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Produk</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#78716C]">
          <Link to="/" className="hover:text-[#1C1917] transition">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <Link to="/katalog" className="hover:text-[#1C1917] transition">Katalog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <span className="text-[#8C5835] font-medium">Toko Mitra UMKM</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <span className="text-[#1C1917] font-semibold truncate max-w-[200px]">{storeInfo.storeName}</span>
        </nav>
      </div>

      {/* Hero Store Banner with Watermark & Profil Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#E7DFD5] bg-[#161413] shadow-md">
          {/* Banner Image */}
          <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden">
            <img
              src={storeInfo.banner || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80'}
              alt={storeInfo.storeName}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161413] via-[#161413]/40 to-transparent" />
            
            {/* Parang watermark */}
            <div className="absolute top-0 right-0 h-full w-80 pointer-events-none opacity-20 hidden md:block">
              <BatikParang className="w-full h-full" color="#C5A059" opacity={0.3} />
            </div>

            {/* Verification Tag */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-500/40 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NIB OSS Terverifikasi Pemkot Solo</span>
              </span>
            </div>
          </div>

          {/* Store Info Bar (Overlaps Banner Bottom) */}
          <div className="relative px-6 sm:px-8 lg:px-10 pb-8 pt-4 sm:pt-0 -mt-16 sm:-mt-20 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar Toko */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl shrink-0">
                <img
                  src={storeInfo.avatar}
                  alt={storeInfo.storeName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-1.5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight text-white">
                    {storeInfo.storeName}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-[#C5A059]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {storeInfo.address}
                  </span>
                  <span>•</span>
                  <span>Pemilik: <strong>{storeInfo.ownerName}</strong></span>
                </p>

                <div className="flex items-center gap-4 text-xs text-stone-300 pt-1">
                  <div className="flex items-center text-[#C5A059] font-bold">
                    <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059] mr-1" />
                    <span>{storeInfo.rating || 4.9}</span>
                  </div>
                  <span>•</span>
                  <span>Total Terjual: <strong>{storeInfo.totalSold || 150}+ item</strong></span>
                  <span>•</span>
                  <span>Koleksi: <strong>{storeProducts.length} produk</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleWhatsApp}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-950/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Penjual</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                title="Bagikan Tautan Toko"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Store Description & Trust Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Bio & About */}
          <div className="lg:col-span-8 card-heritage p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C5835] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Profil & Nilai Usaha</span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              {storeInfo.bio}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#57534E] border-t border-[#E7DFD5]">
              <div>
                <span className="text-[#A8A29E] text-[11px] block">Nomor Izin Usaha (NIB):</span>
                <strong className="text-[#1C1917] font-mono">{storeInfo.nib}</strong>
              </div>
              <div>
                <span className="text-[#A8A29E] text-[11px] block">Wilayah Workshop:</span>
                <strong className="text-[#1C1917]">{storeInfo.district || 'Kota Surakarta'}</strong>
              </div>
              <div>
                <span className="text-[#A8A29E] text-[11px] block">Status Binaan:</span>
                <strong className="text-emerald-700 font-semibold">Diskop UKM Solo</strong>
              </div>
            </div>
          </div>

          {/* Right: Permendag 19/2026 Consumer Protection */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kepatuhan Permendag 19/2026</span>
              </div>
              <p className="text-[11px] text-[#57534E] leading-relaxed">
                Toko ini telah melalui proses kurasi fisik dan administratif oleh Dinas Koperasi & UKM Surakarta. Setiap transaksi dilindungi hak retur dan garansi keaslian produk Solo.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E7DFD5] flex items-center justify-between text-[11px] text-[#8C5835] font-semibold">
              <span>Layanan Aduan 24 Jam</span>
              <span>100% Produk Halal & Asli</span>
            </div>
          </div>
        </div>
      </section>

      {/* Store Catalog / Etalase Produk */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DFD5] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#1C1917]">
              Etalase Produk {storeInfo.storeName}
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              Menampilkan {filteredProducts.length} karya terkurasi yang siap dibeli langsung.
            </p>
          </div>

          {/* Search Box in Store */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={`Cari di ${storeInfo.storeName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#D6CEC2] focus:outline-none focus:border-[#C5A059]"
            />
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Pills */}
        {availableCategories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1C1917] text-[#FAF7F2] border border-[#C5A059]'
                    : 'bg-white border border-[#D6CEC2] text-[#57534E] hover:bg-[#FAF7F2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="card-heritage p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#A8A29E] mx-auto flex items-center justify-center border border-[#E7DFD5]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#1C1917]">Tidak Ada Produk yang Cocok</h3>
            <p className="text-xs text-[#78716C]">
              Coba gunakan kata kunci lain atau pilih kategori "Semua" untuk melihat produk toko ini.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="px-4 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-[#292524] transition"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

