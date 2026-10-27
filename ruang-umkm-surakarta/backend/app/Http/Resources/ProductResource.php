<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'original_price' => $this->original_price !== null ? (float) $this->original_price : null,
            'stock' => $this->stock,
            'weight' => $this->weight,
            'unit' => $this->unit,
            'certifications' => $this->certifications ?? [],
            'district' => $this->district,
            'status' => $this->status,
            'rating_avg' => array_key_exists('reviews_avg_rating', $this->resource->getAttributes())
            ? ($this->reviews_avg_rating !== null ? round((float) $this->reviews_avg_rating, 1) : null)
            : null,
            'reviews_count' => $this->whenCounted('reviews'),
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at?->toIso8601String(),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'seller' => new SellerProfileResource($this->whenLoaded('seller')),
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => Storage::disk('public')->url($img->image_path),
                'alt_text' => $img->alt_text,
                'is_primary' => $img->is_primary,
            ])),
        ];
    }
}