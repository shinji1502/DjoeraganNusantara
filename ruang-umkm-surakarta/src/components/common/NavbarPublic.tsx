import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Store,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NavbarPublic: React.FC = () => {
  const { cartTotalCount, currentUser } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/katalog?cari=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  // 8 Main Navigation Menus with responsive full and compact labels
  const navLinks = [
    { name: 'Beranda', shortName: 'Beranda', path: '/' },
    { name: 'Anggota', shortName: 'Anggota', path: '/anggota' },
    { name: 'Katalog', shortName: 'Katalog', path: '/katalog' },
    { name: 'Pelatihan', shortName: 'Pelatihan', path: '/pelatihan' },
    { name: 'Event', shortName: 'Event', path: '/event' },
    { name: 'Sertifikasi Usaha', shortName: 'Sertifikasi', path: '/sertifikasi-usaha' },
    { name: 'Informasi', shortName: 'Informasi', path: '/informasi' },
    { name: 'Akses Bertumbuh', shortName: 'Akses Bisnis', path: '/akses-bertumbuh' },
  ];

  return (
    <header className="w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7E2D9] transition-all select-none z-40">
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-2 xl:gap-3">
          {/* 1. Left: Brand Identity & Logo (shrink-0) */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B81D24] rounded-xl pr-1"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#B81D24] to-[#7A0D13] ring-1 ring-[#C5A059]/40 flex items-center justify-center text-white font-black text-xs sm:text-sm tracking-tight shadow-md shadow-[#B81D24]/20 group-hover:scale-105 transition-transform duration-200">
              <span className="tracking-tighter">DN</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-[14px] sm:text-[15.5px] tracking-tight text-[#1C1917] leading-tight group-hover:text-[#B81D24] transition-colors whitespace-nowrap">
                Djoeragan Nusantara
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-widest uppercase text-[#9A6B39] flex items-center gap-1">
                <span>Wadah Kolaborasi UMKM</span>
              </span>
            </div>
          </Link>

          {/* 2. Middle: Desktop Navigation Links (8 Main Menus) — Responsive, min-w-0 prevents pushing right CTA off-screen */}
          <nav
            className="hidden xl:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-1.5 flex-1 min-w-0 px-1"
            aria-label="Navigasi Utama"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative px-2.5 2xl:px-3 py-1.5 text-[12.5px] 2xl:text-[13px] whitespace-nowrap tracking-tight transition-all shrink-0 ${
                    isActive
                      ? 'text-[#B81D24] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#B81D24]'
                      : 'text-[#44403C] hover:text-[#1C1917] font-semibold hover:bg-black/5 rounded-lg'
                  }`
                }
              >
                <span className="hidden 2xl:inline">{item.name}</span>
                <span className="2xl:hidden">{item.shortName}</span>
              </NavLink>
            ))}
          </nav>

          {/* 3. Right: Action Area (Search, Cart, Dashboard, Daftar UMKM) — Strictly anchored via shrink-0 and ml-auto */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0 ml-auto">
            {/* Quick Search on Desktop (Compact by default, expands on focus) */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block shrink-0">
              <input
                type="text"
                placeholder="Cari produk / UMKM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-24 xl:w-28 2xl:w-44 pl-7 pr-2.5 py-1.5 text-xs rounded-full bg-white/80 border border-[#E7E2D9] text-[#1C1917] placeholder:text-neutral-400 focus:outline-none focus:border-[#C5A059] focus:bg-white focus:w-48 transition-all duration-200 shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Shopping Bag Cart Icon */}
            <Link
              to="/pembeli/keranjang"
              className="relative p-1.5 sm:p-2 rounded-full text-[#44403C] hover:text-[#B81D24] hover:bg-[#F5EFEB] transition-colors shrink-0"
              title="Keranjang Belanja"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#B81D24] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-[#FAF7F2] shadow-xs">
                  {cartTotalCount}
                </span>
              )}
            </Link>

            {/* Account / Dashboard Button */}
            {currentUser ? (
              <Link
                to={
                  currentUser.role === 'penjual' && !currentUser.isVerified
                    ? '/menunggu-verifikasi'
                    : `/${currentUser.role}/dashboard`
                }
                className="hidden sm:flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold hover:bg-[#2C2724] transition shadow-xs shrink-0 border border-stone-700/60"
                title="Buka Dashboard"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover border border-amber-600/40"
                />
                <span className="truncate max-w-[75px] 2xl:max-w-[105px]">Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/masuk"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full border border-[#D6CEC2] bg-white/70 text-[#1C1917] text-xs font-semibold hover:border-[#1C1917] hover:bg-white transition shrink-0"
              >
                Masuk
              </Link>
            )}

            {/* UMKM Registration CTA Button — Strictly shrink-0, whitespace-nowrap, guaranteed never cut off */}
            <Link
              to="/daftar"
              className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 xl:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white text-xs font-bold hover:from-[#98141A] hover:to-[#7A0D13] transition shadow-xs shadow-[#B81D24]/20 ring-1 ring-amber-300/20 flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span>Daftar UMKM</span>
            </Link>

            {/* Mobile / Tablet Menu Trigger (< xl) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-xl text-neutral-700 hover:bg-[#F5EFEB] hover:text-[#1C1917] focus:outline-none transition shrink-0"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#B81D24]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Tablet & Mobile) */}
      {/* Mobile Drawer Navigation (Tablet & Mobile) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF7F2] border-t border-[#E7E2D9] px-4 sm:px-6 pt-3 pb-6 space-y-4 animate-fade-in shadow-xl">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Cari batik, kuliner, kriya, atau UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-[#E7E2D9] focus:outline-none focus:border-[#C5A059] focus:bg-white transition text-[#1C1917]"
            />
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Mobile 8 nav links */}
          <nav className="flex flex-col space-y-1 pt-1" aria-label="Menu navigasi mobile">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-between ${
                    isActive
                      ? 'bg-[#F5EFEB] text-[#B81D24] font-bold shadow-2xs border border-amber-900/10'
                      : 'text-[#44403C] hover:bg-[#F5EFEB]/70'
                  }`
                }
              >
                <span>{item.name}</span>
                {item.path === '/' && <span className="text-[10px] text-[#78716C] font-normal">Beranda Utama</span>}
              </NavLink>
            ))}
          </nav>

          {/* Mobile CTAs */}
          <div className="pt-3 border-t border-[#E7E2D9] flex flex-col gap-2.5">
            {currentUser ? (
              <Link
                to={
                  currentUser.role === 'penjual' && !currentUser.isVerified
                    ? '/menunggu-verifikasi'
                    : `/${currentUser.role}/dashboard`
                }
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-[#1C1917] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs border border-stone-700/60"
              >
                <span>Buka Dashboard ({currentUser.role.toUpperCase()})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/masuk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-[#D6CEC2] bg-white text-[#1C1917] text-xs sm:text-sm font-bold hover:bg-[#F5EFEB] transition"
              >
                Masuk ke Akun
              </Link>
            )}

            <Link
              to="/daftar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white text-xs sm:text-sm font-bold shadow-xs shadow-[#B81D24]/20 flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Daftarkan Usaha UMKM</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
