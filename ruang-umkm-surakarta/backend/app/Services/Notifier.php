<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\AppNotification;
use Throwable;

class Notifier
{
    /**
     * Kegagalan notifikasi tidak boleh menggagalkan proses utama di production,
     * tetapi saat tes error dilempar supaya tidak tersembunyi.
     */
    public static function send(?User $user, string $type, string $title, string $message, array $data = []): void
    {
        if (! $user) {
            return;
        }

        try {
            $user->notify(new AppNotification($type, $title, $message, $data));
        } catch (Throwable $e) {
            if (app()->environment('testing')) {
                throw $e;
            }

            report($e);
        }
    }
}