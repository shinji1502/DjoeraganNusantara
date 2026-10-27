<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('program_registrations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('program_id')->constrained()->restrictOnDelete();
            $t->foreignId('user_id')->constrained()->restrictOnDelete();
            $t->string('registration_number', 40)->unique();
            $t->string('status', 20)->default('pending');
            $t->timestamp('registered_at');
            $t->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamp('reviewed_at')->nullable();
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->unique(['program_id', 'user_id']);
            $t->index('status');
        });
    }

    public function down(): void { Schema::dropIfExists('program_registrations'); }
};