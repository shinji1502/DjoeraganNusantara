<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id', 'seller_order_id', 'product_id', 'seller_profile_id',
        'product_name_snapshot', 'product_sku_snapshot', 'unit_price', 'quantity', 'subtotal',
    ];
    protected $casts = ['unit_price' => 'decimal:2', 'subtotal' => 'decimal:2', 'quantity' => 'integer'];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function sellerOrder(): BelongsTo { return $this->belongsTo(SellerOrder::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class)->withTrashed(); }
    public function seller(): BelongsTo { return $this->belongsTo(SellerProfile::class, 'seller_profile_id'); }
    public function review(): HasOne { return $this->hasOne(Review::class); }
}