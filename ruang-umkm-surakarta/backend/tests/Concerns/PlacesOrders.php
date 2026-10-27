<?php

namespace Tests\Concerns;

use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;

trait PlacesOrders
{
    protected function placeOrder(User $buyer, array $items, string $method = 'transfer_bank'): Order
    {
        return app(OrderService::class)->create($buyer, $this->makeAddress($buyer), $items, $method);
    }
}