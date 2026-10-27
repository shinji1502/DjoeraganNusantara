<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\SellerOrderResource;
use App\Models\SellerOrder;
use App\Services\OrderLifecycleService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'status'   => ['nullable', Rule::in(['pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $seller = $request->user()->sellerProfile ?? abort(403, 'Profil usaha tidak ditemukan.');

        $query = SellerOrder::where('seller_profile_id', $seller->id)
            ->with(['order', 'items', 'shipment'])
            ->latest('id');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return SellerOrderResource::collection(
            $query->paginate((int) $request->query('per_page', 15))->withQueryString()
        );
    }

    public function show(Request $request, int $id)
    {
        $seller = $request->user()->sellerProfile ?? abort(403, 'Profil usaha tidak ditemukan.');

        $so = SellerOrder::where('seller_profile_id', $seller->id)
            ->with(['order', 'items', 'shipment'])
            ->findOrFail($id);

        return new SellerOrderResource($so);
    }

    /**
     * Penjual memajukan status sub-pesanan: pending → confirmed → processing → shipped.
     * Untuk status 'shipped', wajib menyertakan field 'courier'.
     */
    public function updateStatus(Request $request, int $id, OrderLifecycleService $service)
    {
        $data = $request->validate([
            'status'          => ['required', Rule::in(['confirmed', 'processing', 'shipped'])],
            'courier'         => ['required_if:status,shipped', 'nullable', 'string', 'max:100'],
            'service'         => ['nullable', 'string', 'max:100'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'notes'           => ['nullable', 'string', 'max:500'],
        ]);

        $seller = $request->user()->sellerProfile ?? abort(403, 'Profil usaha tidak ditemukan.');

        $so = SellerOrder::where('seller_profile_id', $seller->id)
            ->with(['order', 'items', 'shipment'])
            ->findOrFail($id);

        $updated = $service->advance($so, $data['status'], [
            'courier'         => $data['courier'] ?? null,
            'service'         => $data['service'] ?? null,
            'tracking_number' => $data['tracking_number'] ?? null,
            'notes'           => $data['notes'] ?? null,
        ], $request->user());

        return new SellerOrderResource($updated->load(['order', 'items', 'shipment']));
    }
}
