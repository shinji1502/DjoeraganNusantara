<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogger
{
    /** Catat aktivitas audit. Jangan pernah memasukkan password/token ke $metadata. */
    public static function log(string $action, string $description, ?int $userId = null, ?Model $entity = null, array $metadata = []): void
    {
        $request = request();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => $entity ? class_basename($entity) : null,
            'entity_id' => $entity?->getKey(),
            'description' => $description,
            'ip_address' => $request?->ip(),
            'user_agent' => $request ? mb_substr((string) $request->userAgent(), 0, 255) : null,
            'metadata' => $metadata ?: null,
        ]);
    }
}