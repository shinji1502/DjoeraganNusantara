<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Complaint extends Model
{
    use SoftDeletes;

    public const PRIORITIES = ['rendah', 'sedang', 'tinggi'];
    public const STATUSES = ['baru', 'dalam_penanganan', 'selesai'];

    protected $fillable = [
        'ticket_number', 'user_id', 'complainant_name', 'user_role', 'subject',
        'message', 'priority', 'status', 'sla_hours_left', 'resolution_notes',
        'resolved_by', 'resolved_at',
    ];

    protected $casts = [
        'sla_hours_left' => 'integer',
        'resolved_at' => 'datetime',
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function resolver(): BelongsTo { return $this->belongsTo(User::class, 'resolved_by'); }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['baru', 'dalam_penanganan']);
    }
}
