<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\SellerOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /** Ongkir flat per penjual (sementara, sampai ada integrasi kurir). */
    private const FLAT_SHIPPING = 10000;

    /**
     * @param array<int, array{product_id:int, quantity:int}> $items
     */
    public function create(User $buyer, Address $address, array $items, string $paymentMethod, ?string $notes = null): Order
    {
        // Gabungkan item duplikat, urutkan id agar urutan lock konsisten (cegah deadlock).
        $qtyById = [];
        foreach ($items as $item) {
            $id = (int) $item['product_id'];
            $qtyById[$id] = ($qtyById[$id] ?? 0) + (int) $item['quantity'];
        }
        ksort($qtyById);

        return DB::transaction(function () use ($buyer, $address, $qtyById, $paymentMethod, $notes) {
            // Kunci baris produk sampai transaksi selesai.
            $products = Product::whereIn('id', array_keys($qtyById))
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');
            $products->load('seller');

            $errors = [];
            foreach ($qtyById as $id => $qty) {
                $p = $products->get($id);

                if (! $p || $p->status !== 'published' || ! $p->seller || $p->seller->verification_status !== 'approved') {
                    $errors[] = "Produk #$id tidak tersedia.";
                } elseif ($p->seller->user_id === $buyer->id) {
                    $errors[] = "Anda tidak dapat membeli produk sendiri ({$p->name}).";
                } elseif ($p->stock < $qty) {
                    $errors[] = "Stok {$p->name} tidak mencukupi (tersisa {$p->stock}).";
                }
            }
            if ($errors) {
                throw ValidationException::withMessages(['items' => $errors]);
            }

            // Kelompokkan per penjual.
            $bySeller = [];
            foreach ($qtyById as $id => $qty) {
                $p = $products[$id];
                $bySeller[$p->seller_profile_id][] = [$p, $qty];
            }

            $subtotal = 0.0;
            $shipping = 0.0;
            $sellerTotals = [];
            foreach ($bySeller as $sellerId => $lines) {
                $sub = 0.0;
                foreach ($lines as [$p, $qty]) {
                    $sub += round((float) $p->price * $qty, 2);
                }
                $sellerTotals[$sellerId] = $sub;
                $subtotal += $sub;
                $shipping += self::FLAT_SHIPPING;
            }
            $discount = 0.0;
            $total = round($subtotal + $shipping - $discount, 2);

            $order = new Order([
                'order_number' => $this->newOrderNumber(),
                'buyer_id' => $buyer->id,
                'shipping_address' => $address->only([
                    'recipient_name', 'phone', 'address_line', 'village', 'district',
                    'city', 'province', 'postal_code', 'notes',
                ]),
                'subtotal' => $subtotal,
                'shipping_cost' => $shipping,
                'discount_amount' => $discount,
                'total_amount' => $total,
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'buyer_notes' => $notes,
                'ordered_at' => now(),
            ]);
            $order->save();

            foreach ($bySeller as $sellerId => $lines) {
                $sellerOrder = SellerOrder::create([
                    'order_id' => $order->id,
                    'seller_profile_id' => $sellerId,
                    'subtotal' => $sellerTotals[$sellerId],
                    'shipping_cost' => self::FLAT_SHIPPING,
                    'status' => 'pending',
                ]);

                foreach ($lines as [$p, $qty]) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'seller_order_id' => $sellerOrder->id,
                        'product_id' => $p->id,
                        'seller_profile_id' => $sellerId,
                        'product_name_snapshot' => $p->name,
                        'product_sku_snapshot' => $p->sku,
                        'unit_price' => $p->price,
                        'quantity' => $qty,
                        'subtotal' => round((float) $p->price * $qty, 2),
                    ]);

                    $p->decrement('stock', $qty);
                }
            }

            Payment::create([
                'order_id' => $order->id,
                'payment_reference' => 'PAY-'.$order->order_number,
                'payment_method' => $paymentMethod,
                'amount' => $total,
                'status' => 'pending',
                'expired_at' => now()->addDay(),
            ]);

            return $order->load(['sellerOrders.seller', 'items', 'payments']);
        });
    }

    private function newOrderNumber(): string
    {
        do {
            $number = 'ORD-'.now()->format('Ymd').'-'.strtoupper(Str::random(6));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}