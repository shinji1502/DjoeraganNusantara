<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AccountController extends Controller
{
    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
        ]);

        $user = $request->user();
        $user->fill($data)->save(); // email, role, status tidak bisa diubah di sini

        ActivityLogger::log('account.profile_updated', 'Profil akun diperbarui.', $user->id, $user);

        return new UserResource($user->load('sellerProfile'));
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', 'different:current_password', Password::min(8)->letters()->numbers()],
        ]);

        $user = $request->user();
        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages(['current_password' => ['Kata sandi saat ini salah.']]);
        }

        $user->password = $data['password']; // di-hash oleh cast
        $user->save();

        // Cabut semua token lain; sesi/token yang dipakai sekarang tetap berlaku.
        $tokens = $user->tokens();
        $current = $user->currentAccessToken();
        if ($current instanceof PersonalAccessToken) {
            $tokens->where('id', '!=', $current->id);
        }
        $tokens->delete();

        ActivityLogger::log('account.password_changed', 'Kata sandi diubah.', $user->id, $user);

        return response()->json(['message' => 'Kata sandi berhasil diubah.']);
    }
}