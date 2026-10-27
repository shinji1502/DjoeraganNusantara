<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\BusinessCategory;
use App\Models\Product;
use App\Models\Program;
use App\Models\ProgramRegistration;
use App\Models\SellerProfile;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use LogicException;
use Tests\Concerns\CreatesFixtures;
use Tests\TestCase;

class DatabaseIntegrityTest extends TestCase
{
    use RefreshDatabase, CreatesFixtures;

    public function test_semua_tabel_inti_berhasil_dibuat(): void
    {
        $tables = [
            'users', 'business_categories', 'seller_profiles', 'products', 'product_images',
            'addresses', 'orders', 'seller_orders', 'order_items', 'payments', 'shipments',
            'reviews', 'programs', 'program_registrations', 'verifications',
            'notifications', 'activity_logs',
        ];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table), "Tabel $table tidak ada.");
        }
    }

    public function test_password_disimpan_dalam_bentuk_hash(): void
    {
        $user = $this->makeUser();

        $this->assertNotSame('password123', $user->password);
        $this->assertTrue(Hash::isHashed($user->password));
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    public function test_email_user_harus_unik(): void
    {
        $this->makeUser('pembeli', ['email' => 'sama@test.local']);

        $this->expectException(QueryException::class);
        $this->makeUser('pembeli', ['email' => 'sama@test.local']);
    }

    public function test_satu_user_hanya_boleh_punya_satu_profil_penjual(): void
    {
        $seller = $this->makeSeller();

        $this->expectException(QueryException::class);
        SellerProfile::create([
            'user_id' => $seller->user_id,
            'business_name' => 'Usaha Kedua',
            'slug' => 'usaha-kedua',
            'owner_name' => 'X',
            'address' => 'Jl. X',
        ]);
    }

    public function test_harga_negatif_ditolak_database(): void
    {
        $this->skipUnlessMysql();
        $seller = $this->makeSeller();

        $this->expectException(QueryException::class);
        DB::table('products')->insert([
            'seller_profile_id' => $seller->id,
            'name' => 'Rusak',
            'slug' => 'rusak',
            'description' => 'x',
            'price' => -1,
            'stock' => 1,
        ]);
    }

    public function test_stok_tidak_bisa_negatif_di_database(): void
    {
        $product = $this->makeProduct($this->makeSeller(), ['stock' => 5]);

        $this->expectException(QueryException::class);
        DB::table('products')->where('id', $product->id)->update(['stock' => -1]);
    }

    public function test_pendaftaran_program_ganda_ditolak(): void
    {
        $admin = $this->makeUser('admin');
        $user = $this->makeUser();
        $program = Program::create([
            'title' => 'Pelatihan Uji',
            'slug' => 'pelatihan-uji',
            'description' => 'Deskripsi',
            'organizer' => 'Dinas',
            'start_date' => '2026-12-01',
            'end_date' => '2026-12-02',
            'status' => 'published',
            'created_by' => $admin->id,
        ]);

        ProgramRegistration::create([
            'program_id' => $program->id, 'user_id' => $user->id,
            'registration_number' => 'REG-0001', 'status' => 'pending', 'registered_at' => now(),
        ]);

        $this->expectException(QueryException::class);
        ProgramRegistration::create([
            'program_id' => $program->id, 'user_id' => $user->id,
            'registration_number' => 'REG-0002', 'status' => 'pending', 'registered_at' => now(),
        ]);
    }

    public function test_rating_review_1_sampai_5_dan_satu_review_per_item(): void
    {
        $this->skipUnlessMysql();

        $buyer = $this->makeUser();
        $product = $this->makeProduct($this->makeSeller());
        $order = app(OrderService::class)->create(
            $buyer,
            $this->makeAddress($buyer),
            [['product_id' => $product->id, 'quantity' => 1]],
            'cod'
        );
        $itemId = $order->items->first()->id;

        $row = fn (int $rating) => [
            'product_id' => $product->id,
            'buyer_id' => $buyer->id,
            'order_item_id' => $itemId,
            'rating' => $rating,
        ];

        try {
            DB::table('reviews')->insert($row(6));
            $this->fail('Rating 6 seharusnya ditolak.');
        } catch (QueryException $e) {
            $this->assertTrue(true);
        }

        DB::table('reviews')->insert($row(5));
        $this->assertSame(1, DB::table('reviews')->count());

        $this->expectException(QueryException::class);
        DB::table('reviews')->insert($row(4)); // ulasan ganda pada item yang sama
    }

    public function test_user_yang_punya_pesanan_tidak_bisa_dihapus_permanen(): void
    {
        $buyer = $this->makeUser();
        $product = $this->makeProduct($this->makeSeller());
        app(OrderService::class)->create(
            $buyer,
            $this->makeAddress($buyer),
            [['product_id' => $product->id, 'quantity' => 1]],
            'cod'
        );

        $this->expectException(QueryException::class);
        $buyer->forceDelete(); // orders.buyer_id memakai RESTRICT
    }

    public function test_seeder_dapat_dijalankan_berulang_tanpa_duplikasi(): void
    {
        $count = fn () => [
            'categories' => BusinessCategory::count(),
            'users' => User::withTrashed()->count(),
            'sellers' => SellerProfile::withTrashed()->count(),
            'products' => Product::withTrashed()->count(),
            'programs' => Program::withTrashed()->count(),
            'registrations' => ProgramRegistration::count(),
        ];

        $this->seed();
        $first = $count();
        $this->seed();
        $second = $count();

        $this->assertSame($first, $second);
        $this->assertSame(8, $first['categories']);
        $this->assertSame(7, $first['users']);
        $this->assertSame(6, $first['products']);
    }

    public function test_activity_log_tidak_boleh_diubah(): void
    {
        $log = ActivityLog::create(['action' => 'uji', 'description' => 'x']);

        $this->expectException(LogicException::class);
        $log->update(['action' => 'diubah']);
    }

    public function test_activity_log_tidak_boleh_dihapus(): void
    {
        $log = ActivityLog::create(['action' => 'uji', 'description' => 'x']);

        $this->expectException(LogicException::class);
        $log->delete();
    }

    private function skipUnlessMysql(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            $this->markTestSkipped('Constraint CHECK hanya diuji di MySQL/MariaDB.');
        }
    }
}