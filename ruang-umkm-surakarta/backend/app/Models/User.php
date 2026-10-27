<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_PENJUAL = 'penjual';
    public const ROLE_PEMBELI = 'pembeli';
    public const ROLES = [self::ROLE_ADMIN, self::ROLE_PENJUAL, self::ROLE_PEMBELI];
    public const STATUSES = ['pending', 'active', 'suspended', 'rejected'];

    // role & status sengaja tidak fillable: hanya diubah lewat kode backend/admin.
    protected $fillable = ['name', 'email', 'password', 'phone', 'avatar'];
    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool { return $this->role === self::ROLE_ADMIN; }
    public function isPenjual(): bool { return $this->role === self::ROLE_PENJUAL; }
    public function isPembeli(): bool { return $this->role === self::ROLE_PEMBELI; }
    public function isActive(): bool { return $this->status === 'active'; }

    public function sellerProfile(): HasOne { return $this->hasOne(SellerProfile::class); }
    public function addresses(): HasMany { return $this->hasMany(Address::class); }
    public function orders(): HasMany { return $this->hasMany(Order::class, 'buyer_id'); }
    public function reviews(): HasMany { return $this->hasMany(Review::class, 'buyer_id'); }
    public function programRegistrations(): HasMany { return $this->hasMany(ProgramRegistration::class); }
    public function activityLogs(): HasMany { return $this->hasMany(ActivityLog::class); }
}