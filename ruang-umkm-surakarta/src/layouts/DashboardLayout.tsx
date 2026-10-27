import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Package,
  PlusCircle,
  Clock,
  Heart,
  MapPin,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  Users,
  Settings,
  BookOpen,
  MessageSquareWarning,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WaitingVerificationPage } from '../pages/penjual/WaitingVerificationPage';

interface DashboardLayoutProps {
  role: 'pembeli' | 'penjual' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { currentUser, switchRole, cartTotalCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Guard: Seller cannot access dashboard until Status = Approved
  if (
    role === 'penjual' &&
    (!currentUser.isVerified ||
      currentUser.sellerVerificationStatus === 'Waiting Verification' ||
      currentUser.sellerVerificationStatus === 'Rejected')
  ) {
    return <WaitingVerificationPage />;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Ensure navigation to another dashboard page resets scroll position to top (scrollTop = 0)
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  interface NavItem {
    name: string;
    path: string;
    icon: any;
    badge?: number | string;
  }

  // Define sidebar navigation items per role as requested in the prompt
  const navConfigs: Record<'pembeli' | 'penjual' | 'admin', NavItem[]> = {
    pembeli: [
      { name: 'Beranda Pembeli', path: '/pembeli/dashboard', icon: LayoutDashboard },
      { name: 'Katalog Produk', path: '/pembeli/katalog', icon: ShoppingBag },
      { name: 'Keranjang', path: '/pembeli/keranjang', icon: Package, badge: cartTotalCount > 0 ? cartTotalCount : undefined },
      { name: 'Pesanan Saya', path: '/pembeli/pesanan', icon: Clock },
      { name: 'Wishlist Favorit', path: '/pembeli/wishlist', icon: Heart },
      { name: 'Alamat Pengiriman', path: '/pembeli/alamat', icon: MapPin },
      { name: 'Profil Saya', path: '/pembeli/profil', icon: UserIcon },
    ],
    penjual: [
      { name: 'Ringkasan Bisnis', path: '/penjual/dashboard', icon: LayoutDashboard },
      { name: 'Produk Saya', path: '/penjual/produk', icon: Package },
      { name: 'Tambah Produk', path: '/penjual/produk/tambah', icon: PlusCircle },
      { name: 'Pesanan Masuk', path: '/penjual/pesanan', icon: Clock },
      { name: 'Stok Produk', path: '/penjual/stok', icon: AlertTriangle },
      { name: 'Analitik & Penjualan', path: '/penjual/analitik', icon: TrendingUp },
      { name: 'Verifikasi NIB UMKM', path: '/penjual/verifikasi', icon: FileCheck },
      { name: 'Profil Toko', path: '/penjual/profil-toko', icon: Store },
    ],
    admin: [
      { name: 'Ringkasan Platform', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Verifikasi UMKM (KYC)', path: '/admin/verifikasi', icon: FileCheck },
      { name: 'Manajemen Pengguna', path: '/admin/pengguna', icon: Users },
      { name: 'Moderasi Produk', path: '/admin/produk', icon: Package },
      { name: 'Manajemen Pesanan', path: '/admin/pesanan', icon: Clock },
      { name: 'Akademi & Agenda', path: '/admin/program', icon: BookOpen },
      { name: 'Layanan Pengaduan (SLA)', path: '/admin/pengaduan', icon: MessageSquareWarning },
      { name: 'Aktivitas & Log', path: '/admin/aktivitas', icon: Settings },
    ],
  };

  const currentNav = navConfigs[role];

  // Helper title & role label
  const roleLabels = {
    pembeli: { title: 'Portal Pembeli', badge: 'Akun Konsumen', color: 'text-blue-600 bg-blue-50' },
    penjual: { title: 'Portal Penjual UMKM', badge: 'Mitra Usaha Surakarta', color: 'text-emerald-600 bg-emerald-50' },
    admin: { title: 'Dashboard Operasional', badge: 'Pengelola Diskop UKM', color: 'text-[#D90816] bg-[#FDEBEC]' },
  };

  const handleLogout = () => {
    switchRole('pembeli');
    navigate('/');
  };

  // Generate simple breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbText = pathSegments.length > 1
    ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1).replace(/-/g, ' ')
    : 'Dashboard';

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col max-w-full overflow-x-clip min-w-0">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-200/80 shrink-0">
          {/* Brand header */}
          <div className="h-20 px-6 border-b border-neutral-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D90816] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#D90816]/20">
                RU
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-[#171717]">
                  Ruang UMKM
                </span>
                <span className="text-[10px] font-semibold text-[#D90816] tracking-wider uppercase">
                  {roleLabels[role].title}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2">
              Menu Utama
            </div>
            {currentNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === `/${role}/dashboard`}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D90816] text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom user box & portal link */}
          <div className="p-4 border-t border-neutral-100 space-y-2">
            <Link
              to="/"
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                <span>Lihat Website Publik</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <div className="p-3 bg-[#FAF8F7] rounded-xl border border-neutral-200/60 flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-white shadow-xs shrink-0"
              />
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-neutral-900 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-neutral-500 truncate capitalize">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col z-10 p-4">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#D90816] flex items-center justify-center text-white font-extrabold text-sm">
                    RU
                  </div>
                  <span className="font-extrabold text-sm text-[#171717]">Ruang UMKM Solo</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-1">
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      end={item.path === `/${role}/dashboard`}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-[#171717] text-white'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D90816] text-white">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-neutral-100">
                {role === 'pembeli' && (
                  <a
                    href="https://wa.me/6285920372907"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-1.5 mb-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ChatCS WhatsApp</span>
                  </a>
                )}
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="block text-center py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-lg mb-2"
                >
                  Kembali ke Beranda Publik
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg flex items-center justify-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Sesi Demo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Topbar */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-medium capitalize">{role}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                <span className="font-bold text-neutral-900">{breadcrumbText}</span>
              </div>
            </div>

            {/* Topbar Right Area */}
            <div className="flex items-center gap-3">
              {/* Role badge / ChatCS Link */}
              {role === 'pembeli' ? (
                <a
                  href="https://wa.me/6285920372907"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
                  title="Hubungi Layanan Pengaduan & Bantuan via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ChatCS</span>
                </a>
              ) : (
                <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${roleLabels[role].color}`}>
                  <Sparkles className="w-3 h-3" />
                  {roleLabels[role].badge}
                </span>
              )}

              {/* Notification icon */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition relative"
                  aria-label="Notifikasi"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D90816]"></span>
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-neutral-200 p-4 z-50 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-2 font-bold text-neutral-900">
                      <span>Notifikasi Sistem</span>
                      <span className="text-[10px] text-[#D90816] font-normal cursor-pointer">Tandai telah dibaca</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-[#FAF8F7] hover:bg-neutral-100 transition">
                        <p className="font-semibold text-neutral-800">Verifikasi NIB Sesuai Permendag 19/2026</p>
                        <p className="text-neutral-500 text-[11px] mt-0.5">Seluruh merchant wajib memiliki status legalitas OSS.</p>
                      </div>
                      <div className="p-2 rounded-lg bg-[#FAF8F7] hover:bg-neutral-100 transition">
                        <p className="font-semibold text-neutral-800">Pelatihan e-Katalog LKPP Segera Dimulai</p>
                        <p className="text-neutral-500 text-[11px] mt-0.5">Sisa kuota pelatihan tinggal 12 peserta.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-100 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                  />
                  <span className="text-xs font-semibold text-neutral-800 hidden md:inline max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                      <p className="font-bold text-neutral-900 truncate">{currentUser.name}</p>
                      <p className="text-neutral-400 text-[11px] truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      to="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-50 transition"
                    >
                      <ExternalLink className="w-4 h-4 text-neutral-400" />
                      <span>Ke Beranda Publik</span>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Sesi Demo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Subpage Route Outlet */}
          <main className="p-4 sm:p-8 flex-1 max-w-full overflow-x-clip min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
