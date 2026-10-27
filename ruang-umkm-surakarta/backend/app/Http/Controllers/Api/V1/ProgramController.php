<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use App\Services\ActivityLogger;
use App\Services\ProgramRegistrationService;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Program::published()
            ->withCount(['registrations' => fn ($q) => $q->whereIn('status', ['pending', 'approved', 'completed'])])
            ->orderBy('start_date');

        if ($term = $request->query('q')) {
            $query->where('title', 'like', '%'.addcslashes($term, '%_\\').'%');
        }

        return ProgramResource::collection($query->paginate((int) $request->query('per_page', 12))->withQueryString());
    }

    public function show(string $slug)
    {
        $program = Program::published()
            ->withCount(['registrations' => fn ($q) => $q->whereIn('status', ['pending', 'approved', 'completed'])])
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProgramResource($program);
    }

    public function register(Request $request, int $id, ProgramRegistrationService $service)
    {
        $registration = $service->register($request->user(), $id);

        ActivityLogger::log('program.registered', 'Mendaftar program.', $request->user()->id, $registration);

        return response()->json([
            'message' => 'Pendaftaran berhasil. Menunggu persetujuan admin.',
            'data' => [
                'registration_number' => $registration->registration_number,
                'status' => $registration->status,
                'registered_at' => $registration->registered_at->toIso8601String(),
            ],
        ], 201);
    }
}