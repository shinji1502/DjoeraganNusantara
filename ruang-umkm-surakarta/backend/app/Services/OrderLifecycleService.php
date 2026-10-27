<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\SellerOrder;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderLifecycleService
{
    private const RANK = ['pending' => 0, 'confirmed' => 1, 'processing' => 2, 'shipped' => 3, 'completed' => 4];
    private const NEXT = ['pending' => 'confirmed', 'confirmed' => 'processing', 'processing' => 'shipped'];
    private const LABEL = ['confirmed' => 'dikonfirmasi penjual', 'processing' => 'sedang diproses', 'shipped' => 'sudah dikirim'];

    /**
     * Batalkan pesanan yang belum diproses penjual dan belum dibayar. Stok dikembalikan.
     * $paymentStatus: status baru untuk baris payments yang masih pending (cancelled|expired|failed).
     */
    public function cancel(Order $order, string $reason, ?User $actor = null, string $paymentStatus = 'cancelled'): Order
    {
        return DB::transaction(function () use ($order, $reason, $actor, $paymentStatus) {
            $order = Order::lockForUpdate()->findOrFail($order->id);

            if ($order->order_status === 'cancelled') {
                return $order; // idempoten
            }
            if ($order->payment_status === 'paid') {
                $this->fail('Pesanan yang sudah dibayar tidak dapat dibatalkan di sini. Hubungi admin untuk proses refund.');
            }
            if ($order->sellerOrders()->where('status', '!=', 'pending')->exists()) {
                $this->fail('Pesanan sudah diproses penjual dan tidak dapat dibatalkan.');
            }

            $items = $order->items()->get();
            $ids = $items->pluck('product_id')->filter()->unique()->sort()->values()->all();
            $products = Product::withTrashed()->whereIn('id', $ids)->orderBy('id')->lockForUpdate()->get()->keyBy('id');
            foreach ($items as $item) {
                if ($item->product_id && $products->has($item->product_id)) {
                    $products[$item->product_id]->increment('stock', $item->quantity);
                }
            }

            $order->sellerOrders()->update(['status' => 'cancelled']);
            $order->payments()->where('status', 'pending')->update(['status' => $paymentStatus]);
            $order->forceFill([
                'order_status' => 'cancelled',
                'payment_status' => 'failed',
                'cancelled_at' => now(),
            ])->save();

            ActivityLogger::log('order.cancelled', "Pesanan {$order->order_number} dibatalkan.", $actor?->id, $order, ['reason' => $reason]);

            $data = ['order_number' => $order->order_number];
            Notifier::send($order->buyer, 'order.cancelled', 'Pesanan dibatalkan', "Pesanan {$order->order_number} dibatalkan. $reason", $data);
            foreach ($order->sellerOrders()->with('seller.user')->get() as $so) {
                Notifier::send($so->seller?->user, 'order.cancelled', 'Pesanan dibatalkan', "Pesanan {$order->order_number} dibatalkan.", $data);
            }

            return $order;
        });
    }

    /** Tandai pembayaran lunas (admin atau webhook gateway). Idempoten. */
    public function markPaid(Payment $payment, ?User $actor = null, ?string $providerTxId = null): Order
    {
        return DB::transaction(function () use ($payment, $actor, $providerTxId) {
            $payment = Payment::lockForUpdate()->findOrFail($payment->id);
            $order = Order::lockForUpdate()->findOrFail($payment->order_id);

            if ($payment->status === 'paid') {
                return $order;
            }
            if ($order->order_status === 'cancelled') {
                $this->fail('Pesanan sudah dibatalkan, pembayaran tidak dapat diterima.');
            }
            if ($payment->status !== 'pending') {
                $this->fail('Pembayaran tidak dalam status menunggu.');
            }

            $payment->update([
                'status' => 'paid',
                'paid_at' => now(),
                'provider_transaction_id' => $providerTxId ?? $payment->provider_transaction_id,
            ]);
            $order->forceFill(['payment_status' => 'paid'])->save();

            ActivityLogger::log('payment.paid', "Pembayaran pesanan {$order->order_number} diterima.", $actor?->id, $order, [
                'amount' => (float) $payment->amount,
                'via' => $actor ? 'admin' : 'webhook',
            ]);

            $data = ['order_number' => $order->order_number];
            Notifier::send($order->buyer, 'payment.paid', 'Pembayaran diterima', "Pembayaran pesanan {$order->order_number} telah diterima.", $data);
            foreach ($order->sellerOrders()->with('seller.user')->get() as $so) {
                Notifier::send($so->seller?->user, 'payment.paid', 'Pesanan sudah dibayar', "Pesanan {$order->order_number} sudah dibayar. Silakan konfirmasi.", $data);
            }

            return $order;
        });
    }

    /** Penjual memajukan status sub-pesanan satu langkah: pending → confirmed → processing → shipped. */
    public function advance(SellerOrder $sellerOrder, string $to, array $shipping, User $actor): SellerOrder
    {
        return DB::transaction(function () use ($sellerOrder, $to, $shipping, $actor) {
            $so = SellerOrder::lockForUpdate()->findOrFail($sellerOrder->id);
            $order = Order::lockForUpdate()->findOrFail($so->order_id);

            if ((self::NEXT[$so->status] ?? null) !== $to) {
                $this->fail("Status pesanan tidak dapat diubah dari {$so->status} ke {$to}.");
            }
            if ($to === 'confirmed' && ! $this->isPaidOrCod($order)) {
                $this->fail('Pesanan belum dibayar pembeli.');
            }

            if ($to === 'shipped') {
                Shipment::create([
                    'order_id' => $order->id,
                    'seller_order_id' => $so->id,
                    'courier' => $shipping['courier'],
                    'service' => $shipping['service'] ?? null,
                    'tracking_number' => $shipping['tracking_number'] ?? null,
                    'shipping_cost' => $so->shipping_cost,
                    'status' => 'shipped',
                    'shipped_at' => now(),
                    'notes' => $shipping['notes'] ?? null,
                ]);
            }

            $so->update(['status' => $to]);
            $this->syncOrderStatus($order);

            ActivityLogger::log('order.status_changed', "Sub-pesanan #{$so->id} menjadi {$to}.", $actor->id, $order, [
                'seller_order_id' => $so->id, 'to' => $to,
            ]);
            Notifier::send(
                $order->buyer,
                'order.status',
                'Status pesanan diperbarui',
                "Pesanan {$order->order_number} dari {$so->seller?->business_name} ".self::LABEL[$to].'.',
                ['order_number' => $order->order_number, 'status' => $to]
            );

            return $so->fresh();
        });
    }

    /** Pembeli mengonfirmasi barang diterima untuk satu sub-pesanan. */
    public function receive(SellerOrder $sellerOrder, User $buyer): Order
    {
        return DB::transaction(function () use ($sellerOrder, $buyer) {
            $so = SellerOrder::lockForUpdate()->findOrFail($sellerOrder->id);
            $order = Order::lockForUpdate()->findOrFail($so->order_id);

            abort_unless((int) $order->buyer_id === (int) $buyer->id, 404);

            if ($so->status !== 'shipped') {
                $this->fail('Pesanan belum dikirim oleh penjual.');
            }

            $so->update(['status' => 'completed']);
            Shipment::where('seller_order_id', $so->id)->update(['status' => 'delivered', 'delivered_at' => now()]);
            $this->syncOrderStatus($order);

            if ($order->order_status === 'completed') {
                $this->settleCod($order);
            }

            ActivityLogger::log('order.received', "Sub-pesanan #{$so->id} diterima pembeli.", $buyer->id, $order, ['seller_order_id' => $so->id]);
            Notifier::send(
                $so->seller?->user,
                'order.received',
                'Pesanan diterima pembeli',
                "Pesanan {$order->order_number} telah diterima pembeli.",
                ['order_number' => $order->order_number]
            );

            return $order->fresh();
        });
    }

    private function isPaidOrCod(Order $order): bool
    {
        return $order->payment_status === 'paid'
            || $order->payments()->latest('id')->value('payment_method') === 'cod';
    }

    private function settleCod(Order $order): void
    {
        $payment = $order->payments()->latest('id')->first();
        if ($payment && $payment->payment_method === 'cod' && $payment->status === 'pending') {
            $payment->update(['status' => 'paid', 'paid_at' => now()]);
            $order->forceFill(['payment_status' => 'paid'])->save();
        }
    }

    /** Status pesanan induk = tahap paling lambat di antara sub-pesanan yang tidak dibatalkan. */
    private function syncOrderStatus(Order $order): void
    {
        $statuses = $order->sellerOrders()->where('status', '!=', 'cancelled')->pluck('status');

        if ($statuses->isEmpty()) {
            $new = 'cancelled';
        } else {
            $min = $statuses->map(fn ($s) => self::RANK[$s])->min();
            $new = array_search($min, self::RANK);
        }

        $data = ['order_status' => $new];
        if ($new === 'completed') {
            $data['completed_at'] = now();
        }
        $order->forceFill($data)->save();
    }

    private function fail(string $message): never
    {
        throw ValidationException::withMessages(['order' => [$message]]);
    }
}