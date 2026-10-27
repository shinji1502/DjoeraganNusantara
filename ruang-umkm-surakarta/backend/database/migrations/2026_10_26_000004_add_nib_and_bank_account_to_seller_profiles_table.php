<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('seller_profiles', function (Blueprint $t) {
            $t->string('nib', 30)->nullable()->after('owner_name');
            $t->string('business_scale', 20)->default('Mikro')->after('nib'); // Mikro, Kecil, Menengah
            $t->string('bank_name', 50)->nullable()->after('banner');
            $t->string('bank_account_number', 50)->nullable()->after('bank_name');
            $t->string('bank_account_holder', 100)->nullable()->after('bank_account_number');
        });
    }

    public function down(): void
    {
        Schema::table('seller_profiles', function (Blueprint $t) {
            $t->dropColumn(['nib', 'business_scale', 'bank_name', 'bank_account_number', 'bank_account_holder']);
        });
    }
};
