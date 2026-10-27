<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'status' => ['nullable', 'string', 'in:Mendatang,Berlangsung,Selesai'],
            'category' => ['nullable', 'string', 'max:50'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Event::latest('event_date');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return EventResource::collection($query->paginate((int) $request->query('per_page', 20))->withQueryString());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:Bazzar,Pameran,Business Matching,Temu Usaha'],
            'event_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:event_date'],
            'time' => ['nullable', 'string', 'max:50'],
            'location' => ['required', 'string', 'max:255'],
            'organizer' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:Mendatang,Berlangsung,Selesai'],
            'image' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'quota' => ['nullable', 'integer', 'min:1'],
        ]);

        $event = new Event($validated);
        $event->slug = $this->uniqueSlug($validated['title']);
        $event->created_by = $request->user()->id;
        $event->save();

        ActivityLogger::log('event.created', "Event \"{$event->title}\" dibuat.", $request->user()->id, $event);

        return (new EventResource($event))->response()->setStatusCode(201);
    }

    public function update(Request $request, int $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', 'in:Bazzar,Pameran,Business Matching,Temu Usaha'],
            'event_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['nullable', 'date'],
            'time' => ['nullable', 'string', 'max:50'],
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'organizer' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'string', 'in:Mendatang,Berlangsung,Selesai'],
            'image' => ['nullable', 'string', 'max:500'],
            'description' => ['sometimes', 'required', 'string'],
            'quota' => ['nullable', 'integer', 'min:1'],
        ]);

        $event->update($validated);

        ActivityLogger::log('event.updated', "Event \"{$event->title}\" diperbarui.", $request->user()->id, $event);

        return new EventResource($event->fresh());
    }

    public function destroy(Request $request, int $id)
    {
        $event = Event::findOrFail($id);
        $title = $event->title;
        $event->delete();

        ActivityLogger::log('event.deleted', "Event \"{$title}\" dihapus.", $request->user()->id, $event);

        return response()->json(['message' => 'Event berhasil dihapus.']);
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'event';
        $slug = $base;
        $i = 2;
        while (Event::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }
        return $slug;
    }
}
