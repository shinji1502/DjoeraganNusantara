<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'complainant_name' => ['required', 'string', 'max:100'],
            'user_role' => ['nullable', 'string', 'in:pembeli,penjual,tamu'],
            'subject' => ['required', 'string', 'max:200'],
            'message' => ['required', 'string', 'max:2000'],
            'priority' => ['nullable', 'string', 'in:rendah,sedang,tinggi'],
        ]);

        $user = $request->user();
        $ticket = 'TKT-' . date('Ym') . '-' . strtoupper(Str::random(4));

        $complaint = Complaint::create([
            'ticket_number' => $ticket,
            'user_id' => $user?->id,
            'complainant_name' => $validated['complainant_name'],
            'user_role' => $validated['user_role'] ?? ($user ? $user->role : 'tamu'),
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'priority' => $validated['priority'] ?? 'sedang',
            'status' => 'baru',
            'sla_hours_left' => 48,
        ]);

        ActivityLogger::log('complaint.submitted', "Pengaduan {$ticket} diterima.", $user?->id, $complaint);

        return (new ComplaintResource($complaint))->response()->setStatusCode(201);
    }
}
