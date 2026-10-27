<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SellerProfile extends Model
{
    use SoftDeletes;

    // verification_status & verified_* tidak fillable: hanya diubah admin lewat backend.
    protected $fillable = [
        'user_id', 'business_name', 'slug', 'owner_name', 'nib', 'business_scale', 'description',
        'business_category_id', 'phone', 'email', 'address', 'village', 'district', 'city', 'province',
        'postal_code', 'latitude', 'longitude', 'logo', 'banner', 'bank_name', 'bank_account_number', 'bank_account_holder',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'verified_at' => 'datetime',
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function category(): BelongsTo { return $this->belongsTo(BusinessCategory::class, 'business_category_id'); }
    public function verifier(): BelongsTo { return $this->belongsTo(User::class, 'verified_by'); }
    public function products(): HasMany { return $this->hasMany(Product::class); }
    public function sellerOrders(): HasMany { return $this->hasMany(SellerOrder::class); }
    public function verifications(): HasMany { return $this->hasMany(Verification::class); }
    public function scopeApproved($q) { return $q->where('verification_status', 'approved'); }
}