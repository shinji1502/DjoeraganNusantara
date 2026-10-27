import React, { useState } from 'react';
import { MapPin, Plus, Check, Trash2, Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BuyerAddressPage: React.FC = () => {
  const { currentUser, showToast } = useApp();
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'Rumah Utama (Solo)',
      recipient: currentUser.name,
      phone: currentUser.phone,
      fullAddress: currentUser.address || 'Jl. Slamet Riyadi No. 142, RT 02 / RW 04, Kelurahan Sriwedari, Banjarsari, Kota Surakarta 57139',
      isPrimary: true,
    },
    {
      id: 'addr-2',
      title: 'Kantor / Tempat Kerja',
      recipient: currentUser.name,
      phone: currentUser.phone,
      fullAddress: 'Kompleks Balai Kota Surakarta, Jl. Jend. Sudirman No. 2, Pasar Kliwon, Surakarta 57111',
      isPrimary: false,
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAddress) return;

    setAddresses((prev) => [
      ...prev,
      {
        id: 'addr-' + Date.now(),
        title: newTitle,
        recipient: currentUser.name,
        phone: currentUser.phone,
        fullAddress: newAddress,
        isPrimary: false,
      },
    ]);
    setIsAddOpen(false);
    setNewTitle('');
    setNewAddress('');
    showToast('Alamat baru berhasil ditambahkan!');
  };

  const handleSetPrimary = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isPrimary: a.id === id }))
    );
    showToast('Alamat utama berhasil diperbarui.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Alamat Pengiriman</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola titik tujuan pengantaran paket pesanan Anda di Surakarta.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Alamat</span>
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-3xl p-6 border transition-all ${
              addr.isPrimary
                ? 'border-[#D90816] ring-1 ring-[#D90816] shadow-sm'
                : 'border-neutral-200/90 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-neutral-900">{addr.title}</span>
                  {addr.isPrimary && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FDEBEC] text-[#D90816] text-[10px] font-bold">
                      Alamat Utama
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-neutral-700">
                  {addr.recipient} • <span className="font-normal text-neutral-500">{addr.phone}</span>
                </p>
                <p className="text-xs text-neutral-600 max-w-lg leading-relaxed">
                  {addr.fullAddress}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!addr.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(addr.id)}
                    className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:border-neutral-900 transition"
                  >
                    Jadikan Utama
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Address */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-200"
          >
            <h3 className="font-bold text-base text-neutral-900">Tambah Alamat Baru</h3>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Label Alamat</label>
              <input
                type="text"
                placeholder="Contoh: Rumah Mertua / Toko Cabang"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Alamat Lengkap</label>
              <textarea
                rows={3}
                placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan di Kota Solo"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold"
              >
                Simpan Alamat
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
