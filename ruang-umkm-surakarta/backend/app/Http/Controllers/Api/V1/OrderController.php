<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Order;
use App\Models\SellerOrder;
use App\Services\ActivityLogger;
use App\Services\OrderLifecycleService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    private const DETAIL = ['sellerOrders.seller', 'sellerOrders.shipment', 'items.review', 'payments'];

    public function index(Request $request)
    {
        $orders = Order::where('buyer_id', $request->user()->id)
            ->with(['items', 'payments'])
            ->latest('id')
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    public function store(StoreOrderRequest $request, OrderService $service)
    {
        $user = $request->user();

        // Alamat harus milik pembeli sendiri; selain itu 422 pada address_id.
        $address = Address::where('user_id', $user->id)->find($request->input('address_id'));
        if (! $address) {
            throw ValidationException::withMessages(['address_id' => ['Alamat pengiriman tidak valid.']]);
        }

        $order = $service->create(
            $user,
            $address,
            $request->input('items'),
            $request->input('payment_method'),
            $request->input('buyer_notes'),
        );

        ActivityLogger::log('order.created', "Pesanan {$order->order_number} dibuat.", $user->id, $order, [
            'total_amount' => (float) $order->total_amount,
        ]);

        return (new OrderResource($order))->response()->setStatusCode(201);
    }

    public function show(Request $request, string $orderNumber)
    {
        // Milik orang lain mengembalikan 404 (keberadaannya tidak dibocorkan).
        $order = $this->ownOrder($request, $orderNumber)->load(self::DETAIL);

        return new OrderResource($order);
    }

    public function cancel(Request $request, string $orderNumber, OrderLifecycleService $service)
    {
        $order = $this->ownOrder($request, $orderNumber);
        $order = $service->cancel($order, 'Dibatalkan oleh pembeli.', $request->user());

        return new OrderResource($order->load(self::DETAIL));
    }

    public function received(Request $request, string $orderNumber, SellerOrder $sellerOrder, OrderLifecycleService $service)
    {
        $order = $this->ownOrder($request, $orderNumber);
        abort_unless((int) $sellerOrder->order_id === (int) $order->id, 404);

        $order = $service->receive($sellerOrder, $request->user());

        return new OrderResource($order->load(self::DETAIL));
    }

    private function ownOrder(Request $request, string $orderNumber): Order
    {
        return Order::where('buyer_id', $request->user()->id)
            ->where('order_number', $orderNumber)
            ->firstOrFail();
    }
}