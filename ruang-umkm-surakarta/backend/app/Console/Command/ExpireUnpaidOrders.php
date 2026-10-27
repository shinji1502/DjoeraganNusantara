<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Services\OrderLifecycleService;
use Illuminate\Console\Command;
use Illuminate\Validation\ValidationException;

class ExpireUnpaidOrders extends Command
{
    protected $signature = 'orders:expire-unpaid';
    protected $description = 'Batalkan pesanan non-COD yang batas waktu pembayarannya lewat dan kembalikan stok.';

    public function handle(OrderLifecycleService $service): int
    {
        $count = 0;

        Payment::with('order')
            ->where('status', 'pending')
            ->where('payment_method', '!=', 'cod')
            ->whereNotNull('expired_at')
            ->where('expired_at', '<', now())
            ->chunkById(100, function ($payments) use ($service, &$count) {
                foreach ($payments as $payment) {
                    try {
                        $service->cancel($payment->order, 'Batas waktu pembayaran habis.', null, 'expired');
                        $count++;
                    } catch (ValidationException) {
                        // sudah diproses oleh proses lain, lewati
                    }
                }
            });

        $this->info("$count pesanan dibatalkan.");

        return self::SUCCESS;
    }
}