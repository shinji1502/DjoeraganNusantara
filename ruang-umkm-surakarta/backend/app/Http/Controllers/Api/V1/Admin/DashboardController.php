<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Program;
use App\Models\ProgramRegistration;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $group = fn ($model, string $column) => $model::select($column, DB::raw('count(*) as total'))
            ->groupBy($column)->pluck('total', $column);

        return response()->json(['data' => [
            'users' => ['total' => User::count(), 'by_role' => $group(User::class, 'role'), 'by_status' => $group(User::class, 'status')],
            'sellers' => ['total' => SellerProfile::count(), 'by_verification' => $group(SellerProfile::class, 'verification_status')],
            'products' => ['total' => Product::count(), 'by_status' => $group(Product::class, 'status')],
            'orders' => [
                'total' => Order::count(),
                'awaiting_payment' => Order::where('payment_status', 'pending')->count(),
                'paid_revenue' => (float) Order::where('payment_status', 'paid')->sum('total_amount'),
            ],
            'programs' => [
                'total' => Program::count(),
                'by_status' => $group(Program::class, 'status'),
                'pending_registrations' => ProgramRegistration::where('status', 'pending')->count(),
            ],
        ]]);
    }
}