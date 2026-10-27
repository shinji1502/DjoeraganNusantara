import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BuyerProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      email,
      phone,
      address,
    });
    showToast('Profil Anda berhasil diperbarui!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Profil Saya</h1>
        <p className="text-xs text-neutral-500 mt-0.5">Kelola identitas dan preferensi akun konsumen Anda.</p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#D90816]/20"
          />
          <div>
            <h3 className="font-bold text-base text-neutral-900">{currentUser.name}</h3>
            <p className="text-xs text-neutral-500">Akun Konsumen Terdaftar • Surakarta</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">No. WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Alamat Domisili Default</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shadow-md shadow-[#D90816]/20 flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Profil</span>
          </button>
        </form>
      </div>
    </div>
  );
};
