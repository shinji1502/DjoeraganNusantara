<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessCategory extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function sellerProfiles(): HasMany { return $this->hasMany(SellerProfile::class); }
    public function products(): HasMany { return $this->hasMany(Product::class); }
    public function scopeActive($q) { return $q->where('is_active', true); }
}