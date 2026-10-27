<?php

namespace Database\Seeders;

use App\Models\BusinessCategory;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * AKUN DEMO LOKAL SAJA. Jangan dijalankan di production.
 * Password semua akun demo: password123 (di-hash oleh cast 'hashed').
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            $this->command?->warn('UserSeeder dilewati di production. Set APP_ENV=local.');
            return;
        }

        $this->makeUser('Admin Demo', 'admin@ruangumkm.test', 'admin', '081200000001');

        $sellers = [
            ['Siti Aminah', 'penjual1@ruangumkm.test', 'Batik Laweyan Aminah', 'batik-laweyan-aminah', 'fashion',
             'Batik tulis dan cap khas Laweyan, Surakarta.', 'Jl. Dr. Rajiman No. 12', 'Laweyan', '1234567890123', 'Kecil', 'Bank Jateng', '1012345678', 'Siti Aminah'],
            ['Budi Santoso', 'penjual2@ruangumkm.test', 'Serabi Notosuman Budi', 'serabi-notosuman-budi', 'kuliner',
             'Serabi dan jajanan pasar tradisional Solo.', 'Jl. Notosuman No. 5', 'Banjarsari', '9876543210123', 'Mikro', 'BCA', '0151234567', 'Budi Santoso'],
            ['Rina Wulandari', 'penjual3@ruangumkm.test', 'Kriya Bambu Rina', 'kriya-bambu-rina', 'kerajinan',
             'Kerajinan anyaman bambu buatan tangan.', 'Jl. Slamet Riyadi No. 88', 'Jebres', '5678901234123', 'Mikro', 'Bank Mandiri', '1380012345678', 'Rina Wulandari'],
        ];

        foreach ($sellers as $i => [$name, $email, $biz, $slug, $cat, $desc, $addr, $district, $nib, $scale, $bankName, $bankAcc, $bankHolder]) {
            $user = $this->makeUser($name, $email, 'penjual', '08121000000'.($i + 1));

            $profile = SellerProfile::withTrashed()->firstOrNew(['user_id' => $user->id]);
            $profile->fill([
                'business_name' => $biz,
                'slug' => $slug,
                'owner_name' => $name,
                'nib' => $nib,
                'business_scale' => $scale,
                'description' => $desc,
                'business_category_id' => BusinessCategory::where('slug', $cat)->value('id'),
                'phone' => $user->phone,
                'email' => $email,
                'address' => $addr,
                'district' => $district,
                'city' => 'Surakarta',
                'province' => 'Jawa Tengah',
                'bank_name' => $bankName,
                'bank_account_number' => $bankAcc,
                'bank_account_holder' => $bankHolder,
            ]);
            $profile->forceFill([
                'verification_status' => 'approved',
                'verified_at' => now(),
                'deleted_at' => null,
            ])->save();
        }

        $buyers = [
            ['Dewi Lestari', 'pembeli1@ruangumkm.test'],
            ['Andi Prasetyo', 'pembeli2@ruangumkm.test'],
            ['Maya Sari', 'pembeli3@ruangumkm.test'],
        ];

        foreach ($buyers as $i => [$name, $email]) {
            $this->makeUser($name, $email, 'pembeli', '08131000000'.($i + 1));
        }
    }

    private function makeUser(string $name, string $email, string $role, string $phone): User
    {
        $user = User::withTrashed()->firstOrNew(['email' => $email]);
        $user->fill(['name' => $name, 'phone' => $phone, 'password' => 'password123']);
        $user->forceFill([
            'role' => $role,
            'status' => 'active',
            'email_verified_at' => now(),
            'deleted_at' => null,
        ])->save();

        return $user;
    }
}