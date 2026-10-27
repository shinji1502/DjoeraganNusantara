<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\SellerProfile;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data) {
            $user = new User();
            $user->fill([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
            ]);
            // role & status ditentukan backend, tidak mass-assignable
            $user->forceFill(['role' => $data['role'], 'status' => 'active'])->save();

            if ($data['role'] === 'penjual') {
                $profile = new SellerProfile([
                    'user_id' => $user->id,
                    'business_name' => $data['business_name'],
                    'slug' => $this->uniqueSellerSlug($data['business_name']),
                    'owner_name' => $data['name'],
                    'address' => $data['address'],
                    'phone' => $data['phone'] ?? null,
                    'email' => $data['email'],
                    'business_category_id' => $data['business_category_id'] ?? null,
                ]);
                $profile->save(); // verification_status default: pending
            }

            return $user;
        });

        ActivityLogger::log('auth.register', 'Pengguna baru mendaftar.', $user->id, $user, ['role' => $user->role]);

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'data' => [
                'user' => new UserResource($user->load('sellerProfile')),
                'token' => $this->issueToken($user),
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->input('email'))->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            ActivityLogger::log('auth.login_failed', 'Percobaan login gagal.', $user?->id, null, ['email' => $request->input('email')]);

            return response()->json(['message' => 'Email atau kata sandi salah.'], 422);
        }

        if (in_array($user->status, ['suspended', 'rejected'], true)) {
            return response()->json(['message' => 'Akun Anda tidak dapat digunakan. Hubungi admin.'], 403);
        }

        $user->forceFill(['last_login_at' => now()])->save();
        ActivityLogger::log('auth.login', 'Pengguna login.', $user->id, $user);

        return response()->json([
            'message' => 'Login berhasil.',
            'data' => [
                'user' => new UserResource($user->load('sellerProfile')),
                'token' => $this->issueToken($user),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        ActivityLogger::log('auth.logout', 'Pengguna logout.', $user->id, $user);

        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()->load('sellerProfile.category')),
        ]);
    }

    private function issueToken(User $user): string
    {
        return $user->createToken('react-spa', ['*'], now()->addDays(7))->plainTextToken;
    }

    private function uniqueSellerSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'usaha';
        $slug = $base;
        $i = 2;
        while (SellerProfile::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}