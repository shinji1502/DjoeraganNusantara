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
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all select-none">
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-2 xl:gap-3">
          {/* 1. Left: Brand Identity & Logo (shrink-0) */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D90816] rounded-xl pr-1"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#D90816] to-[#A00610] flex items-center justify-center text-white font-black text-xs sm:text-sm tracking-tight shadow-md shadow-[#D90816]/25 group-hover:scale-105 transition-transform duration-200">
              <span>DN</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-[14px] sm:text-[15.5px] tracking-tight text-[#171717] leading-tight group-hover:text-[#D90816] transition-colors whitespace-nowrap">
                Djoeragan Nusantara
              </span>
              <span className="text-[9px] sm:text-[9.5px] font-bold tracking-wider uppercase text-[#D90816]">
                Wadah Kolaborasi UMKM
              </span>
            </div>
          </Link>

          {/* 2. Middle: Desktop Navigation Links (8 Main Menus) — Responsive, min-w-0 prevents pushing right CTA off-screen */}
          <nav
            className="hidden xl:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-2 flex-1 min-w-0 px-1"
            aria-label="Navigasi Utama"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `px-2 2xl:px-2.5 py-1.5 rounded-lg text-[12px] 2xl:text-[13px] font-semibold whitespace-nowrap tracking-tight transition-all shrink-0 ${
                    isActive
                      ? 'text-[#D90816] bg-[#FDEBEC] font-bold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
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
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-24 xl:w-28 2xl:w-44 pl-7 pr-2.5 py-1.5 text-xs rounded-full bg-neutral-100/90 border border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#D90816] focus:bg-white focus:w-44 transition-all duration-200"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Shopping Bag Cart Icon */}
            <Link
              to="/pembeli/keranjang"
              className="relative p-1.5 sm:p-2 rounded-full text-neutral-600 hover:text-[#D90816] hover:bg-[#FDEBEC]/70 transition-colors shrink-0"
              title="Keranjang Belanja"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D90816] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white shadow-xs">
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
                className="hidden sm:flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition shadow-xs shrink-0"
                title="Buka Dashboard"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover border border-neutral-700"
                />
                <span className="truncate max-w-[75px] 2xl:max-w-[105px]">Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/masuk"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full border border-neutral-300 text-neutral-800 text-xs font-semibold hover:border-neutral-900 hover:text-neutral-900 transition shrink-0"
              >
                Masuk
              </Link>
            )}

            {/* UMKM Registration CTA Button — Strictly shrink-0, whitespace-nowrap, guaranteed never cut off */}
            <Link
              to="/daftar"
              className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 xl:px-4 py-1.5 sm:py-2 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition shadow-xs shadow-[#D90816]/25 flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span>Daftar UMKM</span>
            </Link>

            {/* Mobile / Tablet Menu Trigger (< xl) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none transition shrink-0"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#D90816]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Tablet & Mobile) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-neutral-200 px-4 sm:px-6 pt-3 pb-6 space-y-4 animate-fade-in shadow-xl">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Cari batik, kuliner, kriya, atau UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-neutral-100/90 border border-neutral-200 focus:outline-none focus:border-[#D90816] focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                      ? 'bg-[#FDEBEC] text-[#D90816] font-bold shadow-2xs'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`
                }
              >
                <span>{item.name}</span>
                {item.path === '/' && <span className="text-[10px] text-neutral-400 font-normal">Beranda Utama</span>}
              </NavLink>
            ))}
          </nav>

          {/* Mobile CTAs */}
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
            {currentUser ? (
              <Link
                to={
                  currentUser.role === 'penjual' && !currentUser.isVerified
                    ? '/menunggu-verifikasi'
                    : `/${currentUser.role}/dashboard`
                }
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-neutral-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Buka Dashboard ({currentUser.role.toUpperCase()})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/masuk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-neutral-300 text-neutral-800 text-xs sm:text-sm font-bold hover:bg-neutral-50 transition"
              >
                Masuk ke Akun
              </Link>
            )}

            <Link
              to="/daftar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-[#D90816] text-white text-xs sm:text-sm font-bold shadow-xs shadow-[#D90816]/25 flex items-center justify-center gap-2"
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
