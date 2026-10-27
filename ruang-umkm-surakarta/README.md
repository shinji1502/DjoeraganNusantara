# Ruang UMKM Surakarta — Frontend Website & 3 Dashboard MVP

Platform Digital Akses Pasar dan Ekosistem Pengembangan UMKM Kota Surakarta (Solo). Menghubungkan perajin batik, maestro kuliner, dan pelaku ekonomi kreatif dengan pembeli ritel (B2C), korporat/swasta (B2B), serta pengadaan barang & jasa pemerintah (B2G e-Katalog LKPP).

---

## 1. Identitas Visual & Prinsip Desain

Desain platform dirancang memadukan dua referensi visual utama:
1. **Referensi Editorial Dewi Pertiwi**:
   - Tipografi sans-serif modern (*Plus Jakarta Sans*) dengan hierarki tegas.
   - Tekstur grid latar sangat halus (*subtle light grid*).
   - Bentuk tombol membulat (*pill buttons*).
   - Whitespace yang lega, inklusif, dan humanis.
2. **Referensi Layanan UMKM Jakpreneur**:
   - Struktur penyajian akses pasar (Kios Stasiun & Bandara, Smart Vending Machine, B2G e-Katalog LKPP, Jumat Beli Lokal, Car Free Day Slamet Riyadi).
   - Klaster program pembinaan, akademi, sertifikasi halal mandiri, dan mentoring usaha.
3. **Palet Warna Utama**:
   - Primary Red: `#D90816`
   - Near-black: `#171717`
   - White: `#FFFFFF`
   - Off-white: `#FAF8F7`
   - Soft Red: `#FDEBEC`
   - Secondary Gray: `#6B6B6B`

---

## 2. Fitur & Cakupan MVP

### A. Website Publik
- **Beranda (`/`)**: Hero editorial bertema *"Ruang UMKM Surakarta, Bergerak Untuk Negeri"*, 4 pilar ekosistem, produk unggulan terkurasi, akses pasar, program akademi, agenda pameran Solo Great Sale & CFD, serta formulir pendaftaran mitra.
- **Tentang Platform (`/tentang`)**: Visi-misi, sebaran klaster UMKM di 5 kecamatan Kota Solo (Laweyan, Pasar Kliwon, Jebres, Banjarsari, Serengan), dan transparansi regulasi Permendag 19/2026.
- **Katalog UMKM (`/katalog`)**: Filter kategori, filter wilayah kecamatan, filter sertifikasi mutu (Halal MUI, Batik Mark Solo, P-IRT, SNI), pencarian real-time, dan pengurutan (Populer, Rating, Harga).
- **Detail Produk (`/produk/:id`)**: Galeri foto produk, verifikasi legalitas NIB toko, spesifikasi, kontrol kuantitas beli, tombol tambah keranjang, beli langsung, dan jaminan perlindungan konsumen.
- **Akademi & Pelatihan (`/akademi`)**: Daftar kelas e-Katalog LKPP, QRIS BI, sertifikasi halal mandiri, dan mentoring 1-on-1 dengan tombol pendaftaran interaktif berkuota dinamis.
- **Agenda & Event (`/agenda`)**: Jadwal pameran, festival kuliner, dan bazzar Car Free Day dengan pengingat acara.
- **Akses Pasar (`/akses-pasar`)**: Informasi display kios fisik, vending machine, dan integrasi belanja publik e-Katalog LKPP.
- **Berita & Edukasi (`/berita`)**: Informasi kebijakan dan artikel panduan wirausaha.
- **Masuk Simulasi (`/masuk`)**: 1-click switcher demo persona (Pembeli, Penjual, Admin).
- **Pendaftaran UMKM (`/daftar`)**: Formulir registrasi pelaku usaha dengan input NIB OSS 13 digit.

### B. Dashboard Pembeli (`/pembeli/...`)
- **Beranda (`/pembeli/dashboard`)**: Sapaan personal *"Sugeng Rawuh"*, ringkasan status transaksi, pencarian cepat, dan rekomendasi produk.
- **Katalog Belanja (`/pembeli/katalog`)**: Navigasi katalog terpadu di dalam dashboard.
- **Keranjang Belanja (`/pembeli/keranjang`)**: Ubah kuantitas barang, hapus item, simulasi kode promo (`SOLOBERKAH`), dan kalkulasi ongkir.
- **Checkout Simulasi (`/pembeli/checkout`)**: Pemilihan alamat di Surakarta, kurir lokal (JNE, SiCepat, GoSend), metode bayar (QRIS, VA BCA, SPM Pemkot).
- **Simulasi QRIS Interaktif**: Modal QRIS dinamis berstandar Bank Indonesia dengan timer kedaluwarsa dan tombol simulasi pembayaran instan.
- **Pesanan Saya (`/pembeli/pesanan`)**: Riwayat transaksi, status berjenjang, pelacakan pengiriman kurir live, dan nota digital.
- **Wishlist (`/pembeli/wishlist`)**: Produk favorit tersimpan.
- **Alamat Pengiriman (`/pembeli/alamat`)**: Pengelolaan titik pengantaran paket di Solo.
- **Profil Konsumen (`/pembeli/profil`)**: Pengaturan data akun.

### C. Dashboard Penjual (`/penjual/...`)
- **Ringkasan Bisnis (`/penjual/dashboard`)**: Metrik omzet GMV, jumlah pesanan baru, produk aktif, alert stok menipis, dan grafik tren penjualan (Recharts AreaChart).
- **Manajemen Produk (`/penjual/produk`)**: Tabel CRUD produk dengan filter kategori, pencarian, dan status tayang.
- **Tambah Produk (`/penjual/produk/tambah`)**: Formulir penambahan produk dengan live image preview, harga coret, stok, kecamatan asal, dan tag sertifikasi.
- **Pesanan Masuk (`/penjual/pesanan`)**: Alur pemrosesan pesanan berjenjang: *Menunggu Konfirmasi &rarr; Diproses (Kemas) &rarr; Dikirim (Input Resi) &rarr; Selesai*.
- **Stok Produk (`/penjual/stok`)**: Peringatan stok kritis (&lt;5 pcs) dan tombol tambah cepat (+5, +10, +25).
- **Analitik Penjualan (`/penjual/analitik`)**: Diagram lingkaran distribusi channel (*50% B2C, 30% B2B, 20% B2G*) sesuai brief dokumen, grafik batang pertumbuhan GMV bulanan, serta skor CSAT & OTIF.
- **Verifikasi Legalitas (`/penjual/verifikasi`)**: Status kepatuhan Permendag 19/2026, nomor NIB OSS, dan riwayat tinjauan kurator.
- **Profil Toko (`/penjual/profil-toko`)**: Informasi publik toko, workshop di Solo, dan narasi usaha.

### D. Dashboard Admin Diskop UKM (`/admin/...`)
- **Ringkasan Platform (`/admin/dashboard`)**: Total akun terdaftar, antrean verifikasi NIB, nilai transaksi platform, grafik aktivitas 7 hari, dan audit log admin.
- **Verifikasi UMKM (`/admin/verifikasi`)**: Modul peninjauan berkas NIB dan KTP dengan aksi Setujui (Lolos Permendag) atau Tolak (dengan alasan evaluasi).
- **Manajemen Pengguna (`/admin/pengguna`)**: Direktori pengguna dengan filter peran dan pintasan uji impersonasi.
- **Moderasi Produk (`/admin/produk`)**: Kurasi kelayakan produk dan toggle takedown/aktifkan etalase.
- **Monitoring Pesanan (`/admin/pesanan`)**: Rekapitulasi transaksi antar-pengguna dan tombol ekspor data.
- **Akademi & Agenda (`/admin/program`)**: Manajemen kuota pelatihan dan agenda bazzar Solo.
- **Pengaduan Konsumen (`/admin/pengaduan`)**: Penanganan tiket sengketa konsumen dengan target SLA &lt;24 jam sesuai Permendag 19/2026.
- **Audit Trail (`/admin/aktivitas`)**: Catatan waktu dan sasaran tindakan administratif pengelola.

---

## 3. Teknologi yang Digunakan

| Kebutuhan | Teknologi |
| :--- | :--- |
| **Framework & Core** | React 19, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS v4, Subtle Grid Texture |
| **Routing** | React Router DOM v7 |
| **Icons** | Lucide React |
| **Visualisasi Data** | Recharts (AreaChart, BarChart, PieChart) |
| **Format Standar** | `Intl.NumberFormat('id-ID')`, `Intl.DateTimeFormat('id-ID')` |
| **State & Sinkronisasi** | Unified React Context (`AppContext`) + `localStorage` |

---

## 4. Cara Menjalankan Aplikasi

### Prasyarat
- Node.js versi 18+ (disarankan v20+ atau v24+)
- npm versi 9+

### Instalasi Dependensi
```bash
npm install
```

### Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di alamat: `http://localhost:5173/`

### Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di direktori `dist/`.

---

## 5. Panduan Demo & Pengujian Persona

Tersedia **Demo Role Switcher** di bagian paling atas halaman yang selalu dapat diakses untuk berpindah peran secara instan:

1. **Pembeli Demo (Ahmad Pratama)**:
   - Klik tombol **Pembeli** di bar atas atau buka `/pembeli/dashboard`.
   - Buka `/katalog`, pilih produk (misal: *Serabi Solo* atau *Kemeja Batik Laweyan*).
   - Masukkan ke keranjang, klik *Lanjut ke Checkout*, lalu tekan *Bayar Sekarang (Buka QRIS)*.
   - Klik *Simulasikan Pembayaran Berhasil* pada modal QRIS.
   - Pesanan langsung tercatat di `/pembeli/pesanan` dan muncul di dashboard penjual.

2. **Penjual Demo (Siti Rahayu — Batik Srikandi Solo)**:
   - Klik tombol **Penjual (UMKM)** di bar atas atau buka `/penjual/dashboard`.
   - Lihat pesanan masuk di `/penjual/pesanan`.
   - Klik *Konfirmasi & Proses Pesanan* lalu *Kirim Paket & Resi Otomatis*.
   - Buka `/penjual/produk/tambah` untuk menambah produk baru ke katalog publik.

3. **Admin Demo (Drs. Hendro Wibowo, M.Si — Diskop UKM Kota Surakarta)**:
   - Klik tombol **Admin Diskop** di bar atas atau buka `/admin/dashboard`.
   - Buka `/admin/verifikasi` untuk melihat pengajuan legalitas UMKM.
   - Klik tombol *Tinjau*, lalu setujui atau tolak pengajuan dengan catatan evaluasi.

4. **Reset Data Demo**:
   - Klik tombol **Reset Data** pada bar switcher atas untuk mengembalikan seluruh produk, pesanan, dan verifikasi ke kondisi awal.

---

## 6. Batasan Prototipe MVP & Rencana Tahap Selanjutnya

Prototipe ini berfokus pada validasi desain interaksi antarmuka (UI/UX) dan simulasi alur end-to-end frontend. Fitur-fitur berikut disiapkan arsitekturnya untuk dihubungkan ke backend produksi pada fase berikutnya:
- **Autentikasi Produksi**: Integrasi JWT / OAuth2 / Single Sign-On Pemkot Surakarta.
- **Payment Gateway QRIS Nyata**: Integrasi API Bank Indonesia Open API / Aggregator (Midtrans/Xendit) untuk pembuatan QR dinamis dan callback webhook rekonsiliasi riil.
- **Integrasi API OSS (NIB)**: Validasi otomatis nomor NIB 13 digit ke database Kementerian Investasi/BKPM.
- **Integrasi e-Katalog LKPP (B2G)**: Sinkronisasi etalase produk ke portal LPSE Kota Surakarta.
- **Ekspedisi Logistik Riil**: Integrasi API tarif kurir dan tracking resi (JNE, SiCepat, GoSend API).
