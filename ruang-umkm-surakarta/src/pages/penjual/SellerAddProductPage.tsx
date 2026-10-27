import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Check,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export const SellerAddProductPage: React.FC = () => {
  const { addProduct, currentUser, showToast } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Batik & Fashion');
  
  // Price inputs maintained as strings to prevent leading zeros bug while typing
  const [priceInput, setPriceInput] = useState<string>('150000');
  const [originalPriceInput, setOriginalPriceInput] = useState<string>('180000');
  const [stockInput, setStockInput] = useState<string>('20');
  
  const [district, setDistrict] = useState('Laweyan');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [description, setDescription] = useState('');
  const [selectedCerts, setSelectedCerts] = useState<string[]>(['Batik Mark Solo', 'Halal MUI']);
  const [tagsInput, setTagsInput] = useState('Batik Solo, Produk Lokal');

  const availableCerts = ['Halal MUI', 'Batik Mark Solo', 'P-IRT Dinkes Surakarta', 'SNI Kriya', 'BPOM MD'];

  const presetImages = [
    { label: 'Batik Tulis Sutra', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Serabi Solo Pan', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
    { label: 'Kriya Tembaga Hias', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80' },
    { label: 'Madu Randu Asli', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
  ];

  // Sanitizes price input by stripping leading zeros and non-digit characters
  const handlePriceChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (!digitsOnly) {
      setPriceInput('');
      return;
    }
    // Remove unwanted leading zero (e.g. 0200000 -> 200000)
    const sanitized = digitsOnly.replace(/^0+(?=\d)/, '');
    setPriceInput(sanitized);
  };

  const handleOriginalPriceChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (!digitsOnly) {
      setOriginalPriceInput('');
      return;
    }
    const sanitized = digitsOnly.replace(/^0+(?=\d)/, '');
    setOriginalPriceInput(sanitized);
  };

  const handleStockChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (!digitsOnly) {
      setStockInput('');
      return;
    }
    const sanitized = digitsOnly.replace(/^0+(?=\d)/, '');
    setStockInput(sanitized);
  };

  const toggleCert = (cert: string) => {
    setSelectedCerts((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  // Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WebP).', 'error');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 3MB untuk menjaga performa web.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setUploadedFileName(file.name);
        showToast(`Foto produk "${file.name}" berhasil diunggah!`, 'success');
      }
    };
    reader.onerror = () => {
      showToast('Gagal membaca file gambar.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setImageUrl('https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80');
    setUploadedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const numericPrice = Number(priceInput) || 0;
  const numericOriginalPrice = Number(originalPriceInput) || 0;
  const numericStock = Number(stockInput) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Harap isi nama produk UMKM.', 'error');
      return;
    }
    if (numericPrice <= 0) {
      showToast('Harap masukkan harga jual yang valid (minimal Rp 1.000).', 'error');
      return;
    }
    if (numericStock < 0) {
      showToast('Jumlah stok tidak boleh bernilai negatif.', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProduct({
      name: name.trim(),
      sellerId: currentUser.id,
      sellerName: currentUser.storeName || currentUser.name,
      category,
      price: numericPrice,
      originalPrice: numericOriginalPrice > numericPrice ? numericOriginalPrice : undefined,
      stock: numericStock,
      soldCount: 0,
      rating: 5.0,
      reviewCount: 0,
      images: [imageUrl || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'],
      description: description.trim() || 'Produk unggulan hasil kerajinan berkualitas tinggi dari perajin lokal Kota Surakarta.',
      district,
      certifications: selectedCerts,
      tags: tags.length > 0 ? tags : ['Produk Solo', category],
      isCurated: false,
      status: 'ditinjau', // Produk baru wajib melalui moderasi & persetujuan admin Djoeragan Nusantara
    });

    showToast('Produk berhasil diajukan! Menunggu pemeriksaan dan persetujuan admin sebelum tampil di katalog.', 'info');
    navigate('/penjual/produk');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/penjual/produk"
          className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Tambah Produk Baru ke Etalase</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Pastikan produk mematuhi standar mutu, izin legalitas, dan foto produk yang jelas.
          </p>
        </div>
      </div>

      {/* Moderation Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-ping"></span>
        <div>
          <p className="font-bold">Ketentuan Moderasi Produk Admin:</p>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            Produk yang diajukan akan diperiksa oleh admin Djoeragan Nusantara terlebih dahulu. Produk belum akan tampil di katalog publik sampai admin menyetujui (ACC) pengajuan Anda.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Fields Left */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Nama Produk UMKM *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kemeja Batik Parang Kusumo Sutra Tulis"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816] focus:ring-1 focus:ring-[#D90816]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Kategori Usaha
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
              >
                <option value="Batik & Fashion">Batik & Fashion</option>
                <option value="Kuliner Tradisional">Kuliner Tradisional</option>
                <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                <option value="Herbal & Kebugaran">Herbal & Kebugaran</option>
                <option value="Pertanian & Olahan">Pertanian & Olahan</option>
                <option value="Jasa Kreatif">Jasa Kreatif</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Kecamatan Asal Usaha
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
              >
                <option value="Laweyan">Laweyan</option>
                <option value="Pasar Kliwon">Pasar Kliwon</option>
                <option value="Jebres">Jebres</option>
                <option value="Banjarsari">Banjarsari</option>
                <option value="Serengan">Serengan</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock - Leading zero issue fixed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700 block">
                  Harga Jual (Rp) *
                </label>
                {numericPrice > 0 && (
                  <span className="text-[10px] font-semibold text-[#D90816]">
                    {formatRupiah(numericPrice)}
                  </span>
                )}
              </div>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="150000"
                value={priceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816] focus:ring-1 focus:ring-[#D90816] font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700 block">
                  Harga Asal / Coret (Rp)
                </label>
                {numericOriginalPrice > 0 && (
                  <span className="text-[10px] text-neutral-400 line-through">
                    {formatRupiah(numericOriginalPrice)}
                  </span>
                )}
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="180000 (Opsional)"
                value={originalPriceInput}
                onChange={(e) => handleOriginalPriceChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816] focus:ring-1 focus:ring-[#D90816] font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Jumlah Stok Awal *
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="20"
                value={stockInput}
                onChange={(e) => handleStockChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816] focus:ring-1 focus:ring-[#D90816] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Deskripsi Produk Lengkap
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan bahan kain, rasa kuliner, dimensi kerajinan, dan keunggulan produk Anda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
            />
          </div>

          {/* Sertifikasi */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-2">
              Sertifikasi & Label Kepatuhan Mutu
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCerts.map((cert) => {
                const checked = selectedCerts.includes(cert);
                return (
                  <button
                    type="button"
                    key={cert}
                    onClick={() => toggleCert(cert)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                      checked
                        ? 'bg-[#FDEBEC] text-[#D90816] border-[#D90816]'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5" />}
                    <span>{cert}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Kata Kunci Pencarian / Tag (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
            />
          </div>
        </div>

        {/* Right Preview & Image Upload Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-neutral-900">Foto & Preview Produk</h3>

            {/* Live Preview Box with Fallback */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 group">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover transition duration-300"
                  onError={() => {
                    setImageUrl('https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80');
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
                  <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                  <span className="text-xs font-medium">Belum ada foto</span>
                </div>
              )}

              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl text-[10px]">
                <p className="font-bold truncate">{name || 'Nama Produk Baru'}</p>
                <p className="text-emerald-300 font-semibold">{formatRupiah(numericPrice)}</p>
              </div>

              {uploadedFileName && (
                <button
                  type="button"
                  onClick={clearUploadedImage}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition"
                  title="Hapus foto unggahan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Functional File Upload Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-700 block">
                Unggah Foto dari Perangkat:
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#D90816] hover:bg-neutral-50 transition flex items-center justify-center gap-2 text-xs font-semibold text-neutral-700"
              >
                <Upload className="w-4 h-4 text-[#D90816]" />
                <span>{uploadedFileName ? 'Ganti Foto Produk' : 'Pilih File Foto (Maks 3MB)'}</span>
              </button>
              {uploadedFileName && (
                <p className="text-[10px] text-emerald-600 font-medium truncate flex items-center gap-1">
                  <Check className="w-3 h-3 shrink-0" />
                  <span className="truncate">{uploadedFileName}</span>
                </p>
              )}
            </div>

            {/* Preset Image Options */}
            <div>
              <span className="text-[11px] font-bold text-neutral-500 block mb-2">Atau Pilih Foto Cepat:</span>
              <div className="grid grid-cols-2 gap-2">
                {presetImages.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setImageUrl(p.url);
                      setUploadedFileName('');
                    }}
                    className={`p-1.5 border rounded-xl text-[10px] font-medium truncate text-left transition ${
                      imageUrl === p.url
                        ? 'border-[#D90816] bg-[#FDEBEC] text-[#D90816]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Atau URL Foto Kustom:</label>
              <input
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setUploadedFileName('');
                }}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shadow-lg shadow-[#D90816]/25 mt-2 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Ajukan Produk untuk Moderasi Admin</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
