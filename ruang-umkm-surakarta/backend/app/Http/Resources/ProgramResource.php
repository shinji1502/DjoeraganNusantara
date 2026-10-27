<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'organizer' => $this->organizer,
            'location' => $this->location,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'registration_start' => $this->registration_start?->toDateString(),
            'registration_end' => $this->registration_end?->toDateString(),
            'quota' => $this->quota,
            'registered_count' => $this->whenCounted('registrations'),
            'cover_image' => $this->cover_image,
            'status' => $this->status,
        ];
    }
}