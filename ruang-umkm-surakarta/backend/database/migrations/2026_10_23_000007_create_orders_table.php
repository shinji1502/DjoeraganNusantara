<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $t) {
            $t->id();
            $t->string('order_number', 40)->unique();
            $t->foreignId('buyer_id')->constrained('users')->restrictOnDelete();
            $t->json('shipping_address');
            $t->decimal('subtotal', 15, 2);
            $t->decimal('shipping_cost', 15, 2)->default(0);
            $t->decimal('discount_amount', 15, 2)->default(0);
            $t->decimal('total_amount', 15, 2);
            $t->string('payment_status', 20)->default('unpaid');
            $t->string('order_status', 20)->default('pending');
            $t->text('buyer_notes')->nullable();
            $t->timestamp('ordered_at');
            $t->timestamp('cancelled_at')->nullable();
            $t->timestamp('completed_at')->nullable();
            $t->timestamps();
            $t->index(['buyer_id', 'order_status']);
            $t->index('payment_status');
        });
    }

    public function down(): void { Schema::dropIfExists('orders'); }
};