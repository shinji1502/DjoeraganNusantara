<?php

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Controllers\Api\V1\Admin\ActivityLogController as AdminActivityLogController;
use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\ComplaintController as AdminComplaintController;
use App\Http\Controllers\Api\V1\Admin\EventController as AdminEventController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\ProgramController as AdminProgramController;
use App\Http\Controllers\Api\V1\Admin\ProgramRegistrationController as AdminProgramRegistrationController;
use App\Http\Controllers\Api\V1\Admin\SellerController as AdminSellerController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Admin\VerificationController as AdminVerificationController;
use App\Http\Controllers\Api\V1\AddressController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ComplaintController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\MyProgramRegistrationController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentWebhookController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ProgramController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Api\V1\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Api\V1\Seller\ProductImageController as SellerProductImageController;
use App\Http\Controllers\Api\V1\Seller\ProfileController as SellerProfileController;
use App\Http\Controllers\Api\V1\Seller\VerificationController as SellerVerificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Autentikasi & akun
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::put('profile', [AccountController::class, 'updateProfile']);
            Route::put('password', [AccountController::class, 'changePassword'])->middleware('throttle:5,1');
        });
    });

    // Publik
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{slug}', [ProductController::class, 'show']);
    Route::get('products/{slug}/reviews', [ProductController::class, 'reviews']);
    Route::get('programs', [ProgramController::class, 'index']);
    Route::get('programs/{slug}', [ProgramController::class, 'show']);
    Route::get('events', [EventController::class, 'index']);
    Route::get('events/{slug}', [EventController::class, 'show']);
    Route::post('complaints', [ComplaintController::class, 'store'])->middleware('throttle:10,1');

    // Callback gateway pembayaran (diverifikasi HMAC, bukan token)
    Route::post('payments/webhook', PaymentWebhookController::class)->middleware('throttle:60,1');

    // Semua pengguna login
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/read-all', [NotificationController::class, 'markAllRead']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'markRead']);
    });

    // Program (penjual & pembeli)
    Route::middleware(['auth:sanctum', 'role:penjual,pembeli'])->group(function () {
        Route::post('programs/{id}/register', [ProgramController::class, 'register'])->whereNumber('id')->middleware('throttle:10,1');
        Route::get('program-registrations', [MyProgramRegistrationController::class, 'index']);
        Route::post('program-registrations/{id}/cancel', [MyProgramRegistrationController::class, 'cancel'])->whereNumber('id');
    });

    // Penjual
    Route::prefix('seller')->middleware(['auth:sanctum', 'role:penjual'])->group(function () {
        Route::get('profile', [SellerProfileController::class, 'show']);
        Route::put('profile', [SellerProfileController::class, 'update']);
        Route::post('profile/{type}', [SellerProfileController::class, 'uploadImage'])->where('type', 'logo|banner')->middleware('throttle:20,1');

        Route::get('products', [SellerProductController::class, 'index']);
        Route::post('products', [SellerProductController::class, 'store']);
        Route::put('products/{product}', [SellerProductController::class, 'update']);
        Route::delete('products/{product}', [SellerProductController::class, 'destroy']);
        Route::post('products/{product}/images', [SellerProductImageController::class, 'store'])->middleware('throttle:30,1');
        Route::delete('products/{product}/images/{image}', [SellerProductImageController::class, 'destroy'])->whereNumber('image');
        Route::patch('products/{product}/images/{image}/primary', [SellerProductImageController::class, 'setPrimary'])->whereNumber('image');

        Route::get('orders', [SellerOrderController::class, 'index']);
        Route::get('orders/{id}', [SellerOrderController::class, 'show'])->whereNumber('id');
        Route::patch('orders/{id}/status', [SellerOrderController::class, 'updateStatus'])->whereNumber('id');

        Route::get('verifications', [SellerVerificationController::class, 'index']);
        Route::post('verifications', [SellerVerificationController::class, 'store'])->middleware('throttle:10,1');
    });

    // Pembeli
    Route::middleware(['auth:sanctum', 'role:pembeli'])->group(function () {
        Route::get('addresses', [AddressController::class, 'index']);
        Route::post('addresses', [AddressController::class, 'store']);
        Route::put('addresses/{id}', [AddressController::class, 'update'])->whereNumber('id');
        Route::delete('addresses/{id}', [AddressController::class, 'destroy'])->whereNumber('id');

        Route::get('orders', [OrderController::class, 'index']);
        Route::post('orders', [OrderController::class, 'store'])->middleware('throttle:20,1');
        Route::get('orders/{orderNumber}', [OrderController::class, 'show']);
        Route::post('orders/{orderNumber}/cancel', [OrderController::class, 'cancel']);
        Route::post('orders/{orderNumber}/seller-orders/{sellerOrder}/received', [OrderController::class, 'received'])->whereNumber('sellerOrder');

        Route::post('reviews', [ReviewController::class, 'store'])->middleware('throttle:20,1');
    });

    // Admin
    Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::get('dashboard', AdminDashboardController::class);
        Route::get('users', [AdminUserController::class, 'index']);
        Route::patch('users/{user}/status', [AdminUserController::class, 'updateStatus']);

        Route::get('sellers', [AdminSellerController::class, 'index']);
        Route::patch('sellers/{seller}/verification', [AdminSellerController::class, 'updateVerification']);
        Route::get('sellers/{seller}/verifications', [AdminVerificationController::class, 'index']);
        Route::get('verifications/{verification}/document', [AdminVerificationController::class, 'download']);

        Route::get('products', [AdminProductController::class, 'index']);
        Route::patch('products/{product}/moderation', [AdminProductController::class, 'moderate']);

        Route::get('orders', [AdminOrderController::class, 'index']);
        Route::patch('orders/{orderNumber}/payment', [AdminOrderController::class, 'updatePayment']);

        Route::get('programs', [AdminProgramController::class, 'index']);
        Route::post('programs', [AdminProgramController::class, 'store']);
        Route::put('programs/{id}', [AdminProgramController::class, 'update'])->whereNumber('id');
        Route::get('programs/{id}/registrations', [AdminProgramRegistrationController::class, 'index'])->whereNumber('id');
        Route::patch('program-registrations/{registration}', [AdminProgramRegistrationController::class, 'update']);

        Route::get('events', [AdminEventController::class, 'index']);
        Route::post('events', [AdminEventController::class, 'store']);
        Route::put('events/{id}', [AdminEventController::class, 'update'])->whereNumber('id');
        Route::delete('events/{id}', [AdminEventController::class, 'destroy'])->whereNumber('id');

        Route::get('complaints', [AdminComplaintController::class, 'index']);
        Route::get('complaints/{id}', [AdminComplaintController::class, 'show'])->whereNumber('id');
        Route::patch('complaints/{id}/status', [AdminComplaintController::class, 'updateStatus'])->whereNumber('id');

        Route::get('activity-logs', [AdminActivityLogController::class, 'index']);
    });
});