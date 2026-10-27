<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SellerProfile;
use App\Models\Verification;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VerificationController extends Controller
{
    public function index(SellerProfile $seller)
    {
        $items = $seller->verifications()->with('submitter:id,name')->latest('id')->get()->map(fn ($v) => [
            'id' => $v->id,
            'document_type' => $v->document_type,
            'status' => $v->status,
            'submitted_by' => $v->submitter?->name,
            'rejection_reason' => $v->rejection_reason,
            'created_at' => $v->created_at?->toIso8601String(),
            'reviewed_at' => $v->reviewed_at?->toIso8601String(),
        ]);

        return response()->json(['data' => $items]);
    }

    /** Hanya admin; setiap pembukaan dokumen tercatat di audit log. */
    public function download(Request $request, Verification $verification)
    {
        $disk = Storage::disk('local');
        abort_unless($disk->exists($verification->document_path), 404);

        ActivityLogger::log('verification.document_viewed', 'Dokumen verifikasi dibuka admin.', $request->user()->id, $verification);

        $ext = pathinfo($verification->document_path, PATHINFO_EXTENSION);

        return $disk->download($verification->document_path, "{$verification->document_type}-{$verification->seller_profile_id}.$ext");
    }
}