<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(Product::STATUSES)],
            'seller' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Product::with(['category', 'seller', 'images'])->latest('id');

        if ($term = $request->query('q')) {
            $query->where('name', 'like', '%'.addcslashes($term, '%_\\').'%');
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($seller = $request->query('seller')) {
            $query->whereHas('seller', fn ($q) => $q->where('slug', $seller));
        }

        return ProductResource::collection($query->paginate((int) $request->query('per_page', 20))->withQueryString());
    }

    /** Moderasi: satu-satunya jalur sebuah produk bisa berstatus published. */
    public function moderate(Request $request, Product $product)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['published', 'rejected', 'pending', 'archived'])]]);

        $old = $product->status;
        $product->forceFill([
            'status' => $data['status'],
            'published_at' => $data['status'] === 'published' ? ($product->published_at ?? now()) : $product->published_at,
        ])->save();

        ActivityLogger::log('product.moderated', "Produk \"{$product->name}\" dimoderasi.", $request->user()->id, $product, [
            'from' => $old, 'to' => $data['status'],
        ]);

        return new ProductResource($product->load(['category', 'seller']));
    }
}