<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $t) {
            $t->id();
            $t->foreignId('seller_profile_id')->constrained()->restrictOnDelete();
            $t->foreignId('business_category_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->string('slug')->unique();
            $t->text('description');
            $t->string('sku', 64)->nullable()->unique();
            $t->decimal('price', 15, 2);
            $t->unsignedInteger('stock')->default(0);
            $t->unsignedInteger('weight')->nullable();
            $t->string('unit', 30)->nullable();
            $t->string('status', 20)->default('draft');
            $t->boolean('is_featured')->default(false);
            $t->timestamp('published_at')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->index(['status', 'published_at']);
            $t->index('name');
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE products ADD CONSTRAINT chk_products_price CHECK (price >= 0)');
        }
    }

    public function down(): void { Schema::dropIfExists('products'); }
};