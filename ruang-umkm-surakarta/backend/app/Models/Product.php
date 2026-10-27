<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use SoftDeletes;

    public const STATUSES = ['draft', 'pending', 'published', 'rejected', 'archived'];

    // status, is_featured, published_at diatur backend (moderasi admin).
    protected $fillable = [
        'seller_profile_id', 'business_category_id', 'name', 'slug', 'description',
        'sku', 'price', 'original_price', 'stock', 'weight', 'unit', 'certifications', 'district',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'stock' => 'integer',
        'weight' => 'integer',
        'certifications' => 'array',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        // Baris gambar ikut terhapus oleh FK cascade; filenya dibersihkan di sini agar tidak yatim.
        static::forceDeleting(function (Product $product) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }
        });
    }

    public function seller(): BelongsTo { return $this->belongsTo(SellerProfile::class, 'seller_profile_id'); }
    public function category(): BelongsTo { return $this->belongsTo(BusinessCategory::class, 'business_category_id'); }
    public function images(): HasMany { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function primaryImage(): HasOne { return $this->hasOne(ProductImage::class)->where('is_primary', true); }
    public function reviews(): HasMany { return $this->hasMany(Review::class); }
    public function scopePublished($q) { return $q->where('status', 'published'); }
}