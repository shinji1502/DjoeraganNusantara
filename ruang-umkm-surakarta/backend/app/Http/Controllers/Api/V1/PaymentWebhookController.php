<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\ActivityLogger;
use App\Services\OrderLifecycleService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentWebhookController extends Controller
{
    /**
     * Callback gateway. Diverifikasi dengan HMAC-SHA256 atas body mentah (header X-Signature).
     * Status "lunas" tidak pernah dipercaya dari frontend.
     */
    public function __invoke(Request $request, OrderLifecycleService $service)
    {
        $secret = config('umkm.payment_webhook_secret');
        if (! $secret) {
            return response()->json(['message' => 'Webhook pembayaran belum dikonfigurasi.'], 503);
        }

        $expected = hash_hmac('sha256', $request->getContent(), $secret);
        if (! hash_equals($expected, (string) $request->header('X-Signature', ''))) {
            ActivityLogger::log('payment.webhook_rejected', 'Webhook pembayaran ditolak: signature tidak valid.');

            return response()->json(['message' => 'Signature tidak valid.'], 401);
        }

        $data = $request->validate([
            'payment_reference' => ['required', 'string', 'max:100'],
            'status' => ['required', Rule::in(['paid', 'failed', 'expired'])],
            'amount' => ['required', 'numeric'],
            'provider_transaction_id' => ['nullable', 'string', 'max:100'],
        ]);

        $payment = Payment::with('order')->where('payment_reference', $data['payment_reference'])->first();
        if (! $payment) {
            return response()->json(['message' => 'Pembayaran tidak ditemukan.'], 404);
        }

        if (abs((float) $payment->amount - (float) $data['amount']) > 0.009) {
            ActivityLogger::log('payment.webhook_rejected', 'Webhook pembayaran ditolak: nominal tidak cocok.', null, $payment);

            return response()->json(['message' => 'Nominal pembayaran tidak cocok.'], 422);
        }

        if ($data['status'] === 'paid') {
            $service->markPaid($payment, null, $data['provider_transaction_id'] ?? null);
        } elseif ($payment->status === 'pending') {
            $expired = $data['status'] === 'expired';
            $service->cancel($payment->order, $expired ? 'Pembayaran kedaluwarsa.' : 'Pembayaran gagal.', null, $expired ? 'expired' : 'failed');
        }

        return response()->json(['message' => 'OK']);
    }
}