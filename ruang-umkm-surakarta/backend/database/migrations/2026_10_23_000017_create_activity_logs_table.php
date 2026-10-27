<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('action', 100)->index();
            $t->string('entity_type', 100)->nullable();
            $t->unsignedBigInteger('entity_id')->nullable();
            $t->text('description');
            $t->string('ip_address', 45)->nullable();
            $t->string('user_agent', 255)->nullable();
            $t->json('metadata')->nullable();
            $t->timestamp('created_at')->useCurrent();
            $t->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void { Schema::dropIfExists('activity_logs'); }
};