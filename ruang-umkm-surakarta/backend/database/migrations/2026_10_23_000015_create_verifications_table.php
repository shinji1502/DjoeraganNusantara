<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('verifications', function (Blueprint $t) {
            $t->id();
            $t->foreignId('seller_profile_id')->constrained()->restrictOnDelete();
            $t->foreignId('submitted_by')->constrained('users')->restrictOnDelete();
            $t->string('document_type', 50);
            $t->string('document_path');
            $t->string('status', 20)->default('pending');
            $t->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamp('reviewed_at')->nullable();
            $t->text('rejection_reason')->nullable();
            $t->timestamps();
            $t->index(['seller_profile_id', 'status']);
        });
    }

    public function down(): void { Schema::dropIfExists('verifications'); }
};