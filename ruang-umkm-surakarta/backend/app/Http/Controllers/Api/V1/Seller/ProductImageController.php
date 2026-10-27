<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class ProductImageController extends Controller
{
    private const MAX_IMAGES = 8;

    public function store(Request $request, Product $product)
    {
        Gate::authorize('update', $product);

        $request->validate([
            'images' => ['required', 'array', 'min:1', 'max:'.self::MAX_IMAGES],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048', 'dimensions:max_width=6000,max_height=6000'],
            'alt_text' => ['nullable', 'string', 'max:255'],
        ]);

        $files = array_values($request->file('images'));
        $existing = $product->images()->count();
        if ($existing + count($files) > self::MAX_IMAGES) {
            throw ValidationException::withMessages(['images' => ['Maksimal '.self::MAX_IMAGES.' gambar per produk.']]);
        }

        $stored = [];
        try {
            DB::transaction(function () use ($product, $files, $existing, $request, &$stored) {
                foreach ($files as $i => $file) {
                    // Nama file dibuat acak oleh Laravel; nama dari klien tidak dipakai.
                    $path = $file->store("products/{$product->id}", 'public');
                    $stored[] = $path;

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'alt_text' => $request->input('alt_text'),
                        'sort_order' => $existing + $i,
                        'is_primary' => $existing === 0 && $i === 0,
                    ]);
                }
            });
        } catch (Throwable $e) {
            foreach ($stored as $path) {
                Storage::disk('public')->delete($path);
            }
            throw $e;
        }

        ActivityLogger::log('product.images_added', "Gambar produk \"{$product->name}\" ditambah.", $request->user()->id, $product, ['count' => count($files)]);

        return (new ProductResource($product->load(['category', 'images'])))->response()->setStatusCode(201);
    }

    public function destroy(Request $request, Product $product, int $image)
    {
        Gate::authorize('update', $product);
        $img = $product->images()->findOrFail($image);

        DB::transaction(function () use ($product, $img) {
            $wasPrimary = $img->is_primary;
            Storage::disk('public')->delete($img->image_path);
            $img->delete();

            if ($wasPrimary) {
                $product->images()->first()?->update(['is_primary' => true]);
            }
        });

        ActivityLogger::log('product.image_deleted', "Gambar produk \"{$product->name}\" dihapus.", $request->user()->id, $product);

        return response()->json(['message' => 'Gambar dihapus.']);
    }

    public function setPrimary(Request $request, Product $product, int $image)
    {
        Gate::authorize('update', $product);
        $img = $product->images()->findOrFail($image);

        DB::transaction(function () use ($product, $img) {
            $product->images()->update(['is_primary' => false]);
            $img->update(['is_primary' => true]);
        });

        return new ProductResource($product->load(['category', 'images']));
    }
}