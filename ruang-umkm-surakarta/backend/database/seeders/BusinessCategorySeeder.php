<?php

namespace Database\Seeders;

use App\Models\BusinessCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BusinessCategorySeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Kuliner', 'Fashion', 'Kerajinan', 'Kecantikan', 'Pertanian', 'Jasa', 'Produk Kreatif', 'Lainnya'];

        foreach ($names as $name) {
            BusinessCategory::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true]
            );
        }
    }
}