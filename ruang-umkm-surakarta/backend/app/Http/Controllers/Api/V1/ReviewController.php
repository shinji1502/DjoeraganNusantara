<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\OrderItem;
use App\Models\Review;
use App\Services\ActivityLogger;
use App\Services\Notifier;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'order_item_id' => ['required', 'integer'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = $request->user();

        // Hanya item dari pesanan milik sendiri; selain itu 404.
        $item = OrderItem::whereHas('order', fn ($q) => $q->where('buyer_id', $user->id))
            ->with('sellerOrder')
            ->findOrFail($data['order_item_id']);

        if (! $item->product_id) {
            $this->fail('Produk sudah tidak tersedia untuk diulas.');
        }
        if ($item->sellerOrder?->status !== 'completed') {
            $this->fail('Ulasan hanya dapat diberikan setelah pesanan diterima.');
        }
        if ($item->review()->exists()) {
            $this->fail('Anda sudah memberikan ulasan untuk item ini.');
        }

        try {
            $review = Review::create([
                'product_id' => $item->product_id,
                'buyer_id' => $user->id,
                'order_item_id' => $item->id,
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
                'status' => 'published',
            ]);
        } catch (UniqueConstraintViolationException) {
            $this->fail('Anda sudah memberikan ulasan untuk item ini.');
        }

        ActivityLogger::log('review.created', 'Ulasan produk dibuat.', $user->id, $review, ['rating' => $review->rating]);
        Notifier::send($item->seller?->user, 'review.new', 'Ulasan baru', "Produk {$item->product_name_snapshot} mendapat rating {$review->rating}/5.", [
            'product_id' => $item->product_id,
        ]);

        return (new ReviewResource($review->load('buyer:id,name')))->response()->setStatusCode(201);
    }

    private function fail(string $message): never
    {
        throw ValidationException::withMessages(['order_item_id' => [$message]]);
    }
}