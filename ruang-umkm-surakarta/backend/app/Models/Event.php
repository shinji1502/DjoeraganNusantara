<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;

    public const CATEGORIES = ['Bazzar', 'Pameran', 'Business Matching', 'Temu Usaha'];
    public const STATUSES = ['Mendatang', 'Berlangsung', 'Selesai'];

    protected $fillable = [
        'title', 'slug', 'category', 'event_date', 'end_date', 'time',
        'location', 'organizer', 'status', 'image', 'description', 'quota', 'created_by',
    ];

    protected $casts = [
        'event_date' => 'date',
        'end_date' => 'date',
        'quota' => 'integer',
    ];

    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }

    public function scopeUpcoming($query)
    {
        return $query->whereIn('status', ['Mendatang', 'Berlangsung'])->orderBy('event_date', 'asc');
    }
}
