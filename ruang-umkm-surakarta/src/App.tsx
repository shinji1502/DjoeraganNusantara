import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import ApiSmokeTest from './ApiSmokeTest';
// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AnggotaPage } from './pages/public/AnggotaPage';
import { CatalogPage } from './pages/public/CatalogPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { PelatihanPage } from './pages/public/PelatihanPage';
import { EventPage } from './pages/public/EventPage';
import { SertifikasiUsahaPage } from './pages/public/SertifikasiUsahaPage';
import { InformasiPage } from './pages/public/InformasiPage';
import { AksesBertumbuhPage } from './pages/public/AksesBertumbuhPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Pembeli Pages
import { BuyerDashboardPage } from './pages/pembeli/BuyerDashboardPage';
import { CartPage } from './pages/pembeli/CartPage';
import { CheckoutPage } from './pages/pembeli/CheckoutPage';
import { BuyerOrdersPage } from './pages/pembeli/BuyerOrdersPage';
import { BuyerWishlistPage } from './pages/pembeli/BuyerWishlistPage';
import { BuyerAddressPage } from './pages/pembeli/BuyerAddressPage';
import { BuyerProfilePage } from './pages/pembeli/BuyerProfilePage';

// Penjual Pages
import { SellerDashboardPage } from './pages/penjual/SellerDashboardPage';
import { SellerProductsPage } from './pages/penjual/SellerProductsPage';
import { SellerAddProductPage } from './pages/penjual/SellerAddProductPage';
import { SellerOrdersPage } from './pages/penjual/SellerOrdersPage';
import { SellerStockPage } from './pages/penjual/SellerStockPage';
import { SellerAnalyticsPage } from './pages/penjual/SellerAnalyticsPage';
import { SellerVerificationPage } from './pages/penjual/SellerVerificationPage';
import { SellerStoreProfilePage } from './pages/penjual/SellerStoreProfilePage';
import { WaitingVerificationPage } from './pages/penjual/WaitingVerificationPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProgramsPage } from './pages/admin/AdminProgramsPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminActivityLogPage } from './pages/admin/AdminActivityLogPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes - Djoeragan Nusantara 8 Menus */}
          <Route element={<PublicLayout />}>
            {/* 1. Beranda */}
            <Route path="/" element={<HomePage />} />

            {/* 2. Anggota (Sebelumnya Tentang) */}
            <Route path="/anggota" element={<AnggotaPage />} />
            <Route path="/tentang" element={<Navigate to="/anggota" replace />} />

            {/* 3. Katalog */}
            <Route path="/katalog" element={<CatalogPage />} />
            <Route path="/produk/:id" element={<ProductDetailPage />} />

            {/* 4. Pelatihan (Sebelumnya Akademi) */}
            <Route path="/pelatihan" element={<PelatihanPage />} />
            <Route path="/akademi" element={<Navigate to="/pelatihan" replace />} />

            {/* 5. Event (Sebelumnya Agenda) */}
            <Route path="/event" element={<EventPage />} />
            <Route path="/agenda" element={<Navigate to="/event" replace />} />

            {/* 6. Sertifikasi Usaha (Sebelumnya Pasar) */}
            <Route path="/sertifikasi-usaha" element={<SertifikasiUsahaPage />} />
            <Route path="/akses-pasar" element={<Navigate to="/sertifikasi-usaha" replace />} />

            {/* 7. Informasi (Sebelumnya Berita) */}
            <Route path="/informasi" element={<InformasiPage />} />
            <Route path="/berita" element={<Navigate to="/informasi" replace />} />

            {/* 8. Akses Bertumbuh (Sebelumnya Akses Keuangan) */}
            <Route path="/akses-bertumbuh" element={<AksesBertumbuhPage />} />
            <Route path="/akses-keuangan" element={<Navigate to="/akses-bertumbuh" replace />} />

            {/* Autentikasi & Registrasi */}
            <Route path="/masuk" element={<LoginPage />} />
            <Route path="/daftar" element={<RegisterPage />} />
            <Route path="/menunggu-verifikasi" element={<WaitingVerificationPage />} />
          </Route>

          {/* Dashboard Pembeli Routes */}
          <Route path="/pembeli" element={<DashboardLayout role="pembeli" />}>
            <Route index element={<Navigate to="/pembeli/dashboard" replace />} />
            <Route path="dashboard" element={<BuyerDashboardPage />} />
            <Route path="katalog" element={<CatalogPage />} />
            <Route path="keranjang" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="pesanan" element={<BuyerOrdersPage />} />
            <Route path="wishlist" element={<BuyerWishlistPage />} />
            <Route path="alamat" element={<BuyerAddressPage />} />
            <Route path="profil" element={<BuyerProfilePage />} />
          </Route>

          {/* Dashboard Penjual Routes */}
          <Route path="/penjual" element={<DashboardLayout role="penjual" />}>
            <Route index element={<Navigate to="/penjual/dashboard" replace />} />
            <Route path="dashboard" element={<SellerDashboardPage />} />
            <Route path="produk" element={<SellerProductsPage />} />
            <Route path="produk/tambah" element={<SellerAddProductPage />} />
            <Route path="pesanan" element={<SellerOrdersPage />} />
            <Route path="stok" element={<SellerStockPage />} />
            <Route path="analitik" element={<SellerAnalyticsPage />} />
            <Route path="verifikasi" element={<SellerVerificationPage />} />
            <Route path="profil-toko" element={<SellerStoreProfilePage />} />
          </Route>

          {/* Dashboard Admin Routes */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="verifikasi" element={<AdminVerificationPage />} />
            <Route path="pengguna" element={<AdminUsersPage />} />
            <Route path="produk" element={<AdminProductsPage />} />
            <Route path="pesanan" element={<AdminOrdersPage />} />
            <Route path="program" element={<AdminProgramsPage />} />
            <Route path="pengaduan" element={<AdminComplaintsPage />} />
            <Route path="aktivitas" element={<AdminActivityLogPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
