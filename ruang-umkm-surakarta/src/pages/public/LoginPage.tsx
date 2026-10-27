import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Store, Shield, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { switchRole, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('pembeli');

  const handleQuickDemoLogin = (role: 'pembeli' | 'penjual' | 'admin', path: string) => {
    switchRole(role);
    showToast(`Berhasil masuk sebagai ${role.toUpperCase()} Demo. Selamat datang!`, 'success');
    navigate(path);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Harap masukkan alamat email.', 'error');
      return;
    }
    switchRole(selectedRole);
    showToast(`Masuk simulasi sebagai ${selectedRole.toUpperCase()} berhasil.`, 'success');
    navigate(`/${selectedRole}/dashboard`);
  };

  return (
    <div className="bg-theme-auth min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
      <div className="text-center space-y-3 mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Akses Masuk Prototipe MVP
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717]">
          Masuk ke Ruang UMKM Surakarta
        </h1>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto">
          Pilih salah satu peran demo siap-uji di bawah untuk langsung mencoba alur kerja Pembeli, Penjual, atau Admin Diskop UKM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Persona 1: Pembeli Demo */}
        <div className="bg-white rounded-3xl border-2 border-neutral-200/90 hover:border-blue-500 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between text-left space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Peran 1: Konsumen</span>
              <h3 className="font-extrabold text-base text-neutral-900">Pembeli Demo</h3>
              <p className="text-xs text-neutral-500 mt-1">Ahmad Pratama (pembeli@demo.id)</p>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Cari batik & oleh-oleh khas Solo, masukkan ke keranjang, dan lakukan simulasi checkout pembayaran QRIS dinamis.
            </p>
          </div>

          <button
            onClick={() => handleQuickDemoLogin('pembeli', '/pembeli/dashboard')}
            className="w-full py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <span>Masuk sebagai Pembeli</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Persona 2: Penjual UMKM Demo */}
        <div className="bg-white rounded-3xl border-2 border-[#D90816]/30 hover:border-[#D90816] p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between text-left space-y-4 relative">
          <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#D90816] text-white text-[10px] font-extrabold tracking-wider">
            REKOMENDASI DEMO
          </span>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FDEBEC] text-[#D90816] flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D90816]">Peran 2: Pelaku UMKM</span>
              <h3 className="font-extrabold text-base text-neutral-900">Penjual UMKM Demo</h3>
              <p className="text-xs text-neutral-500 mt-1">Siti Rahayu (penjual@demo.id)</p>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Kelola katalog Batik Srikandi, tambah produk baru, update stok menipis, dan proses pesanan masuk dari pembeli.
            </p>
          </div>

          <button
            onClick={() => handleQuickDemoLogin('penjual', '/penjual/dashboard')}
            className="w-full py-2.5 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#D90816]/20"
          >
            <span>Masuk sebagai Penjual</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Persona 3: Admin Diskop Demo */}
        <div className="bg-white rounded-3xl border-2 border-neutral-200/90 hover:border-neutral-900 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between text-left space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">Peran 3: Pengelola</span>
              <h3 className="font-extrabold text-base text-neutral-900">Admin Diskop UKM</h3>
              <p className="text-xs text-neutral-500 mt-1">Drs. Hendro Wibowo (admin@demo.id)</p>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Monitoring platform, verifikasi KYC NIB pedagang, moderasi produk, serta tanggapi tiket pengaduan konsumen SLA 24/7.
            </p>
          </div>

          <button
            onClick={() => handleQuickDemoLogin('admin', '/admin/dashboard')}
            className="w-full py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-center gap-1.5 shadow-md shadow-neutral-900/20"
          >
            <span>Masuk sebagai Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 max-w-lg mx-auto shadow-xs space-y-5">
        <h3 className="font-bold text-base text-neutral-900 text-center">
          Atau Masuk dengan Akun Kustom
        </h3>

        <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Pilih Peran Demo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['pembeli', 'penjual', 'admin'] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 text-xs font-bold rounded-xl border transition capitalize ${
                    selectedRole === r
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              placeholder={`${selectedRole}@demo.id`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Kata Sandi Simulasi
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#D90816] text-white font-bold text-xs hover:bg-[#b80512] transition shadow-md shadow-[#D90816]/20"
          >
            Masuk ke Dashboard ({selectedRole.toUpperCase()})
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 pt-2">
          Belum terdaftar?{' '}
          <Link to="/daftar" className="font-bold text-[#D90816] hover:underline">
            Daftar Usaha Baru di Sini
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
};
