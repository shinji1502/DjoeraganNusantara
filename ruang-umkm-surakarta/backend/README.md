# Ruang UMKM Surakarta, Backend API

Backend REST API (Laravel + MySQL) untuk platform Ruang UMKM Surakarta. Frontend: React + TypeScript + Vite di folder induk.

## Prasyarat
- PHP 8.2+ (XAMPP), Composer, MySQL/MariaDB (XAMPP), Node.js (untuk frontend)

## Instalasi
```powershell
cd D:\ruang-umkm-surakarta\backend
composer install
copy .env.example .env
php artisan key:generate
```

## Membuat database
phpMyAdmin → tab SQL:
```sql
CREATE DATABASE IF NOT EXISTS ruang_umkm_surakarta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS ruang_umkm_surakarta_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Konfigurasi `.env`
```
APP_ENV=local
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ruang_umkm_surakarta
DB_USERNAME=root
DB_PASSWORD=
```
Sesuaikan `DB_PASSWORD` dengan MySQL Anda. Jangan commit `.env`.

## Migration dan seeding
```powershell
php artisan migrate
php artisan db:seed
```
Seeder idempotent (aman dijalankan berulang). Jangan gunakan `migrate:fresh` atau `db:wipe` pada database berisi data.

## Menjalankan
```powershell
php artisan serve
```
API: `http://127.0.0.1:8000/api/v1`

## Akun demo (khusus lokal)
Password semua akun: `password123`. Seeder akun melewati `APP_ENV=production`.

| Role | Email |
|---|---|
| Admin | admin@ruangumkm.test |
| Penjual | penjual1@ruangumkm.test s/d penjual3@ruangumkm.test |
| Pembeli | pembeli1@ruangumkm.test s/d pembeli3@ruangumkm.test |

## Tabel dan fungsi
| Tabel | Fungsi |
|---|---|
| users | Semua akun (role: admin/penjual/pembeli; status: pending/active/suspended/rejected) |
| business_categories | Kategori bidang usaha |
| seller_profiles | Profil usaha penjual (1 per penjual) + status verifikasi |
| products, product_images | Produk dan galeri gambar (path file, bukan binary) |
| addresses | Alamat pengiriman pembeli |
| orders | Pesanan induk (alamat disimpan sebagai snapshot JSON) |
| seller_orders | Sub-pesanan per penjual (pesanan multi-penjual) |
| order_items | Item pesanan dengan snapshot nama, SKU, harga |
| payments | Catatan pembayaran (tanpa data kartu) |
| shipments | Pengiriman per sub-pesanan |
| reviews | Ulasan produk (rating 1-5, satu per order item) |
| programs, program_registrations | Program pemberdayaan dan pendaftarannya |
| verifications | Dokumen verifikasi usaha (simpan di storage privat) |
| notifications | Notifikasi database Laravel |
| activity_logs | Audit log append-only |

## Relasi utama
- User 1-1 SellerProfile; SellerProfile 1-N Product; Product 1-N ProductImage dan Review
- User (pembeli) 1-N Address dan Order
- Order 1-N SellerOrder 1-N OrderItem; Order 1-N Payment; SellerOrder 1-1 Shipment
- Program 1-N ProgramRegistration; User 1-N ProgramRegistration
- SellerProfile 1-N Verification; User 1-N ActivityLog

Aturan hapus: data transaksi (orders, payments, order_items, program_registrations) memakai RESTRICT; produk, program, user, dan profil penjual memakai soft delete.

## Endpoint (`/api/v1`)
- **Auth:** POST auth/register, auth/login, auth/logout; GET auth/me
- **Publik:** GET categories, products, products/{slug}, programs, programs/{slug}
- **Program:** POST programs/{id}/register (penjual/pembeli)
- **Penjual:** GET/PUT seller/profile; GET/POST seller/products; PUT/DELETE seller/products/{id}
- **Pembeli:** GET/POST addresses; GET/POST orders; GET orders/{orderNumber}
- **Admin:** GET admin/dashboard, users, sellers, products, orders, programs, activity-logs; PATCH admin/users/{id}/status, admin/sellers/{id}/verification, admin/products/{id}/moderation; POST/PUT admin/programs

Autentikasi memakai token Sanctum: kirim header `Authorization: Bearer <token>` dan `Accept: application/json`.

## Menguji API (PowerShell)
```powershell
$base = "http://127.0.0.1:8000/api/v1"; $json = @{Accept="application/json"}
$r = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" -Headers $json -Body (@{email="pembeli1@ruangumkm.test";password="password123"} | ConvertTo-Json)
$h = @{Accept="application/json"; Authorization="Bearer $($r.data.token)"}
Invoke-RestMethod -Uri "$base/auth/me" -Headers $h
```
Gunakan `Invoke-RestMethod`, karena `curl.exe` merusak tanda kutip JSON di PowerShell.

## Tes otomatis
```powershell
php artisan test
```
Tes memakai database terpisah `ruang_umkm_surakarta_test` (diatur di `phpunit.xml`), sehingga data development aman. Cakupan: integritas database, auth, hak akses, produk penjual, checkout (stok, harga, atomik), program (kuota), dan area admin.

## Catatan keamanan
- Password di-hash (bcrypt). Role, status, dan status verifikasi tidak bisa diisi lewat request (mass assignment dibatasi).
- Harga, ongkir, total, stok, dan status pembayaran selalu dihitung backend. Checkout memakai transaksi DB dan `lockForUpdate`.
- Kepemilikan data dicek: penjual hanya produknya sendiri (Policy), pembeli hanya pesanannya sendiri (404 untuk milik orang lain).
- Produk baru hanya tayang setelah moderasi admin. Penjual hanya bisa memakai status draft/pending/archived.
- Rate limiting pada login, register, checkout, dan pendaftaran program.
- Activity log append-only dan hanya bisa dibaca admin; password dan token tidak dicatat.
- Dokumen verifikasi wajib disimpan di disk privat dan diakses lewat endpoint terotorisasi.
- Production: `APP_ENV=production`, `APP_DEBUG=false`, ganti seluruh kredensial, jangan jalankan UserSeeder, batasi CORS ke domain frontend, dan gunakan HTTPS.

## Siklus pesanan
1. Pembeli `POST /orders` → status `pending`, stok berkurang, pembayaran `pending` (batas 24 jam).
2. Pembayaran lunas lewat salah satu jalur: admin `PATCH /admin/orders/{no}/payment` (transfer manual) atau webhook `POST /payments/webhook` (HMAC-SHA256 pada header `X-Signature`, rahasia di `PAYMENT_WEBHOOK_SECRET`). Status lunas tidak pernah dipercaya dari frontend.
3. Penjual `PATCH /seller/orders/{id}/status`: `confirmed` → `processing` → `shipped` (butuh `courier`). COD boleh dikonfirmasi tanpa bayar.
4. Pembeli `POST /orders/{no}/seller-orders/{id}/received` → `completed` (COD otomatis lunas). Status pesanan induk mengikuti sub-pesanan paling lambat.
5. Pembatalan `POST /orders/{no}/cancel` hanya sebelum dibayar dan sebelum diproses penjual; stok dikembalikan. Pesanan yang sudah dibayar perlu refund manual oleh admin.
6. Pesanan non-COD yang kedaluwarsa dibatalkan otomatis oleh `php artisan orders:expire-unpaid` (terjadwal tiap 15 menit). Development: `php artisan schedule:work`. Production: cron `* * * * * php artisan schedule:run`.

## Berkas
- Gambar produk, logo, banner → disk `public` (`php artisan storage:link`). JPG/PNG/WebP, maks 2 MB; SVG ditolak; maks 8 gambar per produk.
- Dokumen verifikasi → disk privat `local` (`storage/app/private`), hanya diunduh admin lewat `GET /admin/verifications/{id}/document` dan tercatat di audit log.

## Endpoint tambahan
Auth: PUT auth/profile, PUT auth/password · Notifikasi: GET notifications, POST notifications/{id}/read, POST notifications/read-all · Pembeli: PUT/DELETE addresses/{id}, POST orders/{no}/cancel, POST orders/{no}/seller-orders/{id}/received, POST reviews · Penjual: GET seller/orders, GET seller/orders/{id}, PATCH seller/orders/{id}/status, POST seller/profile/{logo|banner}, POST/DELETE/PATCH seller/products/{id}/images, GET/POST seller/verifications · Program: GET program-registrations, POST program-registrations/{id}/cancel · Publik: GET products/{slug}/reviews · Admin: PATCH admin/orders/{no}/payment, GET admin/programs/{id}/registrations, PATCH admin/program-registrations/{id}, GET admin/sellers/{id}/verifications.