<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('order_id')->constrained()->restrictOnDelete();
            $t->foreignId('seller_order_id')->constrained()->restrictOnDelete();
            $t->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('seller_profile_id')->constrained()->restrictOnDelete();
            $t->string('product_name_snapshot');
            $t->string('product_sku_snapshot', 64)->nullable();
            $t->decimal('unit_price', 15, 2);
            $t->unsignedInteger('quantity');
            $t->decimal('subtotal', 15, 2);
            $t->timestamps();
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE order_items ADD CONSTRAINT chk_order_items_qty CHECK (quantity > 0)');
        }
    }

    public function down(): void { Schema::dropIfExists('order_items'); }
};