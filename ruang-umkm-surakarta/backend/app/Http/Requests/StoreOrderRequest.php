<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Hanya id produk dan jumlah yang diterima.
     * Harga, ongkir, total, dan status tidak dibaca dari request.
     */
    public function rules(): array
    {
        return [
            'address_id' => ['required', 'integer', Rule::exists('addresses', 'id')->where('user_id', $this->user()->id)],
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
            'payment_method' => ['required', Rule::in(['transfer_bank', 'ewallet', 'cod'])],
            'buyer_notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}