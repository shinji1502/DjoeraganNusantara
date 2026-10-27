<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $t) {
            $t->id();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->string('image_path');
            $t->string('alt_text')->nullable();
            $t->unsignedSmallInteger('sort_order')->default(0);
            $t->boolean('is_primary')->default(false);
            $t->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('product_images'); }
};