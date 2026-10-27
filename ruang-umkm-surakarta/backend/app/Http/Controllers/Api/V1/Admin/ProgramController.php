<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProgramRequest;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'status' => ['nullable', 'in:draft,published,ongoing,completed,cancelled'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Program::withCount('registrations')->latest('id');
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return ProgramResource::collection($query->paginate((int) $request->query('per_page', 20))->withQueryString());
    }

    public function store(ProgramRequest $request)
    {
        $program = new Program($request->validated());
        $program->slug = $this->uniqueSlug($request->input('title'));
        $program->created_by = $request->user()->id;
        $program->save();

        ActivityLogger::log('program.created', "Program \"{$program->title}\" dibuat.", $request->user()->id, $program);

        return (new ProgramResource($program))->response()->setStatusCode(201);
    }

    public function update(ProgramRequest $request, int $id)
    {
        $program = Program::findOrFail($id);
        $program->update($request->validated()); // slug & created_by tidak berubah

        ActivityLogger::log('program.updated', "Program \"{$program->title}\" diperbarui.", $request->user()->id, $program);

        return new ProgramResource($program->fresh());
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'program';
        $slug = $base;
        $i = 2;
        while (Program::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}