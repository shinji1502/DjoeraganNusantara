<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_number' => $this->order_number,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'subtotal' => (float) $this->subtotal,
            'shipping_cost' => (float) $this->shipping_cost,
            'discount_amount' => (float) $this->discount_amount,
            'total_amount' => (float) $this->total_amount,
            'shipping_address' => $this->shipping_address,
            'buyer_notes' => $this->buyer_notes,
            'ordered_at' => $this->ordered_at?->toIso8601String(),
            'buyer' => $this->whenLoaded('buyer', fn () => [
                'id' => $this->buyer->id,
                'name' => $this->buyer->name,
                'email' => $this->buyer->email,
            ]),
            'seller_orders' => $this->whenLoaded('sellerOrders', fn () => $this->sellerOrders->map(fn ($so) => [
                'id' => $so->id,
                'seller' => $so->relationLoaded('seller') ? $so->seller?->business_name : null,
                'status' => $so->status,
                'subtotal' => (float) $so->subtotal,
                'shipping_cost' => (float) $so->shipping_cost,
                'shipment' => $so->relationLoaded('shipment') && $so->shipment ? [
                    'courier' => $so->shipment->courier,
                    'service' => $so->shipment->service,
                    'tracking_number' => $so->shipment->tracking_number,
                    'status' => $so->shipment->status,
                    'shipped_at' => $so->shipment->shipped_at?->toIso8601String(),
                    'delivered_at' => $so->shipment->delivered_at?->toIso8601String(),
                ] : null,
            ])),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($i) => [
                'id' => $i->id,
                'seller_order_id' => $i->seller_order_id,
                'product_id' => $i->product_id,
                'name' => $i->product_name_snapshot,
                'unit_price' => (float) $i->unit_price,
                'quantity' => $i->quantity,
                'subtotal' => (float) $i->subtotal,
                'has_review' => $i->relationLoaded('review') ? $i->review !== null : null,
            ])),
            'payment' => $this->whenLoaded('payments', fn () => ($p = $this->payments->last()) ? [
                'reference' => $p->payment_reference,
                'method' => $p->payment_method,
                'status' => $p->status,
                'amount' => (float) $p->amount,
                'paid_at' => $p->paid_at?->toIso8601String(),
                'expired_at' => $p->expired_at?->toIso8601String(),
            ] : null),
        ];
    }
}