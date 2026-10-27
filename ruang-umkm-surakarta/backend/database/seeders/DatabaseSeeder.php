<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            BusinessCategorySeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            ProgramSeeder::class,
            EventSeeder::class,
            ComplaintSeeder::class,
        ]);
    }
}