<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MyProgramRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $items = $request->user()->programRegistrations()
            ->with('program:id,title,slug,location,start_date,end_date')
            ->latest('id')->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'registration_number' => $r->registration_number,
                'status' => $r->status,
                'notes' => $r->notes,
                'registered_at' => $r->registered_at?->toIso8601String(),
                'program' => $r->program ? [
                    'title' => $r->program->title,
                    'slug' => $r->program->slug,
                    'location' => $r->program->location,
                    'start_date' => $r->program->start_date?->toDateString(),
                    'end_date' => $r->program->end_date?->toDateString(),
                ] : null,
            ]);

        return response()->json(['data' => $items]);
    }

    /** Pembatalan membebaskan kuota (kuota hanya menghitung pending/approved/completed). */
    public function cancel(Request $request, int $id)
    {
        $registration = $request->user()->programRegistrations()->findOrFail($id); // milik orang lain → 404

        if (! in_array($registration->status, ['pending', 'approved'], true)) {
            throw ValidationException::withMessages(['status' => ['Pendaftaran ini tidak dapat dibatalkan.']]);
        }

        $registration->update(['status' => 'cancelled']);
        ActivityLogger::log('program.registration_cancelled', 'Pendaftaran program dibatalkan.', $request->user()->id, $registration);

        return response()->json(['message' => 'Pendaftaran dibatalkan.']);
    }
}