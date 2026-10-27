<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellerOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $order = $this->relationLoaded('order') ? $this->order : null;

        return [
            'id' => $this->id,
            'order_number' => $order?->order_number,
            'status' => $this->status,
            'payment_status' => $order?->payment_status,
            'subtotal' => (float) $this->subtotal,
            'shipping_cost' => (float) $this->shipping_cost,
            'ordered_at' => $order?->ordered_at?->toIso8601String(),
            'shipping_address' => $order?->shipping_address,
            'buyer_notes' => $order?->buyer_notes,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($i) => [
                'name' => $i->product_name_snapshot,
                'unit_price' => (float) $i->unit_price,
                'quantity' => $i->quantity,
                'subtotal' => (float) $i->subtotal,
            ])),
            'shipment' => $this->whenLoaded('shipment', fn () => $this->shipment ? [
                'courier' => $this->shipment->courier,
                'service' => $this->shipment->service,
                'tracking_number' => $this->shipment->tracking_number,
                'status' => $this->shipment->status,
                'shipped_at' => $this->shipment->shipped_at?->toIso8601String(),
                'delivered_at' => $this->shipment->delivered_at?->toIso8601String(),
            ] : null),
        ];
    }
}