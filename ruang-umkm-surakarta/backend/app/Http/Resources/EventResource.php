<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageUrl = null;
        if ($this->image) {
            $imageUrl = str_starts_with($this->image, 'http')
                ? $this->image
                : Storage::disk('public')->url($this->image);
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'category' => $this->category,
            'event_date' => $this->event_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'time' => $this->time,
            'location' => $this->location,
            'organizer' => $this->organizer,
            'status' => $this->status,
            'image' => $imageUrl,
            'description' => $this->description,
            'quota' => $this->quota,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
