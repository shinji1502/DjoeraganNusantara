<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $t) {
            $t->decimal('original_price', 15, 2)->nullable()->after('price');
            $t->json('certifications')->nullable()->after('description');
            $t->string('district', 100)->nullable()->after('unit')->index();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $t) {
            $t->dropColumn(['original_price', 'certifications', 'district']);
        });
    }
};
