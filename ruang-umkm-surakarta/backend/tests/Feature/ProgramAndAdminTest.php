<?php

namespace Tests\Feature;

use App\Models\Program;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesFixtures;
use Tests\TestCase;

class ProgramAndAdminTest extends TestCase
{
    use RefreshDatabase, CreatesFixtures;

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

    public function test_pengguna_bisa_mendaftar_program(): void
    {
        $program = $this->program();
        Sanctum::actingAs($this->makeUser('penjual'));

        $this->postJson("/api/v1/programs/{$program->id}/register")
            ->assertCreated()
            ->assertJsonPath('data.status', 'pending');
    }

    public function test_pendaftaran_ganda_ditolak(): void
    {
        $program = $this->program();
        Sanctum::actingAs($this->makeUser());

        $this->postJson("/api/v1/programs/{$program->id}/register")->assertCreated();
        $this->postJson("/api/v1/programs/{$program->id}/register")->assertStatus(422);

        $this->assertDatabaseCount('program_registrations', 1);
    }

    public function test_kuota_penuh_menolak_pendaftar_berikutnya(): void
    {
        $program = $this->program(['quota' => 1]);

        Sanctum::actingAs($this->makeUser());
        $this->postJson("/api/v1/programs/{$program->id}/register")->assertCreated();

        Sanctum::actingAs($this->makeUser());
        $this->postJson("/api/v1/programs/{$program->id}/register")->assertStatus(422);

        $this->assertDatabaseCount('program_registrations', 1);
    }

    public function test_pendaftaran_ditutup_setelah_batas_waktu(): void
    {
        $program = $this->program(['registration_end' => now()->subDay()->toDateString()]);
        Sanctum::actingAs($this->makeUser());

        $this->postJson("/api/v1/programs/{$program->id}/register")->assertStatus(422);
    }

    public function test_program_draft_tidak_tampil_dan_tidak_bisa_didaftari(): void
    {
        $draft = $this->program(['title' => 'Program Rahasia', 'status' => 'draft']);

        $titles = collect($this->getJson('/api/v1/programs')->assertOk()->json('data'))->pluck('title');
        $this->assertFalse($titles->contains('Program Rahasia'));

        Sanctum::actingAs($this->makeUser());
        $this->postJson("/api/v1/programs/{$draft->id}/register")->assertStatus(422);
    }

    public function test_area_admin_ditolak_untuk_non_admin(): void
    {
        Sanctum::actingAs($this->makeUser('pembeli'));
        $this->getJson('/api/v1/admin/dashboard')->assertForbidden();

        Sanctum::actingAs($this->makeSeller()->user);
        $this->getJson('/api/v1/admin/users')->assertForbidden();
    }

    public function test_dashboard_admin_berhasil(): void
    {
        Sanctum::actingAs($this->makeUser('admin'));

        $this->getJson('/api/v1/admin/dashboard')
            ->assertOk()
            ->assertJsonStructure(['data' => ['users', 'sellers', 'products', 'orders', 'programs']]);
    }

    public function test_admin_menyetujui_penjual_dan_tercatat_di_log(): void
    {
        $admin = $this->makeUser('admin');
        $seller = $this->makeSeller(['verification_status' => 'pending']);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/sellers/{$seller->id}/verification", ['status' => 'approved'])
            ->assertOk()
            ->assertJsonPath('data.verification_status', 'approved');

        $fresh = $seller->fresh();
        $this->assertSame($admin->id, $fresh->verified_by);
        $this->assertNotNull($fresh->verified_at);
        $this->assertDatabaseHas('activity_logs', ['action' => 'seller.verification_updated', 'user_id' => $admin->id]);
    }

    public function test_penolakan_verifikasi_wajib_menyertakan_alasan(): void
    {
        $seller = $this->makeSeller(['verification_status' => 'pending']);
        Sanctum::actingAs($this->makeUser('admin'));

        $this->patchJson("/api/v1/admin/sellers/{$seller->id}/verification", ['status' => 'rejected'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('rejection_reason');

        $this->assertSame('pending', $seller->fresh()->verification_status);
    }

    public function test_admin_memoderasi_produk_menjadi_published(): void
    {
        $product = $this->makeProduct($this->makeSeller(), ['status' => 'pending']);
        Sanctum::actingAs($this->makeUser('admin'));

        $this->patchJson("/api/v1/admin/products/{$product->id}/moderation", ['status' => 'published'])
            ->assertOk();

        $this->assertSame('published', $product->fresh()->status);
        $this->assertNotNull($product->fresh()->published_at);
    }

    public function test_menangguhkan_akun_mencabut_token_dan_menolak_login(): void
    {
        $user = $this->makeUser('pembeli', ['email' => 'korban@test.local']);
        $user->createToken('uji');
        $this->assertDatabaseCount('personal_access_tokens', 1);

        Sanctum::actingAs($this->makeUser('admin'));
        $this->patchJson("/api/v1/admin/users/{$user->id}/status", ['status' => 'suspended'])->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->postJson('/api/v1/auth/login', ['email' => 'korban@test.local', 'password' => 'password123'])
            ->assertStatus(403);
    }

    public function test_admin_tidak_bisa_mengubah_status_akun_sendiri(): void
    {
        $admin = $this->makeUser('admin');
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$admin->id}/status", ['status' => 'suspended'])
            ->assertStatus(422);

        $this->assertSame('active', $admin->fresh()->status);
    }

    public function test_admin_membuat_program_dan_validasi_tanggal(): void
    {
        $admin = $this->makeUser('admin');
        Sanctum::actingAs($admin);

        $valid = [
            'title' => 'Pelatihan Baru',
            'description' => 'Deskripsi',
            'organizer' => 'Dinas',
            'start_date' => now()->addDays(10)->toDateString(),
            'end_date' => now()->addDays(11)->toDateString(),
            'quota' => 20,
            'status' => 'draft',
        ];

        $this->postJson('/api/v1/admin/programs', $valid)
            ->assertCreated()
            ->assertJsonPath('data.slug', 'pelatihan-baru');
        $this->assertSame($admin->id, Program::where('slug', 'pelatihan-baru')->value('created_by'));

        $this->postJson('/api/v1/admin/programs', array_merge($valid, [
            'end_date' => now()->addDays(5)->toDateString(),
        ]))->assertStatus(422)->assertJsonValidationErrors('end_date');

        $this->postJson('/api/v1/admin/programs', array_merge($valid, ['quota' => 0]))
            ->assertStatus(422)->assertJsonValidationErrors('quota');
    }

    public function test_log_aktivitas_hanya_bisa_dibaca_admin(): void
    {
        Sanctum::actingAs($this->makeUser('pembeli'));
        $this->getJson('/api/v1/admin/activity-logs')->assertForbidden();

        Sanctum::actingAs($this->makeUser('admin'));
        $this->getJson('/api/v1/admin/activity-logs')->assertOk()->assertJsonStructure(['data', 'meta']);
    }
}