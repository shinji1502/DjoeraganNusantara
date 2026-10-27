<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $t) {
            $t->id();
            $t->string('title');
            $t->string('slug')->unique();
            $t->text('description');
            $t->string('organizer');
            $t->string('location')->nullable();
            $t->date('start_date');
            $t->date('end_date');
            $t->date('registration_start')->nullable();
            $t->date('registration_end')->nullable();
            $t->unsignedInteger('quota')->nullable();
            $t->string('cover_image')->nullable();
            $t->string('status', 20)->default('draft');
            $t->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $t->timestamps();
            $t->softDeletes();
            $t->index(['status', 'start_date']);
        });
    }

    public function down(): void { Schema::dropIfExists('programs'); }
};