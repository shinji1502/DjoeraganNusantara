<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $page = $user->notifications()->latest()->paginate(15);

        return response()->json([
            'data' => $page->getCollection()->map(fn ($n) => [
                'id' => $n->id,
                'type' => $n->data['type'] ?? null,
                'title' => $n->data['title'] ?? '',
                'message' => $n->data['message'] ?? '',
                'data' => $n->data['data'] ?? [],
                'read_at' => $n->read_at?->toIso8601String(),
                'created_at' => $n->created_at?->toIso8601String(),
            ])->values(),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'total' => $page->total(),
                'unread_count' => $user->unreadNotifications()->count(),
            ],
        ]);
    }

    public function markRead(Request $request, string $id)
    {
        $request->user()->notifications()->findOrFail($id)->markAsRead(); // milik orang lain → 404

        return response()->json(['message' => 'Notifikasi ditandai dibaca.']);
    }

    public function markAllRead(Request $request)
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json(['message' => 'Semua notifikasi ditandai dibaca.']);
    }
}