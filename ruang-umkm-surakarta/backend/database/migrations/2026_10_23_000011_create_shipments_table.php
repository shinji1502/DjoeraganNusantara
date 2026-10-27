<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('order_id')->constrained()->restrictOnDelete();
            $t->foreignId('seller_order_id')->unique()->constrained()->restrictOnDelete();
            $t->string('courier', 50);
            $t->string('service', 50)->nullable();
            $t->string('tracking_number', 100)->nullable()->index();
            $t->decimal('shipping_cost', 15, 2)->default(0);
            $t->string('status', 20)->default('pending');
            $t->timestamp('shipped_at')->nullable();
            $t->timestamp('delivered_at')->nullable();
            $t->text('notes')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('shipments'); }
};