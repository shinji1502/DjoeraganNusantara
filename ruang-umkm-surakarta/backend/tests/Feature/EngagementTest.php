<?php

namespace Tests\Feature;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Program;
use App\Models\ProgramRegistration;
use App\Models\SellerOrder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesFixtures;
use Tests\Concerns\PlacesOrders;
use Tests\TestCase;

class EngagementTest extends TestCase
{
    use RefreshDatabase, CreatesFixtures, PlacesOrders;

    private function completedItem(User $buyer, Product $product): OrderItem
    {
        $order = $this->placeOrder($buyer, [['product_id' => $product->id, 'quantity' => 1]]);
        SellerOrder::where('order_id', $order->id)->update(['status' => 'completed']);

        return $order->items->first();
    }

    private function program(array $attrs = []): Program
    {
        return Program::create(array_merge([
            'title' => 'Program '.Str::random(4),
            'slug' => 'program-'.Str::lower(Str::random(6)),
            'description' => 'Deskripsi',
            'organizer' => 'Dinas',
            'start_date' => now()->addDays(30)->toDateString(),
            'end_date' => now()->addDays(31)->toDateString(),
            'quota' => null,
            'status' => 'published',
            'created_by' => $this->makeUser('admin')->id,
        ], $attrs));
    }

    // ---------- Ulasan ----------

    public function test_ulasan_setelah_pesanan_selesai_dan_tampil_publik_tanpa_data_pribadi(): void
    {
        $product = $this->makeProduct($this->makeSeller());
        $buyer = $this->makeUser('pembeli', ['name' => 'Dewi Lestari', 'email' => 'dewi.rahasia@test.local']);
        $item = $this->completedItem($buyer, $product);

        Sanctum::actingAs($buyer);
        $this->postJson('/api/v1/reviews', ['order_item_id' => $item->id, 'rating' => 5, 'comment' => 'Bagus sekali'])
            ->assertCreated();

        $body = $this->getJson("/api/v1/products/{$product->slug}/reviews")->assertOk()->getContent();
        $this->assertStringContainsString('Dewi', $body);
        $this->assertStringNotContainsString('Lestari', $body);
        $this->assertStringNotContainsString('dewi.rahasia', $body);

        $show = $this->getJson("/api/v1/products/{$product->slug}")->assertOk();
        $this->assertEquals(5, $show->json('data.rating_avg'));
        $this->assertEquals(1, $show->json('data.reviews_count'));
    }

    public function test_ulasan_sebelum_pesanan_diterima_ditolak(): void
    {
        $product = $this->makeProduct($this->makeSeller());
        $buyer = $this->makeUser();
        $order = $this->placeOrder($buyer, [['product_id' => $product->id, 'quantity' => 1]]);

        Sanctum::actingAs($buyer);
        $this->postJson('/api/v1/reviews', ['order_item_id' => $order->items->first()->id, 'rating' => 5])->assertStatus(422);
    }

    public function test_ulasan_ganda_dan_rating_di_luar_rentang_ditolak(): void
    {
        $product = $this->makeProduct($this->makeSeller());
        $buyer = $this->makeUser();
        $item = $this->completedItem($buyer, $product);
        Sanctum::actingAs($buyer);

        $this->postJson('/api/v1/reviews', ['order_item_id' => $item->id, 'rating' => 6])->assertStatus(422);
        $this->postJson('/api/v1/reviews', ['order_item_id' => $item->id, 'rating' => 0])->assertStatus(422);
        $this->postJson('/api/v1/reviews', ['order_item_id' => $item->id, 'rating' => 4])->assertCreated();
        $this->postJson('/api/v1/reviews', ['order_item_id' => $item->id, 'rating' => 5])->assertStatus(422);
    }

    public function test_tidak_bisa_mengulas_item_pesanan_orang_lain(): void
    {
        $product = $this->makeProduct($this->makeSeller());
        $item = $this->completedItem($this->makeUser(), $product);

        Sanctum::actingAs($this->makeUser());
        $this->postJson('/api/v1/reviews', ['order_item_id' => $item->id, 'rating' => 5])->assertNotFound();
    }

    // ---------- Notifikasi ----------

    public function test_penjual_menerima_notifikasi_pesanan_baru_lalu_menandai_dibaca(): void
    {
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        $this->placeOrder($this->makeUser(), [['product_id' => $product->id, 'quantity' => 1]]);

        Sanctum::actingAs($seller->user);
        $res = $this->getJson('/api/v1/notifications')->assertOk();
        $this->assertSame('order.new', $res->json('data.0.type'));
        $this->assertSame(1, $res->json('meta.unread_count'));

        $id = $res->json('data.0.id');
        $this->postJson("/api/v1/notifications/$id/read")->assertOk();
        $this->assertSame(0, $this->getJson('/api/v1/notifications')->json('meta.unread_count'));
    }

    public function test_notifikasi_orang_lain_tidak_bisa_dibaca_dan_tandai_semua(): void
    {
        $seller = $this->makeSeller();
        $this->placeOrder($this->makeUser(), [['product_id' => $this->makeProduct($seller)->id, 'quantity' => 1]]);
        $notificationId = $seller->user->notifications()->first()->id;

        Sanctum::actingAs($this->makeUser());
        $this->postJson("/api/v1/notifications/$notificationId/read")->assertNotFound();

        Sanctum::actingAs($seller->user);
        $this->postJson('/api/v1/notifications/read-all')->assertOk();
        $this->assertSame(0, $seller->user->unreadNotifications()->count());
    }

    public function test_hasil_verifikasi_penjual_mengirim_notifikasi(): void
    {
        $seller = $this->makeSeller(['verification_status' => 'pending']);

        Sanctum::actingAs($this->makeUser('admin'));
        $this->patchJson("/api/v1/admin/sellers/{$seller->id}/verification", ['status' => 'approved'])->assertOk();

        $types = $seller->user->notifications->map(fn ($n) => $n->data['type'] ?? null);
        $this->assertTrue($types->contains('seller.verification'));
    }

    // ---------- Akun ----------

    public function test_ubah_profil_tidak_mengubah_role_atau_email(): void
    {
        $user = $this->makeUser('pembeli', ['email' => 'tetap@test.local']);
        Sanctum::actingAs($user);

        $this->putJson('/api/v1/auth/profile', ['name' => 'Nama Baru', 'phone' => '0812345', 'role' => 'admin', 'email' => 'lain@test.local'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Nama Baru');

        $fresh = $user->fresh();
        $this->assertSame('pembeli', $fresh->role);
        $this->assertSame('tetap@test.local', $fresh->email);
    }

    public function test_ganti_password_wajib_password_lama_dan_mencabut_token_lain(): void
    {
        $user = $this->makeUser();
        $user->createToken('perangkat-lain');
        $current = $user->createToken('perangkat-ini')->plainTextToken;
        $this->assertSame(2, $user->tokens()->count());

        $this->withToken($current)->putJson('/api/v1/auth/password', [
            'current_password' => 'salah', 'password' => 'baru12345', 'password_confirmation' => 'baru12345',
        ])->assertStatus(422);

        $this->withToken($current)->putJson('/api/v1/auth/password', [
            'current_password' => 'password123', 'password' => 'baru12345', 'password_confirmation' => 'baru12345',
        ])->assertOk();

        $this->assertSame(1, $user->tokens()->count());
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('baru12345', $user->fresh()->password));
    }

    // ---------- Alamat ----------

    public function test_alamat_default_tetap_satu_dan_dipromosikan_saat_dihapus(): void
    {
        $user = $this->makeUser();
        Sanctum::actingAs($user);
        $payload = fn (string $name, bool $default = false) => [
            'recipient_name' => $name, 'phone' => '0812345', 'address_line' => 'Jl. Uji 1',
            'city' => 'Surakarta', 'province' => 'Jawa Tengah', 'is_default' => $default,
        ];

        $first = $this->postJson('/api/v1/addresses', $payload('Satu'))->assertCreated()->json('data.id');
        $second = $this->postJson('/api/v1/addresses', $payload('Dua', true))->assertCreated()->json('data.id');

        $this->assertSame(1, $user->addresses()->where('is_default', true)->count());
        $this->assertTrue($user->addresses()->find($second)->is_default);

        $this->deleteJson("/api/v1/addresses/$second")->assertOk();
        $this->assertTrue($user->addresses()->find($first)->is_default);
    }

    public function test_alamat_orang_lain_tidak_bisa_diubah_atau_dihapus(): void
    {
        $address = $this->makeAddress($this->makeUser());
        Sanctum::actingAs($this->makeUser());

        $this->deleteJson("/api/v1/addresses/{$address->id}")->assertNotFound();
        $this->putJson("/api/v1/addresses/{$address->id}", [
            'recipient_name' => 'X', 'phone' => '0812', 'address_line' => 'Y', 'city' => 'Z', 'province' => 'P',
        ])->assertNotFound();
    }

    // ---------- Pendaftaran program ----------

    public function test_admin_menyetujui_pendaftaran_dan_peserta_mendapat_notifikasi(): void
    {
        $program = $this->program();
        $user = $this->makeUser('penjual');
        $reg = ProgramRegistration::create([
            'program_id' => $program->id, 'user_id' => $user->id,
            'registration_number' => 'REG-T1', 'status' => 'pending', 'registered_at' => now(),
        ]);

        Sanctum::actingAs($this->makeUser('admin'));
        $this->patchJson("/api/v1/admin/program-registrations/{$reg->id}", ['status' => 'approved'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $types = $user->notifications->map(fn ($n) => $n->data['type'] ?? null);
        $this->assertTrue($types->contains('program.registration'));
    }

    public function test_penolakan_wajib_catatan_dan_transisi_tidak_valid_ditolak(): void
    {
        $program = $this->program();
        $reg = ProgramRegistration::create([
            'program_id' => $program->id, 'user_id' => $this->makeUser()->id,
            'registration_number' => 'REG-T2', 'status' => 'pending', 'registered_at' => now(),
        ]);

        Sanctum::actingAs($this->makeUser('admin'));
        $this->patchJson("/api/v1/admin/program-registrations/{$reg->id}", ['status' => 'rejected'])
            ->assertStatus(422)->assertJsonValidationErrors('notes');
        $this->patchJson("/api/v1/admin/program-registrations/{$reg->id}", ['status' => 'completed'])->assertStatus(422);
        $this->assertSame('pending', $reg->fresh()->status);
    }

    public function test_pembatalan_pendaftaran_membebaskan_kuota(): void
    {
        $program = $this->program(['quota' => 1]);
        $first = $this->makeUser();
        $second = $this->makeUser();

        Sanctum::actingAs($first);
        $this->postJson("/api/v1/programs/{$program->id}/register")->assertCreated();
        $regId = ProgramRegistration::where('user_id', $first->id)->value('id');

        Sanctum::actingAs($second);
        $this->postJson("/api/v1/programs/{$program->id}/register")->assertStatus(422);

        Sanctum::actingAs($first);
        $this->getJson('/api/v1/program-registrations')->assertOk()->assertJsonCount(1, 'data');
        $this->postJson("/api/v1/program-registrations/$regId/cancel")->assertOk();

        Sanctum::actingAs($second);
        $this->postJson("/api/v1/programs/{$program->id}/register")->assertCreated();
    }

    public function test_pendaftaran_orang_lain_tidak_bisa_dibatalkan(): void
    {
        $program = $this->program();
        $reg = ProgramRegistration::create([
            'program_id' => $program->id, 'user_id' => $this->makeUser()->id,
            'registration_number' => 'REG-T3', 'status' => 'pending', 'registered_at' => now(),
        ]);

        Sanctum::actingAs($this->makeUser());
        $this->postJson("/api/v1/program-registrations/{$reg->id}/cancel")->assertNotFound();
    }
}