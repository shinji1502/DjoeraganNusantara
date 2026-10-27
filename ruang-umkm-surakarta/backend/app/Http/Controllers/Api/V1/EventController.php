<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'category' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:20'],
            'q' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Event::query()->orderBy('event_date', 'asc');

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($term = $request->query('q')) {
            $query->where('title', 'like', '%'.addcslashes($term, '%_\\').'%');
        }

        return EventResource::collection($query->paginate((int) $request->query('per_page', 12))->withQueryString());
    }

    public function show(string $slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();

        return new EventResource($event);
    }
}
