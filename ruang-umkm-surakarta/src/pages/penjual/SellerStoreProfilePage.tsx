import React, { useState } from 'react';
import { Store, MapPin, Phone, Mail, Save, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SellerStoreProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, showToast } = useApp();

  const [storeName, setStoreName] = useState(currentUser.storeName || 'Batik Danar Srikandi Solo');
  const [ownerName, setOwnerName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(
    currentUser.address || 'Kampung Batik Laweyan Jl. Dr. Rajiman No. 420, Laweyan, Surakarta'
  );
  const [bio, setBio] = useState(
    'Produsen batik tulis dan cap premium asli Laweyan Surakarta sejak tahun 1998. Menjaga warisan motif klasik Keraton dengan sentuhan desain kontemporer.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      storeName,
      name: ownerName,
      phone,
      address,
    });
    showToast('Profil usaha toko berhasil disimpan!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Profil Toko & Usaha</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Atur informasi publik toko Anda yang akan dilihat oleh konsumen di katalog produk.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
          <div className="w-16 h-16 rounded-2xl bg-[#FDEBEC] text-[#D90816] flex items-center justify-center font-extrabold text-2xl">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-neutral-900">{storeName}</h3>
            <p className="text-xs text-neutral-500">Izin NIB: {currentUser.nib || '0220009831921'} • Kampung Batik Laweyan</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Nama Toko / Merk Usaha</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Nama Pemilik / Penanggung Jawab</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                required
              />
            </div>
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Nomor WhatsApp Operasional</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Alamat Workshop / Toko Fisik di Solo</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
              required
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Deskripsi Singkat Usaha</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shadow-md shadow-[#D90816]/20 flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Informasi Toko</span>
          </button>
        </form>
      </div>
    </div>
  );
};
