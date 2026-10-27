<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->string('recipient_name');
            $t->string('phone', 20);
            $t->text('address_line');
            $t->string('village', 100)->nullable();
            $t->string('district', 100)->nullable();
            $t->string('city', 100);
            $t->string('province', 100);
            $t->string('postal_code', 10)->nullable();
            $t->text('notes')->nullable();
            $t->boolean('is_default')->default(false);
            $t->timestamps();
            $t->index(['user_id', 'is_default']);
        });
    }

    public function down(): void { Schema::dropIfExists('addresses'); }
};