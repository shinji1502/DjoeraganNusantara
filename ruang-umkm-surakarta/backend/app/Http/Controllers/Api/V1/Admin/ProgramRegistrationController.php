<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\ProgramRegistration;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProgramRegistrationController extends Controller
{
    private const ALLOWED = [
        'pending' => ['approved', 'rejected'],
        'approved' => ['completed', 'rejected'],
    ];

    public function index(int $id)
    {
        $program = Program::findOrFail($id);
        $page = $program->registrations()->with('user:id,name,email,phone,role')->latest('id')->paginate(25);

        return response()->json([
            'data' => $page->getCollection()->map(fn ($r) => [
                'id' => $r->id,
                'registration_number' => $r->registration_number,
                'status' => $r->status,
                'notes' => $r->notes,
                'registered_at' => $r->registered_at?->toIso8601String(),
                'user' => $r->user ? ['id' => $r->user->id, 'name' => $r->user->name, 'email' => $r->user->email, 'phone' => $r->user->phone, 'role' => $r->user->role] : null,
            ])->values(),
            'meta' => ['current_page' => $page->currentPage(), 'last_page' => $page->lastPage(), 'total' => $page->total()],
        ]);
    }

    public function update(Request $request, ProgramRegistration $registration)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected', 'completed'])],
            'notes' => ['required_if:status,rejected', 'nullable', 'string', 'max:500'],
        ]);

        if (! in_array($data['status'], self::ALLOWED[$registration->status] ?? [], true)) {
            throw ValidationException::withMessages(['status' => ['Perubahan status tidak diizinkan.']]);
        }

        $from = $registration->status;
        $registration->update([
            'status' => $data['status'],
            'notes' => $data['notes'] ?? $registration->notes,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        ActivityLogger::log('program.registration_reviewed', "Pendaftaran {$registration->registration_number} ditinjau.", $request->user()->id, $registration, [
            'from' => $from, 'to' => $data['status'],
        ]);

        return response()->json(['data' => [
            'id' => $registration->id,
            'registration_number' => $registration->registration_number,
            'status' => $registration->status,
            'notes' => $registration->notes,
        ]]);
    }
}