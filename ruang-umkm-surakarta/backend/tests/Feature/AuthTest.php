<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesFixtures;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase, CreatesFixtures;

    private function payload(array $extra = []): array
    {
        return array_merge([
            'name' => 'Pengguna Baru',
            'email' => 'baru@test.local',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
            'role' => 'pembeli',
        ], $extra);
    }

    public function test_registrasi_pembeli_berhasil_dan_password_di_hash(): void
    {
        $this->postJson('/api/v1/auth/register', $this->payload())
            ->assertCreated()
            ->assertJsonStructure(['message', 'data' => ['user' => ['id', 'email', 'role'], 'token']]);

        $user = User::where('email', 'baru@test.local')->firstOrFail();
        $this->assertSame('pembeli', $user->role);
        $this->assertTrue(Hash::check('rahasia123', $user->password));
    }

    public function test_admin_tidak_bisa_mendaftar_lewat_api_publik(): void
    {
        $this->postJson('/api/v1/auth/register', $this->payload(['role' => 'admin']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('role');

        $this->assertDatabaseMissing('users', ['email' => 'baru@test.local']);
    }

    public function test_status_dari_request_tidak_dipakai(): void
    {
        $this->postJson('/api/v1/auth/register', $this->payload(['status' => 'suspended', 'role' => 'pembeli']))
            ->assertCreated();

        $this->assertSame('active', User::where('email', 'baru@test.local')->value('status'));
    }

    public function test_registrasi_penjual_membuat_profil_dengan_status_pending(): void
    {
        $this->postJson('/api/v1/auth/register', $this->payload([
            'role' => 'penjual',
            'business_name' => 'Warung Baru',
            'address' => 'Jl. Baru No. 1',
        ]))->assertCreated();

        $this->assertDatabaseHas('seller_profiles', [
            'business_name' => 'Warung Baru',
            'verification_status' => 'pending',
        ]);
    }

    public function test_registrasi_penjual_wajib_nama_usaha(): void
    {
        $this->postJson('/api/v1/auth/register', $this->payload(['role' => 'penjual']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['business_name', 'address']);
    }

    public function test_email_duplikat_ditolak(): void
    {
        $this->makeUser('pembeli', ['email' => 'baru@test.local']);

        $this->postJson('/api/v1/auth/register', $this->payload())
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_login_berhasil_mengembalikan_token(): void
    {
        $this->makeUser('pembeli', ['email' => 'user@test.local']);

        $this->postJson('/api/v1/auth/login', ['email' => 'user@test.local', 'password' => 'password123'])
            ->assertOk()
            ->assertJsonStructure(['data' => ['token', 'user']]);

        $this->assertNotNull(User::where('email', 'user@test.local')->value('last_login_at'));
    }

    public function test_login_dengan_password_salah_ditolak(): void
    {
        $this->makeUser('pembeli', ['email' => 'user@test.local']);

        $this->postJson('/api/v1/auth/login', ['email' => 'user@test.local', 'password' => 'salah'])
            ->assertStatus(422);
    }

    public function test_akun_suspended_tidak_bisa_login(): void
    {
        $this->makeUser('pembeli', ['email' => 'user@test.local', 'status' => 'suspended']);

        $this->postJson('/api/v1/auth/login', ['email' => 'user@test.local', 'password' => 'password123'])
            ->assertStatus(403);
    }

    public function test_me_tanpa_token_ditolak_dengan_json_401(): void
    {
        $this->getJson('/api/v1/auth/me')
            ->assertStatus(401)
            ->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_me_dengan_login_mengembalikan_data_sendiri(): void
    {
        $user = $this->makeUser('pembeli');
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_logout_mencabut_token(): void
    {
        $this->makeUser('pembeli', ['email' => 'user@test.local']);

        $token = $this->postJson('/api/v1/auth/login', ['email' => 'user@test.local', 'password' => 'password123'])
            ->json('data.token');

        $this->assertDatabaseCount('personal_access_tokens', 1);

        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_password_tidak_pernah_muncul_di_respons(): void
    {
        $user = $this->makeUser('pembeli');
        Sanctum::actingAs($user);

        $body = $this->getJson('/api/v1/auth/me')->getContent();

        $this->assertStringNotContainsString('password', $body);
        $this->assertStringNotContainsString('remember_token', $body);
    }
}