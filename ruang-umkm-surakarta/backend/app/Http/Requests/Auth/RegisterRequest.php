<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
            // admin TIDAK boleh mendaftar lewat API publik
            'role' => ['required', Rule::in(['pembeli', 'penjual'])],

            // wajib hanya untuk penjual
            'business_name' => ['required_if:role,penjual', 'nullable', 'string', 'max:255'],
            'address' => ['required_if:role,penjual', 'nullable', 'string', 'max:1000'],
            'business_category_id' => ['nullable', 'integer', Rule::exists('business_categories', 'id')->where('is_active', true)],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama',
            'password' => 'kata sandi',
            'business_name' => 'nama usaha',
            'address' => 'alamat',
        ];
    }
}