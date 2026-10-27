<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_number' => $this->ticket_number,
            'complainant_name' => $this->complainant_name,
            'user_role' => $this->user_role,
            'subject' => $this->subject,
            'message' => $this->message,
            'priority' => $this->priority,
            'status' => $this->status,
            'sla_hours_left' => $this->sla_hours_left,
            'resolution_notes' => $this->resolution_notes,
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
