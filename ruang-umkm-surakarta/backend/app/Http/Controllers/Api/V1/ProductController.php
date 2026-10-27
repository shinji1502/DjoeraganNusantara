<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:120'],
            'seller' => ['nullable', 'string', 'max:255'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'sort' => ['nullable', 'in:newest,price_asc,price_desc,name'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $published = fn ($q) => $q->where('status', 'published');

        $query = Product::published()
            ->whereHas('seller', fn ($q) => $q->approved())
            ->with(['category', 'seller', 'images'])
            ->withAvg(['reviews' => $published], 'rating')
            ->withCount(['reviews' => $published]);

        if ($term = $request->query('q')) {
            $like = '%'.addcslashes($term, '%_\\').'%';
            $query->where(fn ($q) => $q->where('name', 'like', $like)->orWhere('description', 'like', $like));
        }
        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }
        if ($seller = $request->query('seller')) {
            $query->whereHas('seller', fn ($q) => $q->where('slug', $seller));
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->query('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->query('max_price'));
        }

        match ($request->query('sort', 'newest')) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name' => $query->orderBy('name'),
            default => $query->orderByDesc('published_at')->orderByDesc('id'),
        };

        return ProductResource::collection(
            $query->paginate((int) $request->query('per_page', 12))->withQueryString()
        );
    }

    public function show(string $slug)
    {
        $published = fn ($q) => $q->where('status', 'published');

        $product = Product::published()
            ->whereHas('seller', fn ($q) => $q->approved())
            ->with(['category', 'seller.category', 'images'])
            ->withAvg(['reviews' => $published], 'rating')
            ->withCount(['reviews' => $published])
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProductResource($product);
    }

    public function reviews(string $slug)
    {
        $product = Product::published()->where('slug', $slug)->firstOrFail();

        return ReviewResource::collection(
            $product->reviews()->where('status', 'published')->with('buyer:id,name')->latest('id')->paginate(10)
        );
    }
}