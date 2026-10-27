<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'title' => 'Solo Great Sale Expo 2026 & Pameran Karya UMKM Unggulan',
                'category' => 'Pameran',
                'event_date' => '2026-11-01',
                'end_date' => '2026-11-03',
                'time' => '10:00 - 21:00 WIB',
                'location' => 'Atrium Solo Paragon Mall & Koridor Ngarsopuro',
                'organizer' => 'Diskop UKM Kota Surakarta & Kadin Solo',
                'status' => 'Mendatang',
                'image' => 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=800&q=80',
                'description' => 'Pameran akbar 150+ UMKM terkurasi Kota Solo menghadirkan produk batik istimewa, kuliner khas, kriya tembaga, dan inovasi kriya anak muda.',
                'quota' => 150,
            ],
            [
                'title' => 'Bazzar UMKM Car Free Day Slamet Riyadi',
                'category' => 'Bazzar',
                'event_date' => '2026-11-01',
                'end_date' => '2026-11-01',
                'time' => '06:00 - 09:30 WIB',
                'location' => 'Jl. Slamet Riyadi (Zona Khusus UMKM Gladag)',
                'organizer' => 'Paguyuban UMKM Surakarta',
                'status' => 'Berlangsung',
                'image' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
                'description' => 'Etalase langsung produk kuliner hangat, jajanan pasar tradisional, dan merchandise kreatif Solo menyapa puluhan ribu pengunjung CFD.',
                'quota' => 80,
            ],
            [
                'title' => 'Business Matching B2B: UMKM x Jaringan Perhotelan & Resto Soloraya',
                'category' => 'Business Matching',
                'event_date' => '2026-11-18',
                'end_date' => '2026-11-18',
                'time' => '13:00 - 17:00 WIB',
                'location' => 'Ballroom Hotel Royal Surakarta Heritage',
                'organizer' => 'PHRI Surakarta & Ruang UMKM Platform',
                'status' => 'Mendatang',
                'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                'description' => 'Pertemuan langsung antara 40 produsen kuliner, amenitas, dan seragam batik dengan 35 General Manager hotel & restoran se-Soloraya.',
                'quota' => 50,
            ],
        ];

        foreach ($events as $item) {
            $slug = Str::slug($item['title']);
            $event = Event::withTrashed()->firstOrNew(['slug' => $slug]);
            $event->fill($item);
            $event->deleted_at = null;
            $event->save();
        }
    }
}
