<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Models\SellerProfile;
use App\Models\Verification;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class VerificationController extends Controller
{
    private const MAX_DOCUMENTS = 10;

    public function index(Request $request)
    {
        $items = $this->seller($request)->verifications()->latest('id')->get()
            ->map(fn (Verification $v) => $this->present($v));

        return response()->json(['data' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'document_type' => ['required', Rule::in(['nib', 'ktp', 'npwp', 'surat_usaha', 'izin_pirt', 'lainnya'])],
            'document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:4096'],
        ]);

        $seller = $this->seller($request);
        if ($seller->verifications()->count() >= self::MAX_DOCUMENTS) {
            throw ValidationException::withMessages(['document' => ['Jumlah dokumen sudah mencapai batas.']]);
        }

        // Disk "local" = storage/app/private, tidak dapat diakses lewat URL publik.
        $path = $request->file('document')->store("verifications/{$seller->id}", 'local');

        $verification = Verification::create([
            'seller_profile_id' => $seller->id,
            'submitted_by' => $request->user()->id,
            'document_type' => $data['document_type'],
            'document_path' => $path,
            'status' => 'pending',
        ]);

        if (in_array($seller->verification_status, ['rejected', 'revision_required'], true)) {
            $seller->forceFill(['verification_status' => 'pending', 'rejection_reason' => null])->save();
        }

        ActivityLogger::log('verification.submitted', 'Dokumen verifikasi diunggah.', $request->user()->id, $verification, [
            'document_type' => $data['document_type'], // path file sengaja tidak dicatat
        ]);

        return response()->json(['data' => $this->present($verification)], 201);
    }

    private function present(Verification $v): array
    {
        return [
            'id' => $v->id,
            'document_type' => $v->document_type,
            'status' => $v->status,
            'rejection_reason' => $v->rejection_reason,
            'created_at' => $v->created_at?->toIso8601String(),
            'reviewed_at' => $v->reviewed_at?->toIso8601String(),
        ];
    }

    private function seller(Request $request): SellerProfile
    {
        return $request->user()->sellerProfile ?? abort(403, 'Profil usaha tidak ditemukan.');
    }
}