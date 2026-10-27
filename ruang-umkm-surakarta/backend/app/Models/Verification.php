<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Verification extends Model
{
    protected $fillable = [
        'seller_profile_id', 'submitted_by', 'document_type', 'document_path',
        'status', 'reviewed_by', 'reviewed_at', 'rejection_reason',
    ];

    // path dokumen privat tidak ikut terkirim ke API
    protected $hidden = ['document_path'];
    protected $casts = ['reviewed_at' => 'datetime'];

    public function seller(): BelongsTo { return $this->belongsTo(SellerProfile::class, 'seller_profile_id'); }
    public function submitter(): BelongsTo { return $this->belongsTo(User::class, 'submitted_by'); }
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'reviewed_by'); }
}