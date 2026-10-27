<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    // Seluruh nilai order dihitung backend, bukan dari request.
    protected $fillable = [
        'order_number', 'buyer_id', 'shipping_address', 'subtotal', 'shipping_cost',
        'discount_amount', 'total_amount', 'payment_status', 'order_status',
        'buyer_notes', 'ordered_at',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'ordered_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function buyer(): BelongsTo { return $this->belongsTo(User::class, 'buyer_id'); }
    public function sellerOrders(): HasMany { return $this->hasMany(SellerOrder::class); }
    public function items(): HasMany { return $this->hasMany(OrderItem::class); }
    public function payments(): HasMany { return $this->hasMany(Payment::class); }
    public function shipments(): HasMany { return $this->hasMany(Shipment::class); }
}