<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SellerOrder extends Model
{
    protected $fillable = ['order_id', 'seller_profile_id', 'subtotal', 'shipping_cost', 'status'];
    protected $casts = ['subtotal' => 'decimal:2', 'shipping_cost' => 'decimal:2'];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function seller(): BelongsTo { return $this->belongsTo(SellerProfile::class, 'seller_profile_id'); }
    public function items(): HasMany { return $this->hasMany(OrderItem::class); }
    public function shipment(): HasOne { return $this->hasOne(Shipment::class); }
}