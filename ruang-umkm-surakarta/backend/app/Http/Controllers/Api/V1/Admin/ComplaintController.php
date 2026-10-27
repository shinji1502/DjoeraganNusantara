<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'status' => ['nullable', 'string', 'in:baru,dalam_penanganan,selesai'],
            'priority' => ['nullable', 'string', 'in:rendah,sedang,tinggi'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Complaint::latest('id');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        return ComplaintResource::collection($query->paginate((int) $request->query('per_page', 20))->withQueryString());
    }

    public function show(int $id)
    {
        $complaint = Complaint::findOrFail($id);
        return new ComplaintResource($complaint);
    }

    public function updateStatus(Request $request, int $id)
    {
        $complaint = Complaint::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:baru,dalam_penanganan,selesai'],
            'resolution_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $complaint->status = $validated['status'];
        if (isset($validated['resolution_notes'])) {
            $complaint->resolution_notes = $validated['resolution_notes'];
        }

        if ($validated['status'] === 'selesai') {
            $complaint->resolved_by = $request->user()->id;
            $complaint->resolved_at = now();
        }

        $complaint->save();

        ActivityLogger::log('complaint.updated', "Pengaduan {$complaint->ticket_number} diubah ke {$complaint->status}.", $request->user()->id, $complaint);

        return new ComplaintResource($complaint);
    }
}
