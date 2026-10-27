<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:draft,pending,published,rejected,archived'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Product::where('seller_profile_id', $this->seller($request)->id)
            ->with(['category', 'images'])
            ->latest('id');

        if ($term = $request->query('q')) {
            $query->where('name', 'like', '%'.addcslashes($term, '%_\\').'%');
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return ProductResource::collection($query->paginate((int) $request->query('per_page', 12))->withQueryString());
    }

    public function store(ProductRequest $request)
    {
        $seller = $this->seller($request);
        $data = Arr::except($request->validated(), ['status']);

        $product = new Product($data);
        $product->seller_profile_id = $seller->id;       // dari akun login, bukan dari input
        $product->slug = $this->uniqueSlug($data['name']);
        $product->forceFill(['status' => $request->input('status', 'draft')])->save();

        ActivityLogger::log('product.created', "Produk \"{$product->name}\" dibuat.", $request->user()->id, $product);

        return (new ProductResource($product->load(['category', 'images'])))
            ->response()->setStatusCode(201);
    }

    public function update(ProductRequest $request, Product $product)
    {
        Gate::authorize('update', $product);

        $product->fill(Arr::except($request->validated(), ['status']));
        if ($request->filled('status')) {
            $product->forceFill(['status' => $request->input('status')]);
        }
        $product->save();

        ActivityLogger::log('product.updated', "Produk \"{$product->name}\" diperbarui.", $request->user()->id, $product);

        return new ProductResource($product->fresh(['category', 'images']));
    }

    public function destroy(Request $request, Product $product)
    {
        Gate::authorize('delete', $product);

        $product->delete(); // soft delete: riwayat pesanan tetap utuh
        ActivityLogger::log('product.deleted', "Produk \"{$product->name}\" dihapus.", $request->user()->id, $product);

        return response()->json(['message' => 'Produk dihapus.']);
    }

    private function seller(Request $request): SellerProfile
    {
        return $request->user()->sellerProfile
            ?? abort(403, 'Profil usaha tidak ditemukan.');
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'produk';
        $slug = $base;
        $i = 2;
        while (Product::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}