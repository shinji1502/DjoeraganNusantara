<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\ProgramRegistration;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@ruangumkm.test')->first();
        if (! $admin) {
            return;
        }

        $programs = [
            ['pelatihan-digital-marketing-umkm', 'Pelatihan Digital Marketing UMKM', 'Dinas Koperasi dan UMKM Surakarta', 'Balai Kota Surakarta', 30, 60],
            ['pendampingan-legalitas-usaha', 'Pendampingan Legalitas Usaha (NIB & PIRT)', 'Dinas Koperasi dan UMKM Surakarta', 'Solo Technopark', 50, 90],
        ];

        $peserta = User::where('email', 'penjual1@ruangumkm.test')->first();

        foreach ($programs as [$slug, $title, $organizer, $location, $quota, $startOffset]) {
            $program = Program::withTrashed()->updateOrCreate(['slug' => $slug], [
                'title' => $title,
                'description' => "$title untuk pelaku UMKM di Kota Surakarta.",
                'organizer' => $organizer,
                'location' => $location,
                'start_date' => now()->addDays($startOffset)->toDateString(),
                'end_date' => now()->addDays($startOffset + 2)->toDateString(),
                'registration_start' => now()->toDateString(),
                'registration_end' => now()->addDays($startOffset - 7)->toDateString(),
                'quota' => $quota,
                'status' => 'published',
                'created_by' => $admin->id,
                'deleted_at' => null,
            ]);

            if ($peserta) {
                ProgramRegistration::firstOrCreate(
                    ['program_id' => $program->id, 'user_id' => $peserta->id],
                    [
                        'registration_number' => 'REG-'.strtoupper(substr(md5($slug.$peserta->id), 0, 8)),
                        'status' => 'approved',
                        'registered_at' => now(),
                    ]
                );
            }
        }
    }
}