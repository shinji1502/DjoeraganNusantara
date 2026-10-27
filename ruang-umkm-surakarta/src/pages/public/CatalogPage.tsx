import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Check,
  Sparkles,
  ShoppingBag,
  Shirt,
  UtensilsCrossed,
  Palette,
  HeartPulse,
  Sprout,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';

export const CatalogPage: React.FC = () => {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('cari') || '';
  const initialCategory = searchParams.get('kategori') || 'Semua';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Semua');
  const [selectedCertification, setSelectedCertification] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'populer' | 'termurah' | 'termahal' | 'rating' | 'terbaru'>('populer');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = [
    'Semua',
    'Batik & Fashion',
    'Kuliner Tradisional',
    'Kerajinan Tangan',
    'Herbal & Kebugaran',
    'Pertanian & Olahan',
  ];

  const districts = ['Semua', 'Laweyan', 'Pasar Kliwon', 'Jebres', 'Banjarsari', 'Serengan'];

  const certifications = ['Semua', 'Halal MUI', 'Batik Mark Solo', 'P-IRT Dinkes Surakarta', 'SNI Kriya'];

  const categoryIcons: Record<string, React.ElementType> = {
    Semua: Sparkles,
    'Batik & Fashion': Shirt,
    'Kuliner Tradisional': UtensilsCrossed,
    'Kerajinan Tangan': Palette,
    'Herbal & Kebugaran': HeartPulse,
    'Pertanian & Olahan': Sprout,
  };

  // Filtered and sorted products — Only products with status 'aktif' (approved by admin)
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Status must be aktif (approved by admin)
        if (p.status !== 'aktif') return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.name.toLowerCase().includes(q);
          const matchSeller = p.sellerName.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchSeller && !matchTags) return false;
        }

        // Category filter
        if (selectedCategory !== 'Semua' && p.category !== selectedCategory) {
          return false;
        }

        // District filter
        if (selectedDistrict !== 'Semua' && p.district !== selectedDistrict) {
          return false;
        }

        // Certification filter
        if (
          selectedCertification !== 'Semua' &&
          !p.certifications.some((c) => c.toLowerCase().includes(selectedCertification.toLowerCase()))
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'termurah') return a.price - b.price;
        if (sortBy === 'termahal') return b.price - a.price;
        if (sortBy === 'terbaru') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default: populer (soldCount)
        return b.soldCount - a.soldCount;
      });
  }, [products, searchQuery, selectedCategory, selectedDistrict, selectedCertification, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedDistrict('Semua');
    setSelectedCertification('Semua');
    setSortBy('populer');
    setSearchParams({});
  };

  return (
    <div className="bg-theme-katalog min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Page Header */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Katalog Resmi Djoeragan Nusantara
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Karya & Produk Pilihan UMKM Terverifikasi
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Temukan batik otentik, kuliner khas, dan kerajinan kriya yang telah melalui kurasi mutu dan verifikasi legalitas izin usaha.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Cari batik parang, serabi, vas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full bg-[#FAF8F7] border border-neutral-300 focus:outline-none focus:border-[#D90816] focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Badges with Logo Icons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Sparkles;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#171717] text-white shadow-sm scale-[1.02]'
                    : 'bg-[#FAF8F7] text-neutral-700 hover:bg-neutral-200/80 border border-neutral-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ff4d5a]' : 'text-neutral-500'}`} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Filter Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-neutral-200/90 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#D90816]" />
              Filter Pencarian
            </span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-[#D90816] hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Kecamatan Surakarta */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
              Wilayah Kecamatan
            </label>
            <div className="space-y-1">
              {districts.map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedDistrict === dist
                      ? 'bg-[#FDEBEC] text-[#D90816] font-bold'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span>{dist}</span>
                  {selectedDistrict === dist && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sertifikasi & Label */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
              Sertifikasi Mutu
            </label>
            <div className="space-y-1">
              {certifications.map((cert) => (
                <button
                  key={cert}
                  onClick={() => setSelectedCertification(cert)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCertification === cert
                      ? 'bg-[#FDEBEC] text-[#D90816] font-bold'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span>{cert}</span>
                  {selectedCertification === cert && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid & Sorting */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting & Result Count Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/90 text-xs">
            <span className="text-neutral-500 font-medium">
              Menampilkan <strong className="text-neutral-900">{filteredProducts.length}</strong> produk UMKM
            </span>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 font-semibold text-neutral-700"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-neutral-500 hidden sm:inline">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF8F7] border border-neutral-300 rounded-lg px-3 py-1.5 font-semibold text-neutral-800 focus:outline-none focus:border-[#D90816]"
                >
                  <option value="populer">Paling Populer (Terlaris)</option>
                  <option value="rating">Rating Tertinggi ke Terendah</option>
                  <option value="termurah">Harga: Rendah ke Tinggi</option>
                  <option value="termahal">Harga: Tinggi ke Rendah</option>
                  <option value="terbaru">Produk Terbaru Ditambahkan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900">Tidak ada produk yang cocok</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau sesuaikan pilihan filter kategori dan wilayah kecamatan.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-full bg-[#D90816] text-white text-xs font-semibold hover:bg-[#b80512] transition"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="w-80 bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-bold text-sm text-neutral-900">Filter Produk</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kecamatan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                Wilayah Kecamatan
              </label>
              <div className="space-y-1">
                {districts.map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistrict(dist)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                      selectedDistrict === dist
                        ? 'bg-[#FDEBEC] text-[#D90816] font-bold'
                        : 'text-neutral-600'
                    }`}
                  >
                    <span>{dist}</span>
                    {selectedDistrict === dist && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sertifikasi */}
            <div className="space-y-2 pt-3 border-t border-neutral-100">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                Sertifikasi
              </label>
              <div className="space-y-1">
                {certifications.map((cert) => (
                  <button
                    key={cert}
                    onClick={() => setSelectedCertification(cert)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                      selectedCertification === cert
                        ? 'bg-[#FDEBEC] text-[#D90816] font-bold'
                        : 'text-neutral-600'
                    }`}
                  >
                    <span>{cert}</span>
                    {selectedCertification === cert && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 rounded-full bg-[#D90816] text-white font-bold text-xs"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
