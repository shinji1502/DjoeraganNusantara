<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('seller_profiles', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->unique()->constrained()->restrictOnDelete();
            $t->string('business_name');
            $t->string('slug')->unique();
            $t->string('owner_name');
            $t->text('description')->nullable();
            $t->foreignId('business_category_id')->nullable()->constrained()->nullOnDelete();
            $t->string('phone', 20)->nullable();
            $t->string('email')->nullable();
            $t->text('address');
            $t->string('village', 100)->nullable();
            $t->string('district', 100)->nullable();
            $t->string('city', 100)->default('Surakarta');
            $t->string('province', 100)->default('Jawa Tengah');
            $t->string('postal_code', 10)->nullable();
            $t->decimal('latitude', 10, 7)->nullable();
            $t->decimal('longitude', 10, 7)->nullable();
            $t->string('logo')->nullable();
            $t->string('banner')->nullable();
            $t->string('verification_status', 20)->default('pending')->index();
            $t->timestamp('verified_at')->nullable();
            $t->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $t->text('rejection_reason')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->index('business_name');
        });
    }

    public function down(): void { Schema::dropIfExists('seller_profiles'); }
};