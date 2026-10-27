<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('seller_orders', function (Blueprint $t) {
            $t->id();
            $t->foreignId('order_id')->constrained()->restrictOnDelete();
            $t->foreignId('seller_profile_id')->constrained()->restrictOnDelete();
            $t->decimal('subtotal', 15, 2);
            $t->decimal('shipping_cost', 15, 2)->default(0);
            $t->string('status', 20)->default('pending');
            $t->timestamps();
            $t->unique(['order_id', 'seller_profile_id']);
            $t->index(['seller_profile_id', 'status']);
        });
    }

    public function down(): void { Schema::dropIfExists('seller_orders'); }
};