import React, { useState } from 'react';
import { MapPin, Plus, Check, Trash2, Edit2, X, Building, Phone, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Address } from '../../types';

export const BuyerAddressPage: React.FC = () => {
  const { addresses, addAddress, deleteAddress, setPrimaryAddress, updateAddress, currentUser } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [district, setDistrict] = useState('Banjarsari');
  const [fullAddress, setFullAddress] = useState('');
  const [postalCode, setPostalCode] = useState('57139');
  const [isPrimary, setIsPrimary] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('Rumah');
    setRecipientName(currentUser.name);
    setPhone(currentUser.phone);
    setDistrict('Banjarsari');
    setFullAddress('');
    setPostalCode('57139');
    setIsPrimary(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setTitle(addr.title);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setDistrict(addr.district || 'Banjarsari');
    setFullAddress(addr.fullAddress);
    setPostalCode(addr.postalCode || '57139');
    setIsPrimary(addr.isPrimary);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !recipientName || !phone || !fullAddress) return;

    if (editingId) {
      updateAddress(editingId, {
        title,
        recipientName,
        phone,
        district,
        fullAddress,
        postalCode,
        isPrimary,
      });
    } else {
      addAddress({
        userId: currentUser.id,
        title,
        recipientName,
        phone,
        district,
        fullAddress,
        postalCode,
        isPrimary,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Alamat Pengiriman</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola titik tujuan pengantaran paket pesanan Anda di Surakarta.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Alamat</span>
        </button>
      </div>

      <div className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-3xl p-6 border transition-all ${
                addr.isPrimary
                  ? 'border-[#D90816] ring-1 ring-[#D90816] shadow-xs'
                  : 'border-neutral-200/90 shadow-2xs hover:border-neutral-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-neutral-900">{addr.title}</span>
                    {addr.isPrimary && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FDEBEC] text-[#D90816] text-[10px] font-bold">
                        Alamat Utama
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold">
                      Kec. {addr.district}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-neutral-700">
                    {addr.recipientName} • <span className="font-normal text-neutral-500">{addr.phone}</span>
                  </p>
                  <p className="text-xs text-neutral-600 max-w-lg leading-relaxed">
                    {addr.fullAddress} {addr.postalCode && `(${addr.postalCode})`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!addr.isPrimary && (
                    <button
                      onClick={() => setPrimaryAddress(addr.id)}
                      className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:border-neutral-900 transition"
                    >
                      Jadikan Utama
                    </button>
                  )}

                  <button
                    onClick={() => openEditModal(addr)}
                    className="p-1.5 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-50 transition"
                    title="Ubah Alamat"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
                      title="Hapus Alamat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">Belum Ada Alamat Tersimpan</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Tambahkan alamat rumah atau kantor Anda di Kota Surakarta untuk kemudahan saat checkout.
            </p>
            <button
              onClick={openAddModal}
              className="inline-block px-5 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold"
            >
              Tambah Alamat Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Address */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-neutral-200 animate-scale-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900">
                {editingId ? 'Ubah Alamat Pengiriman' : 'Tambah Alamat Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Label Alamat</label>
                <input
                  type="text"
                  placeholder="Rumah / Kantor / Toko"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Kecamatan di Solo</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816] bg-white"
                >
                  <option value="Banjarsari">Banjarsari</option>
                  <option value="Jebres">Jebres</option>
                  <option value="Laweyan">Laweyan</option>
                  <option value="Pasar Kliwon">Pasar Kliwon</option>
                  <option value="Serengan">Serengan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Nama Penerima</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">No. WhatsApp / Telepon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                  required
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-bold text-neutral-700 block mb-1">Alamat Lengkap</label>
              <textarea
                rows={3}
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan patokan terdekat"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs items-center">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                />
              </div>

              <label className="flex items-center gap-2 pt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D90816] focus:ring-[#D90816]"
                />
                <span className="font-bold text-neutral-700">Jadikan alamat utama</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition shadow-xs"
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
