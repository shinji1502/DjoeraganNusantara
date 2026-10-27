<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use LogicException;

/** Log audit bersifat append-only: update dan delete ditolak. */
class ActivityLog extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'user_id', 'action', 'entity_type', 'entity_id', 'description',
        'ip_address', 'user_agent', 'metadata',
    ];

    protected $casts = ['metadata' => 'array'];

    protected static function booted(): void
    {
        static::updating(fn () => throw new LogicException('Activity log tidak boleh diubah.'));
        static::deleting(fn () => throw new LogicException('Activity log tidak boleh dihapus.'));
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}