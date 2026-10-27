<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipment extends Model
{
    protected $fillable = [
        'order_id', 'seller_order_id', 'courier', 'service', 'tracking_number',
        'shipping_cost', 'status', 'shipped_at', 'delivered_at', 'notes',
    ];

    protected $casts = [
        'shipping_cost' => 'decimal:2',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function sellerOrder(): BelongsTo { return $this->belongsTo(SellerOrder::class); }
}