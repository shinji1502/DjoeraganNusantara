<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('order_id')->constrained()->restrictOnDelete();
            $t->string('payment_reference', 100)->nullable()->unique();
            $t->string('payment_method', 50);
            $t->decimal('amount', 15, 2);
            $t->string('status', 20)->default('pending');
            $t->timestamp('paid_at')->nullable();
            $t->timestamp('expired_at')->nullable();
            $t->string('provider', 50)->nullable();
            $t->string('provider_transaction_id', 100)->nullable()->index();
            $t->json('metadata')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('payments'); }
};