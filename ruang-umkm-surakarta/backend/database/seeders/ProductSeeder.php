<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\SellerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'batik-laweyan-aminah' => [
                ['Kain Batik Tulis Sidomukti', 450000, 500000, 20, 'lembar', ['Batik Mark Solo', 'SNI'], 'Laweyan'],
                ['Kemeja Batik Cap Parang', 235000, 275000, 35, 'pcs', ['Batik Mark Solo'], 'Laweyan'],
            ],
            'serabi-notosuman-budi' => [
                ['Serabi Solo Original (isi 10)', 25000, 30000, 100, 'box', ['Halal MUI', 'P-IRT'], 'Banjarsari'],
                ['Intip Goreng Renyah', 18000, 20000, 80, 'bungkus', ['Halal MUI', 'P-IRT'], 'Banjarsari'],
            ],
            'kriya-bambu-rina' => [
                ['Keranjang Anyaman Bambu', 85000, 100000, 40, 'pcs', ['SNI'], 'Jebres'],
                ['Tempat Tisu Bambu', 45000, 55000, 60, 'pcs', ['SNI'], 'Jebres'],
            ],
        ];

        foreach ($data as $sellerSlug => $items) {
            $seller = SellerProfile::where('slug', $sellerSlug)->first();
            if (! $seller) {
                continue;
            }

            foreach ($items as [$name, $price, $origPrice, $stock, $unit, $certs, $district]) {
                $product = Product::withTrashed()->firstOrNew(['slug' => Str::slug($name)]);
                $product->fill([
                    'seller_profile_id' => $seller->id,
                    'business_category_id' => $seller->business_category_id,
                    'name' => $name,
                    'description' => "$name dari {$seller->business_name}, UMKM Surakarta.",
                    'price' => $price,
                    'original_price' => $origPrice,
                    'stock' => $stock,
                    'unit' => $unit,
                    'certifications' => $certs,
                    'district' => $district,
                ]);
                $product->forceFill([
                    'status' => 'published',
                    'published_at' => $product->published_at ?? now(),
                    'deleted_at' => null,
                ])->save();
            }
        }
    }
}