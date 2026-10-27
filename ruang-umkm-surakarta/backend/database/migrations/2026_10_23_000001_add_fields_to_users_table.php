<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->string('phone', 20)->nullable()->after('email');
            $t->string('avatar')->nullable()->after('phone');
            $t->string('role', 20)->default('pembeli')->index()->after('password');
            $t->string('status', 20)->default('pending')->index()->after('role');
            $t->timestamp('last_login_at')->nullable();
            $t->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->dropSoftDeletes();
            $t->dropColumn(['phone', 'avatar', 'role', 'status', 'last_login_at']);
        });
    }
};