<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    // user_id diisi backend dari user yang login, bukan dari input.
    protected $fillable = [
        'recipient_name', 'phone', 'address_line', 'village', 'district',
        'city', 'province', 'postal_code', 'notes', 'is_default',
    ];
    protected $casts = ['is_default' => 'boolean'];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}