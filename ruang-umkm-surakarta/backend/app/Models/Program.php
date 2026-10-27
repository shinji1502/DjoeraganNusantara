<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'description', 'organizer', 'location', 'start_date', 'end_date',
        'registration_start', 'registration_end', 'quota', 'cover_image', 'status', 'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'registration_start' => 'date',
        'registration_end' => 'date',
        'quota' => 'integer',
    ];

    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function registrations(): HasMany { return $this->hasMany(ProgramRegistration::class); }
    public function scopePublished($q) { return $q->whereIn('status', ['published', 'ongoing']); }
}