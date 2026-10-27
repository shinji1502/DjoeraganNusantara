import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { Product, ProductCategory } from '../../types';

export const SellerProductsPage: React.FC = () => {
  const { products, currentUser, updateProduct, deleteProduct, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ProductCategory>('Batik & Fashion');
  const [editPriceInput, setEditPriceInput] = useState('');
  const [editOriginalPriceInput, setEditOriginalPriceInput] = useState('');
  const [editStockInput, setEditStockInput] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editUploadedFileName, setEditUploadedFileName] = useState('');
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Filter products for this seller
  const myProducts = products.filter((p) => p.sellerId === currentUser.id);

  const filteredProducts = myProducts.filter((p) => {
    if (selectedCategory !== 'Semua' && p.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}" dari etalase?`)) {
      deleteProduct(id);
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditCategory(p.category);
    setEditPriceInput(String(p.price));
    setEditOriginalPriceInput(p.originalPrice ? String(p.originalPrice) : '');
    setEditStockInput(String(p.stock));
    setEditImageUrl(p.images[0] || '');
    setEditUploadedFileName('');
  };

  const handleEditPriceChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (!digitsOnly) {
      setEditPriceInput('');
      return;
    }
    // Strip leading zero
    const sanitized = digitsOnly.replace(/^0+(?=\d)/, '');
    setEditPriceInput(sanitized);
  };

  const handleEditOriginalPriceChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (!digitsOnly) {
      setEditOriginalPriceInput('');
      return;
    }
    const sanitized = digitsOnly.replace(/^0+(?=\d)/, '');
    setEditOriginalPriceInput(sanitized);
  };

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WebP).', 'error');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 3MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditImageUrl(reader.result);
        setEditUploadedFileName(file.name);
        showToast(`Foto baru "${file.name}" siap disimpan!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const numericPrice = Number(editPriceInput) || 0;
    const numericOriginalPrice = Number(editOriginalPriceInput) || 0;
    const numericStock = Number(editStockInput) || 0;

    if (!editName.trim() || numericPrice <= 0 || numericStock < 0) {
      showToast('Harap lengkapi nama, harga, dan stok yang valid.', 'error');
      return;
    }

    updateProduct(editingProduct.id, {
      name: editName.trim(),
      category: editCategory,
      price: numericPrice,
      originalPrice: numericOriginalPrice > numericPrice ? numericOriginalPrice : undefined,
      stock: numericStock,
      images: [editImageUrl || editingProduct.images[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'],
    });

    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Manajemen Produk Saya</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola etalase, foto produk, harga tanpa kendala nol di depan, dan stok etalase.
          </p>
        </div>

        <Link
          to="/penjual/produk/tambah"
          className="px-5 py-2.5 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition flex items-center gap-1.5 shadow-md shadow-[#D90816]/20 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Cari berdasarkan nama produk atau tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF8F7] border border-neutral-300 focus:outline-none focus:border-[#D90816]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FAF8F7] border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Batik & Fashion">Batik & Fashion</option>
            <option value="Kuliner Tradisional">Kuliner Tradisional</option>
            <option value="Kerajinan Tangan">Kerajinan Tangan</option>
            <option value="Herbal & Kebugaran">Herbal & Kebugaran</option>
            <option value="Pertanian & Olahan">Pertanian & Olahan</option>
            <option value="Jasa Kreatif">Jasa Kreatif</option>
          </select>
        </div>
      </div>

      {/* Table of Products */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAF8F7] text-neutral-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-6">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Satuan</th>
                <th className="py-3.5 px-4 text-center">Stok</th>
                <th className="py-3.5 px-4 text-center">Terjual</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const displayImage = p.images && p.images.length > 0 ? p.images[0] : '';
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/80 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {displayImage ? (
                              <img
                                src={displayImage}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="max-w-xs">
                            <p className="font-bold text-neutral-900 line-clamp-1">{p.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-neutral-400">Solo, {p.district}</span>
                              {p.isCurated && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                  <ShieldCheck className="w-2.5 h-2.5" /> Kurasi
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-medium text-neutral-800">{p.category}</td>

                      <td className="py-4 px-4 font-bold text-neutral-900">
                        {formatRupiah(p.price)}
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="block text-[10px] text-neutral-400 line-through">
                            {formatRupiah(p.originalPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                            p.stock <= 3
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : p.stock < 10
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {p.stock} pcs
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-semibold text-neutral-700">
                        {p.soldCount}
                      </td>

                      <td className="py-4 px-4">
                        {p.status === 'ditinjau' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>Menunggu ACC</span>
                          </span>
                        )}
                        {p.status === 'aktif' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Tayang di Katalog</span>
                          </span>
                        )}
                        {p.status === 'ditolak' && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold cursor-help"
                            title={p.rejectionReason || 'Ditolak kurator admin'}
                          >
                            <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>Ditolak</span>
                          </span>
                        )}
                        {p.status === 'draft' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Edit Produk & Foto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/produk/${p.id}`}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition"
                            title="Lihat Halaman Publik"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400 text-xs">
                    Tidak ada produk yang sesuai dengan filter atau kata kunci.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900">Edit Produk & Foto Etalase</h3>
                <p className="text-xs text-neutral-500">Perbarui informasi katalog dan foto produk toko Anda.</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Nama Produk UMKM *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Kategori Usaha
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as ProductCategory)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                >
                  <option value="Batik & Fashion">Batik & Fashion</option>
                  <option value="Kuliner Tradisional">Kuliner Tradisional</option>
                  <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                  <option value="Herbal & Kebugaran">Herbal & Kebugaran</option>
                  <option value="Pertanian & Olahan">Pertanian & Olahan</option>
                  <option value="Jasa Kreatif">Jasa Kreatif</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Harga Jual (Rp) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={editPriceInput}
                    onChange={(e) => handleEditPriceChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                  />
                  {Number(editPriceInput) > 0 && (
                    <span className="text-[10px] text-[#D90816] font-semibold block mt-0.5">
                      {formatRupiah(Number(editPriceInput))}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Harga Coret (Rp)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Opsional"
                    value={editOriginalPriceInput}
                    onChange={(e) => handleEditOriginalPriceChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                  />
                  {Number(editOriginalPriceInput) > 0 && (
                    <span className="text-[10px] text-neutral-400 line-through block mt-0.5">
                      {formatRupiah(Number(editOriginalPriceInput))}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Stok *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={editStockInput}
                    onChange={(e) => setEditStockInput(e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, ''))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                  />
                </div>
              </div>

              {/* Foto Produk & Preview */}
              <div className="pt-2 border-t border-neutral-100 space-y-3">
                <label className="text-xs font-bold text-neutral-700 block">
                  Foto Produk:
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-neutral-200 bg-neutral-100 overflow-hidden shrink-0">
                    {editImageUrl ? (
                      <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleEditFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-[#D90816] text-xs font-semibold text-neutral-700 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D90816]" />
                      <span>{editUploadedFileName ? 'Ganti Foto' : 'Unggah Foto Baru'}</span>
                    </button>
                    {editUploadedFileName && (
                      <p className="text-[10px] text-emerald-600 truncate">{editUploadedFileName}</p>
                    )}
                    <input
                      type="url"
                      placeholder="Atau tautan URL foto..."
                      value={editImageUrl}
                      onChange={(e) => {
                        setEditImageUrl(e.target.value);
                        setEditUploadedFileName('');
                      }}
                      className="w-full px-3 py-1 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] flex items-center gap-1.5 shadow-md shadow-[#D90816]/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
