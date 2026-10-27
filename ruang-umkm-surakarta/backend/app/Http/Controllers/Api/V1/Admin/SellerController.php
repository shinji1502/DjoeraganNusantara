<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SellerProfileResource;
use App\Models\SellerProfile;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SellerController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'verification_status' => ['nullable', Rule::in(['pending', 'approved', 'rejected', 'revision_required'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = SellerProfile::with(['user', 'category'])->latest('id');

        if ($term = $request->query('q')) {
            $query->where('business_name', 'like', '%'.addcslashes($term, '%_\\').'%');
        }
        if ($status = $request->query('verification_status')) {
            $query->where('verification_status', $status);
        }

        return SellerProfileResource::collection($query->paginate((int) $request->query('per_page', 20))->withQueryString());
    }

    public function updateVerification(Request $request, SellerProfile $seller)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected', 'revision_required', 'pending'])],
            'rejection_reason' => ['required_if:status,rejected,revision_required', 'nullable', 'string', 'max:1000'],
        ]);

        $admin = $request->user();
        $old = $seller->verification_status;
        $approved = $data['status'] === 'approved';
        $isPending = $data['status'] === 'pending';

        DB::transaction(function () use ($seller, $data, $admin, $approved, $isPending) {
            $seller->forceFill([
                'verification_status' => $data['status'],
                'verified_at' => $approved ? now() : null,
                'verified_by' => $isPending ? null : $admin->id,
                'rejection_reason' => ($approved || $isPending) ? null : ($data['rejection_reason'] ?? null),
            ])->save();

            // Dokumen yang masih menunggu ikut ditandai sesuai keputusan.
            $seller->verifications()->where('status', 'pending')->update([
                'status' => $data['status'],
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
                'rejection_reason' => $approved ? null : $data['rejection_reason'],
            ]);
        });

        ActivityLogger::log('seller.verification_updated', "Verifikasi {$seller->business_name} diperbarui.", $admin->id, $seller, [
            'from' => $old, 'to' => $data['status'],
        ]);

        return new SellerProfileResource($seller->fresh(['user', 'category']));
    }
}