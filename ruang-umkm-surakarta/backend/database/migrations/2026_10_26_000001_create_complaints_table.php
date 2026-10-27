<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $t) {
            $t->id();
            $t->string('ticket_number', 40)->unique();
            $t->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('complainant_name');
            $t->string('user_role', 20)->default('pembeli'); // pembeli, penjual, tamu
            $t->string('subject');
            $t->text('message');
            $t->string('priority', 20)->default('sedang'); // rendah, sedang, tinggi
            $t->string('status', 30)->default('baru'); // baru, dalam_penanganan, selesai
            $t->unsignedInteger('sla_hours_left')->default(48);
            $t->text('resolution_notes')->nullable();
            $t->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamp('resolved_at')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->index(['status', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
