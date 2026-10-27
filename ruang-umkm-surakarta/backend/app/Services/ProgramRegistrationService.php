<?php

namespace App\Services;

use App\Models\Program;
use App\Models\ProgramRegistration;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProgramRegistrationService
{
    public function register(User $user, int $programId): ProgramRegistration
    {
        return DB::transaction(function () use ($user, $programId) {
            // Kunci baris program agar hitungan kuota konsisten saat pendaftaran bersamaan.
            $program = Program::lockForUpdate()->find($programId);

            if (! $program || $program->status !== 'published') {
                $this->fail('Program tidak tersedia untuk pendaftaran.');
            }

            $today = now()->startOfDay();
            if ($program->registration_start && $today->lt($program->registration_start)) {
                $this->fail('Pendaftaran belum dibuka.');
            }
            if ($program->registration_end && $today->gt($program->registration_end)) {
                $this->fail('Pendaftaran sudah ditutup.');
            }

            if (ProgramRegistration::where('program_id', $program->id)->where('user_id', $user->id)->exists()) {
                $this->fail('Anda sudah terdaftar pada program ini.');
            }

            if ($program->quota !== null) {
                $taken = ProgramRegistration::where('program_id', $program->id)
                    ->whereIn('status', ['pending', 'approved', 'completed'])
                    ->count();
                if ($taken >= $program->quota) {
                    $this->fail('Kuota program sudah penuh.');
                }
            }

            return ProgramRegistration::create([
                'program_id' => $program->id,
                'user_id' => $user->id,
                'registration_number' => 'REG-'.now()->format('Ymd').'-'.strtoupper(Str::random(6)),
                'status' => 'pending',
                'registered_at' => now(),
            ]);
        });
    }

    private function fail(string $message): never
    {
        throw ValidationException::withMessages(['program' => [$message]]);
    }
}