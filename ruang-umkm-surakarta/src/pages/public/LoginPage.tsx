import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Store, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { BatikParang } from '../../components/common/BatikOrnament';

export const LoginPage: React.FC = () => {
  const { users, setCurrentUser, switchRole, verifications, showToast } = useApp();
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
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Harap masukkan alamat email.', 'error');
      return;
    }

    // 1. Cari kecocokan user berdasarkan email di database users
    const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (matchedUser) {
      setCurrentUser(matchedUser);
      showToast(`Selamat datang kembali, ${matchedUser.name}!`, 'success');

      if (matchedUser.role === 'penjual') {
        const isApproved =
          matchedUser.isVerified ||
          matchedUser.sellerVerificationStatus === 'Approved' ||
          verifications.some(
            (v) => (v.sellerId === matchedUser.id || (matchedUser.storeName && v.storeName === matchedUser.storeName)) && v.status === 'disetujui'
          );

        if (isApproved) {
          navigate('/penjual/dashboard');
        } else {
          showToast('Akun Anda masih dalam status menunggu verifikasi admin.', 'info');
          navigate('/menunggu-verifikasi');
        }
      } else if (matchedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/pembeli/dashboard');
      }
      return;
    }

    // 2. Fallback untuk demo role jika email demo diketik
    const demoUser = users.find((u) => u.role === selectedRole);
    if (demoUser && cleanEmail.includes('demo')) {
      setCurrentUser(demoUser);
      showToast(`Masuk sebagai ${demoUser.name} (${selectedRole.toUpperCase()}) berhasil.`, 'success');
      navigate(`/${selectedRole}/dashboard`);
      return;
    }

    // 3. Jika email belum terdaftar
    showToast(`Email "${email}" belum terdaftar. Silakan daftar usaha atau akun baru.`, 'error');
  };

  return (
    <div className="bg-theme-auth min-h-screen py-12 relative overflow-hidden bg-heritage-artisan-watermark">
      <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none opacity-30 hidden lg:block">
        <BatikParang className="h-full w-full" color="#C5A059" opacity={0.12} />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B81D24]/10 text-[#98141A] text-xs font-bold border border-[#B81D24]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Akses Masuk Prototipe Terpadu
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#1C1917]">
            Masuk ke Djoeragan Nusantara
          </h1>
          <p className="text-sm text-[#57534E] max-w-lg mx-auto leading-relaxed">
            Pilih salah satu peran demo siap-uji di bawah untuk langsung mencoba alur kerja Pembeli, Penjual, atau Admin Diskop UKM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Persona 1: Pembeli Demo */}
          <div className="card-heritage p-6 flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Peran 1: Konsumen</span>
                <h3 className="font-serif font-extrabold text-lg text-[#1C1917]">Pembeli Demo</h3>
                <p className="text-xs text-[#78716C] mt-0.5">Ahmad Pratama (pembeli@demo.id)</p>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Cari batik & oleh-oleh khas Solo, masukkan ke keranjang, dan lakukan simulasi checkout pembayaran QRIS dinamis.
              </p>
            </div>

            <button
              onClick={() => handleQuickDemoLogin('pembeli', '/pembeli/dashboard')}
              className="w-full py-2.5 rounded-xl bg-[#1C1917] text-[#FAF7F2] text-xs font-bold hover:bg-[#292524] transition flex items-center justify-center gap-1.5 shadow-sm border border-[#C5A059]/40 cursor-pointer"
            >
              <span>Masuk sebagai Pembeli</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>

          {/* Persona 2: Penjual UMKM Demo */}
          <div className="card-heritage p-6 flex flex-col justify-between text-left space-y-4 relative border-2 border-[#C5A059]">
            <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#B81D24] text-white text-[10px] font-extrabold tracking-wider shadow-sm">
              REKOMENDASI DEMO
            </span>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 text-[#8C5835] flex items-center justify-center font-bold border border-[#C5A059]/30">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5835]">Peran 2: Pelaku UMKM</span>
                <h3 className="font-serif font-extrabold text-lg text-[#1C1917]">Penjual UMKM Demo</h3>
                <p className="text-xs text-[#78716C] mt-0.5">Siti Rahayu (penjual@demo.id)</p>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Kelola katalog Batik Srikandi, tambah produk baru, update stok menipis, dan proses pesanan masuk dari pembeli.
              </p>
            </div>

            <button
              onClick={() => handleQuickDemoLogin('penjual', '/penjual/dashboard')}
              className="w-full py-2.5 rounded-xl bg-[#B81D24] text-white text-xs font-bold hover:bg-[#98141A] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#B81D24]/20 cursor-pointer"
            >
              <span>Masuk sebagai Penjual</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FAF7F2]" />
            </button>
          </div>

          {/* Persona 3: Admin Diskop Demo */}
          <div className="card-heritage p-6 flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-[#C5A059] flex items-center justify-center font-bold border border-[#C5A059]/40">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5835]">Peran 3: Pengelola</span>
                <h3 className="font-serif font-extrabold text-lg text-[#1C1917]">Admin Diskop UKM</h3>
                <p className="text-xs text-[#78716C] mt-0.5">Drs. Hendro Wibowo (admin@demo.id)</p>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Monitoring platform, verifikasi KYC NIB pedagang, moderasi produk, serta tanggapi tiket pengaduan konsumen SLA 24/7.
              </p>
            </div>

            <button
              onClick={() => handleQuickDemoLogin('admin', '/admin/dashboard')}
              className="w-full py-2.5 rounded-xl bg-[#1C1917] text-[#FAF7F2] text-xs font-bold hover:bg-[#292524] transition flex items-center justify-center gap-1.5 shadow-sm border border-[#C5A059]/40 cursor-pointer"
            >
              <span>Masuk sebagai Admin</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        </div>

        {/* Manual Login Form */}
        <div className="card-heritage p-8 max-w-lg mx-auto space-y-5">
          <h3 className="font-serif font-extrabold text-xl text-[#1C1917] text-center">
            Atau Masuk dengan Akun Terdaftar
          </h3>

          <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-[#1C1917] block mb-1">
                Pilih Peran Demo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['pembeli', 'penjual', 'admin'] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 text-xs font-bold rounded-xl border transition capitalize cursor-pointer ${
                      selectedRole === r
                        ? 'bg-[#1C1917] text-[#FAF7F2] border-[#C5A059]'
                        : 'border-[#D6CEC2] bg-[#FAF7F2] text-[#57534E] hover:bg-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1C1917] block mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder={`${selectedRole}@demo.id`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1C1917] block mb-1">
                Kata Sandi Simulasi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#B81D24] text-white font-bold text-xs hover:bg-[#98141A] transition shadow-md shadow-[#B81D24]/20 cursor-pointer"
            >
              Masuk ke Dashboard ({selectedRole.toUpperCase()})
            </button>
          </form>

          <p className="text-center text-xs text-[#78716C] pt-2">
            Belum terdaftar?{' '}
            <Link to="/daftar" className="font-bold text-[#98141A] hover:underline">
              Daftar Usaha Baru di Sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

