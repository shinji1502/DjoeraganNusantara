<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SellerProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = $request->user();
        $privileged = $viewer && ($viewer->isAdmin() || $viewer->id === $this->user_id);
        $url = fn (?string $path) => $path ? Storage::disk('public')->url($path) : null;

        return [
            'id' => $this->id,
            'business_name' => $this->business_name,
            'slug' => $this->slug,
            'owner_name' => $this->owner_name,
            'nib' => $this->nib,
            'business_scale' => $this->business_scale,
            'description' => $this->description,
            'address' => $this->address,
            'district' => $this->district,
            'city' => $this->city,
            'province' => $this->province,
            'bank_name' => $this->when($privileged, $this->bank_name),
            'bank_account_number' => $this->when($privileged, $this->bank_account_number),
            'bank_account_holder' => $this->when($privileged, $this->bank_account_holder),
            'logo' => $url($this->logo),
            'banner' => $url($this->banner),
            'verification_status' => $this->verification_status,
            'verified_at' => $this->verified_at?->toIso8601String(),
            'rejection_reason' => $this->when($privileged, $this->rejection_reason),
            'user' => $this->when($viewer?->isAdmin() && $this->relationLoaded('user'), fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'status' => $this->user->status,
            ]),
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}