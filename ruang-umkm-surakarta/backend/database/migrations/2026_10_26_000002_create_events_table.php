<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $t) {
            $t->id();
            $t->string('title');
            $t->string('slug')->unique();
            $t->string('category', 50); // Bazzar, Pameran, Business Matching, Temu Usaha
            $t->date('event_date');
            $t->date('end_date')->nullable();
            $t->string('time', 50)->nullable(); // contoh: 08:00 - 15:00 WIB
            $t->string('location');
            $t->string('organizer');
            $t->string('status', 20)->default('Mendatang'); // Mendatang, Berlangsung, Selesai
            $t->string('image')->nullable();
            $t->text('description');
            $t->unsignedInteger('quota')->nullable();
            $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamps();
            $t->softDeletes();
            $t->index(['status', 'event_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
