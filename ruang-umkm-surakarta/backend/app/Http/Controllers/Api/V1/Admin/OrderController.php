<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderLifecycleService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => ['nullable', 'string', 'max:60'],
            'order_status' => ['nullable', Rule::in(['pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled'])],
            'payment_status' => ['nullable', Rule::in(['unpaid', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Order::with(['buyer', 'items', 'payments', 'sellerOrders.seller', 'sellerOrders.shipment'])->latest('id');

        if ($term = $request->query('q')) {
            $query->where('order_number', 'like', '%'.addcslashes($term, '%_\\').'%');
        }
        if ($s = $request->query('order_status')) {
            $query->where('order_status', $s);
        }
        if ($s = $request->query('payment_status')) {
            $query->where('payment_status', $s);
        }

        return OrderResource::collection($query->paginate((int) $request->query('per_page', 20))->withQueryString());
    }

    /** Verifikasi pembayaran manual (transfer bank). Gateway memakai webhook. */
    public function updatePayment(Request $request, string $orderNumber, OrderLifecycleService $service)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['paid', 'failed'])]]);

        $order = Order::where('order_number', $orderNumber)->firstOrFail();
        $payment = $order->payments()->latest('id')->firstOrFail();

        if ($data['status'] === 'paid') {
            $service->markPaid($payment, $request->user());
        } else {
            $service->cancel($order, 'Pembayaran ditandai gagal oleh admin.', $request->user(), 'failed');
        }

        return new OrderResource($order->fresh(['buyer', 'items', 'payments', 'sellerOrders.seller', 'sellerOrders.shipment']));
    }
}