<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'order_id', 'payment_reference', 'payment_method', 'amount', 'status',
        'paid_at', 'expired_at', 'provider', 'provider_transaction_id', 'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
}