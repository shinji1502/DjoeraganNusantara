<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramRegistration extends Model
{
    protected $fillable = [
        'program_id', 'user_id', 'registration_number', 'status',
        'registered_at', 'reviewed_by', 'reviewed_at', 'notes',
    ];

    protected $casts = ['registered_at' => 'datetime', 'reviewed_at' => 'datetime'];

    public function program(): BelongsTo { return $this->belongsTo(Program::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'reviewed_by'); }
}