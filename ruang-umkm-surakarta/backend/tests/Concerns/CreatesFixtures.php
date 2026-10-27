<?php

namespace Tests\Concerns;

use App\Models\Address;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Support\Str;

trait CreatesFixtures
{
    protected function makeUser(string $role = 'pembeli', array $attrs = []): User
    {
        $user = new User();
        $user->fill([
            'name' => $attrs['name'] ?? 'User '.Str::random(5),
            'email' => $attrs['email'] ?? Str::lower(Str::random(10)).'@test.local',
            'password' => 'password123',
            'phone' => '081234567890',
        ]);
        $user->forceFill(['role' => $role, 'status' => $attrs['status'] ?? 'active'])->save();

        return $user;
    }

    protected function makeSeller(array $attrs = []): SellerProfile
    {
        $user = $this->makeUser('penjual');
        $profile = new SellerProfile([
            'user_id' => $user->id,
            'business_name' => 'Usaha '.Str::random(4),
            'slug' => 'usaha-'.Str::lower(Str::random(8)),
            'owner_name' => $user->name,
            'address' => 'Jl. Test No. 1',
        ]);
        $profile->forceFill([
            'verification_status' => $attrs['verification_status'] ?? 'approved',
        ])->save();

        return $profile;
    }

    protected function makeProduct(SellerProfile $seller, array $attrs = []): Product
    {
        $product = new Product([
            'seller_profile_id' => $seller->id,
            'name' => $attrs['name'] ?? 'Produk '.Str::random(5),
            'slug' => 'produk-'.Str::lower(Str::random(8)),
            'description' => 'Deskripsi produk uji.',
            'price' => $attrs['price'] ?? 10000,
            'stock' => $attrs['stock'] ?? 10,
        ]);
        $product->forceFill([
            'status' => $attrs['status'] ?? 'published',
            'published_at' => now(),
        ])->save();

        return $product;
    }

    protected function makeAddress(User $user): Address
    {
        $address = new Address([
            'recipient_name' => $user->name,
            'phone' => '081234567890',
            'address_line' => 'Jl. Pengiriman No. 2',
            'city' => 'Surakarta',
            'province' => 'Jawa Tengah',
        ]);
        $address->user_id = $user->id;
        $address->is_default = true;
        $address->save();

        return $address;
    }
}