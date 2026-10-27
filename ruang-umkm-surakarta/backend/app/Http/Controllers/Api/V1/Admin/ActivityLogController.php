<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /** Read-only: tidak ada endpoint ubah/hapus untuk log audit. */
    public function index(Request $request)
    {
        $request->validate([
            'action' => ['nullable', 'string', 'max:100'],
            'user_id' => ['nullable', 'integer'],
            'entity_type' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = ActivityLog::with('user:id,name,email')->latest('id');

        if ($v = $request->query('action')) {
            $query->where('action', $v);
        }
        if ($v = $request->query('user_id')) {
            $query->where('user_id', $v);
        }
        if ($v = $request->query('entity_type')) {
            $query->where('entity_type', $v);
        }

        $page = $query->paginate((int) $request->query('per_page', 25))->withQueryString();

        return response()->json([
            'data' => $page->getCollection()->map(fn ($l) => [
                'id' => $l->id,
                'action' => $l->action,
                'description' => $l->description,
                'user' => $l->user ? ['id' => $l->user->id, 'name' => $l->user->name, 'email' => $l->user->email] : null,
                'entity_type' => $l->entity_type,
                'entity_id' => $l->entity_id,
                'ip_address' => $l->ip_address,
                'metadata' => $l->metadata,
                'created_at' => $l->created_at?->toIso8601String(),
            ])->values(),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
            ],
        ]);
    }
}