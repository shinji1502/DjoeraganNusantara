import React from 'react';
import { AlertTriangle, Plus, Package, Check, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const SellerStockPage: React.FC = () => {
  const { products, currentUser, updateProduct, showToast } = useApp();

  const myProducts = products.filter((p) => p.sellerId === currentUser.id);

  const lowStockItems = myProducts.filter((p) => p.stock < 5);

  const handleAddStock = (id: string, currentStock: number, addAmount: number) => {
    updateProduct(id, { stock: currentStock + addAmount });
    showToast(`Stok berhasil ditambah +${addAmount} pcs!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Manajemen Stok Produk</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Pantau ketersediaan barang dan lakukan restock cepat untuk menghindari kehabisan produk.
        </p>
      </div>

      {/* Warning Box if low stock */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-amber-900">
              Peringatan: {lowStockItems.length} Produk Memiliki Stok Menipis (&lt;5 pcs)
            </h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Segera tambah stok untuk produk di bawah agar pesanan pembeli tidak tertunda dan rating toko Anda tetap terjaga baik.
            </p>
          </div>
        </div>
      )}

      {/* Table of stock */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAF8F7] text-neutral-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-6">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-center">Stok Saat Ini</th>
                <th className="py-3.5 px-4 text-center">Terjual</th>
                <th className="py-3.5 px-6 text-right">Tambah Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {myProducts.length > 0 ? (
                myProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-11 h-11 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-neutral-400">{formatRupiah(p.price)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-neutral-800">{p.category}</td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-extrabold text-xs ${
                          p.stock <= 3
                            ? 'bg-rose-100 text-rose-700'
                            : p.stock < 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} pcs
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-neutral-800">
                      {p.soldCount}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAddStock(p.id, p.stock, 5)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-300 font-bold text-xs hover:border-[#D90816] hover:text-[#D90816] transition"
                          title="Tambah 5 pcs"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleAddStock(p.id, p.stock, 10)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-300 font-bold text-xs hover:border-[#D90816] hover:text-[#D90816] transition"
                          title="Tambah 10 pcs"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleAddStock(p.id, p.stock, 25)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
                          title="Tambah 25 pcs"
                        >
                          +25
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 px-6 text-center text-xs text-neutral-400">
                    <Package className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    <p className="font-semibold text-neutral-600">Belum ada produk terdaftar</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Tambahkan produk baru di menu "Tambah Produk" untuk mulai mengelola stok toko Anda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
