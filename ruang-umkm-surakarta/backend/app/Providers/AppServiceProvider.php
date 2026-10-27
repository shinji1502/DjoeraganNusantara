<?php

namespace App\Providers;

use App\Models\Product;
use App\Models\Program;
use App\Models\ProgramRegistration;
use App\Models\SellerOrder;
use App\Models\SellerProfile;
use App\Models\User;
use App\Services\Notifier;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        User::updated(function (User $user) {
            if (! $user->wasChanged('status')) {
                return;
            }
            $label = [
                'active' => 'diaktifkan',
                'suspended' => 'ditangguhkan',
                'rejected' => 'ditolak',
                'pending' => 'menunggu persetujuan',
            ][$user->status] ?? $user->status;

            Notifier::send($user, 'account.status', 'Status akun diperbarui', "Akun Anda $label.");
        });

        SellerProfile::updated(function (SellerProfile $profile) {
            if (! $profile->wasChanged('verification_status')) {
                return;
            }
            $messages = [
                'approved' => 'Selamat, usaha Anda telah terverifikasi.',
                'rejected' => 'Verifikasi usaha Anda ditolak. '.$profile->rejection_reason,
                'revision_required' => 'Verifikasi usaha memerlukan perbaikan. '.$profile->rejection_reason,
            ];
            if (isset($messages[$profile->verification_status])) {
                Notifier::send(
                    $profile->user,
                    'seller.verification',
                    'Hasil verifikasi usaha',
                    trim($messages[$profile->verification_status]),
                    ['status' => $profile->verification_status]
                );
            }
        });

        SellerOrder::created(function (SellerOrder $so) {
            $number = $so->order?->order_number;
            Notifier::send($so->seller?->user, 'order.new', 'Pesanan baru', "Pesanan $number menunggu konfirmasi Anda.", ['order_number' => $number]);
        });

        Product::updated(function (Product $product) {
            if ($product->wasChanged('status') && in_array($product->status, ['published', 'rejected'], true)) {
                $text = $product->status === 'published' ? 'telah tayang di katalog' : 'ditolak moderator';
                Notifier::send($product->seller?->user, 'product.moderated', 'Hasil moderasi produk', "Produk \"{$product->name}\" $text.", ['slug' => $product->slug]);
            }
        });

        ProgramRegistration::updated(function (ProgramRegistration $reg) {
            if (! $reg->wasChanged('status')) {
                return;
            }
            $text = [
                'approved' => 'disetujui',
                'rejected' => 'ditolak',
                'completed' => 'dinyatakan selesai',
            ][$reg->status] ?? null;

            if ($text) {
                Notifier::send($reg->user, 'program.registration', 'Hasil pendaftaran program', "Pendaftaran Anda pada program \"{$reg->program?->title}\" $text.", [
                    'registration_number' => $reg->registration_number,
                    'status' => $reg->status,
                ]);
            }
        });

        Program::created(function (Program $program) {
            if ($program->status === 'published') {
                self::announceProgram($program);
            }
        });
        Program::updated(function (Program $program) {
            if ($program->wasChanged('status') && $program->status === 'published') {
                self::announceProgram($program);
            }
        });
    }

    private static function announceProgram(Program $program): void
    {
        User::where('status', 'active')->where('role', '!=', 'admin')->chunkById(200, function ($users) use ($program) {
            foreach ($users as $user) {
                Notifier::send($user, 'program.new', 'Program baru', "Program \"{$program->title}\" dibuka.", ['slug' => $program->slug]);
            }
        });
    }
}