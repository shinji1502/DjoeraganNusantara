<?php

namespace Database\Seeders;

use App\Models\Complaint;
use App\Models\User;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        $complaints = [
            [
                'ticket_number' => 'TKT-2026-0042',
                'complainant_name' => 'Rina Kusumaningrum',
                'user_role' => 'pembeli',
                'subject' => 'Keterlambatan Kurir Paket Abon Mesran',
                'message' => 'Paket belum sampai padahal estimasi kemarin sore. Mohon bantuan konfirmasi nomor resi ke kurir SiCepat.',
                'priority' => 'sedang',
                'status' => 'dalam_penanganan',
                'sla_hours_left' => 14,
            ],
            [
                'ticket_number' => 'TKT-2026-0039',
                'complainant_name' => 'Kriya Ukir Tembaga Surakarta',
                'user_role' => 'penjual',
                'subject' => 'Panduan Unggah Bukti NIB untuk Legalitas',
                'message' => 'Bagaimana cara menambahkan lampiran izin edar P-IRT tambahan setelah akun disetujui?',
                'priority' => 'rendah',
                'status' => 'selesai',
                'sla_hours_left' => 0,
                'resolution_notes' => 'Petunjuk panduan unggah berkas telah dikirimkan via WhatsApp dan email resmi.',
            ],
        ];

        $admin = User::where('role', 'admin')->first();

        foreach ($complaints as $item) {
            $complaint = Complaint::withTrashed()->firstOrNew(['ticket_number' => $item['ticket_number']]);
            $complaint->fill($item);
            if ($item['status'] === 'selesai' && $admin) {
                $complaint->resolved_by = $admin->id;
                $complaint->resolved_at = now();
            }
            $complaint->deleted_at = null;
            $complaint->save();
        }
    }
}
