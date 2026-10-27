<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $product = $this->route('product');

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'business_category_id' => ['nullable', 'integer', Rule::exists('business_categories', 'id')->where('is_active', true)],
            'sku' => ['nullable', 'string', 'max:64', Rule::unique('products', 'sku')->ignore($product?->id)],
            'price' => ['required', 'numeric', 'min:0', 'max:999999999999'],
            'stock' => ['required', 'integer', 'min:0', 'max:1000000'],
            'weight' => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'unit' => ['nullable', 'string', 'max:30'],
            // penjual hanya boleh draft/pending/archived. "published" hanya lewat moderasi admin.
            'status' => ['nullable', Rule::in(['draft', 'pending', 'archived'])],
        ];
    }
}