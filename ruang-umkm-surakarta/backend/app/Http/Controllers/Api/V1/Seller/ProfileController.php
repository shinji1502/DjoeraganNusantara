<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\UpdateProfileRequest;
use App\Http\Resources\SellerProfileResource;
use App\Models\SellerProfile;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return new SellerProfileResource($this->profile($request)->load('category'));
    }

    public function update(UpdateProfileRequest $request)
    {
        $profile = $this->profile($request);
        $profile->update($request->validated());

        ActivityLogger::log('seller.profile_updated', 'Profil usaha diperbarui.', $request->user()->id, $profile);

        return new SellerProfileResource($profile->fresh('category'));
    }

    /** POST seller/profile/logo atau seller/profile/banner (multipart, field "image"). */
    public function uploadImage(Request $request, string $type)
    {
        abort_unless(in_array($type, ['logo', 'banner'], true), 404);

        $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $profile = $this->profile($request);
        $old = $profile->{$type};
        $path = $request->file('image')->store("sellers/{$profile->id}", 'public');

        $profile->forceFill([$type => $path])->save();
        if ($old) {
            Storage::disk('public')->delete($old);
        }

        ActivityLogger::log('seller.image_updated', "Gambar $type diperbarui.", $request->user()->id, $profile);

        return new SellerProfileResource($profile->fresh('category'));
    }

    private function profile(Request $request): SellerProfile
    {
        return $request->user()->sellerProfile ?? abort(403, 'Profil usaha tidak ditemukan.');
    }
}