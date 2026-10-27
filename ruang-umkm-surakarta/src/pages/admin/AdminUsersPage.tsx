import React, { useState } from 'react';
import { Users, Search, Shield, ShoppingBag, Store, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const { users, switchRole, showToast } = useApp();
  const [roleFilter, setRoleFilter] = useState<string>('semua');
  const [searchWord, setSearchWord] = useState('');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'semua' && u.role !== roleFilter) return false;
    if (searchWord.trim()) {
      const q = searchWord.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.storeName && u.storeName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleImpersonate = (role: UserRole, name: string) => {
    switchRole(role);
    showToast(`Beralih simulasi ke akun ${name} (${role.toUpperCase()})`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Manajemen Pengguna Platform</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Daftar seluruh akun konsumen, pelaku usaha UMKM Surakarta, dan staf dinas operasional.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['semua', 'pembeli', 'penjual', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition ${
                roleFilter === r
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {r === 'semua' ? 'Semua Pengguna' : r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari nama, email, toko..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-neutral-300 focus:outline-none focus:border-[#D90816]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAF8F7] text-neutral-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-6">Pengguna</th>
                <th className="py-3.5 px-4">Peran (Role)</th>
                <th className="py-3.5 px-4">Kontak & Telepon</th>
                <th className="py-3.5 px-4">Toko / Entitas</th>
                <th className="py-3.5 px-4">Status Legalitas</th>
                <th className="py-3.5 px-6 text-right">Uji Demo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/80 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-neutral-900">{u.name}</p>
                        <p className="text-[10px] text-neutral-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] capitalize ${
                        u.role === 'admin'
                          ? 'bg-neutral-900 text-white'
                          : u.role === 'penjual'
                          ? 'bg-[#FDEBEC] text-[#D90816]'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {u.role === 'admin' && <Shield className="w-3 h-3" />}
                      {u.role === 'penjual' && <Store className="w-3 h-3" />}
                      {u.role === 'pembeli' && <ShoppingBag className="w-3 h-3" />}
                      <span>{u.role}</span>
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-neutral-700">{u.phone}</td>

                  <td className="py-4 px-4 font-medium text-neutral-900">
                    {u.storeName || '- (Konsumen Ritel)'}
                  </td>

                  <td className="py-4 px-4">
                    {u.role === 'penjual' ? (
                      u.isVerified ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          NIB Terverifikasi
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                          Proses Legalisasi
                        </span>
                      )
                    ) : (
                      <span className="text-neutral-400 text-[10px]">Terverifikasi Email</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleImpersonate(u.role, u.name)}
                      className="px-3 py-1 rounded-xl border border-neutral-300 text-neutral-700 hover:border-neutral-900 text-[11px] font-semibold transition"
                    >
                      Masuk sebagai Akun Ini
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
