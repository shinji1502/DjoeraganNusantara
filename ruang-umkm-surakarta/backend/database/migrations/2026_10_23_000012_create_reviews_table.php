<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $t) {
            $t->id();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->foreignId('buyer_id')->constrained('users')->restrictOnDelete();
            $t->foreignId('order_item_id')->unique()->constrained()->restrictOnDelete();
            $t->unsignedTinyInteger('rating');
            $t->text('comment')->nullable();
            $t->string('status', 20)->default('published');
            $t->timestamps();
            $t->index(['product_id', 'status']);
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE reviews ADD CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)');
        }
    }

    public function down(): void { Schema::dropIfExists('reviews'); }
};