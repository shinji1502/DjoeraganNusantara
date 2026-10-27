<?php

namespace Tests\Feature;

use App\Models\ProductImage;
use App\Models\Verification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesFixtures;
use Tests\TestCase;

class UploadTest extends TestCase
{
    use RefreshDatabase, CreatesFixtures;

    private const JSON = ['Accept' => 'application/json'];

    private function png(string $name = 'foto.png'): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
        ));
    }

    public function test_penjual_mengunggah_gambar_produk_dan_gambar_pertama_jadi_utama(): void
    {
        Storage::fake('public');
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        Sanctum::actingAs($seller->user);

        $this->post("/api/v1/seller/products/{$product->id}/images", ['images' => [$this->png('a.png'), $this->png('b.png')]], self::JSON)
            ->assertCreated()
            ->assertJsonCount(2, 'data.images');

        $images = ProductImage::where('product_id', $product->id)->orderBy('sort_order')->get();
        $this->assertTrue($images[0]->is_primary);
        $this->assertFalse($images[1]->is_primary);
        $this->assertTrue(Storage::disk('public')->exists($images[0]->image_path));
        $this->assertStringNotContainsString('a.png', $images[0]->image_path); // nama klien tidak dipakai
    }

    public function test_penjual_lain_tidak_bisa_mengunggah_ke_produk_orang(): void
    {
        Storage::fake('public');
        $product = $this->makeProduct($this->makeSeller());
        Sanctum::actingAs($this->makeSeller()->user);

        $this->post("/api/v1/seller/products/{$product->id}/images", ['images' => [$this->png()]], self::JSON)->assertForbidden();

        $this->assertSame(0, ProductImage::count());
    }

    public function test_file_bukan_gambar_dan_svg_ditolak(): void
    {
        Storage::fake('public');
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        Sanctum::actingAs($seller->user);
        $url = "/api/v1/seller/products/{$product->id}/images";

        $pdf = UploadedFile::fake()->create('dokumen.pdf', 50, 'application/pdf');
        $svg = UploadedFile::fake()->createWithContent('x.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $this->post($url, ['images' => [$pdf]], self::JSON)->assertStatus(422);
        $this->post($url, ['images' => [$svg]], self::JSON)->assertStatus(422);
        $this->assertSame(0, ProductImage::count());
    }

    public function test_batas_delapan_gambar_per_produk(): void
    {
        Storage::fake('public');
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        for ($i = 0; $i < 8; $i++) {
            ProductImage::create(['product_id' => $product->id, 'image_path' => "products/x/$i.png", 'sort_order' => $i, 'is_primary' => $i === 0]);
        }
        Sanctum::actingAs($seller->user);

        $this->post("/api/v1/seller/products/{$product->id}/images", ['images' => [$this->png()]], self::JSON)
            ->assertStatus(422)
            ->assertJsonValidationErrors('images');
    }

    public function test_hapus_gambar_utama_menghapus_file_dan_mempromosikan_berikutnya(): void
    {
        Storage::fake('public');
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        Sanctum::actingAs($seller->user);

        $this->post("/api/v1/seller/products/{$product->id}/images", ['images' => [$this->png(), $this->png()]], self::JSON)->assertCreated();
        [$first, $second] = ProductImage::where('product_id', $product->id)->orderBy('sort_order')->get()->all();

        $this->deleteJson("/api/v1/seller/products/{$product->id}/images/{$first->id}")->assertOk();

        $this->assertFalse(Storage::disk('public')->exists($first->image_path));
        $this->assertTrue($second->fresh()->is_primary);
    }

    public function test_ganti_gambar_utama(): void
    {
        Storage::fake('public');
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        Sanctum::actingAs($seller->user);

        $this->post("/api/v1/seller/products/{$product->id}/images", ['images' => [$this->png(), $this->png()]], self::JSON)->assertCreated();
        [$first, $second] = ProductImage::where('product_id', $product->id)->orderBy('sort_order')->get()->all();

        $this->patchJson("/api/v1/seller/products/{$product->id}/images/{$second->id}/primary")->assertOk();

        $this->assertFalse($first->fresh()->is_primary);
        $this->assertTrue($second->fresh()->is_primary);
    }

    public function test_hapus_permanen_produk_membersihkan_file_gambar(): void
    {
        Storage::fake('public');
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        Sanctum::actingAs($seller->user);

        $this->post("/api/v1/seller/products/{$product->id}/images", ['images' => [$this->png()]], self::JSON)->assertCreated();
        $path = ProductImage::where('product_id', $product->id)->value('image_path');
        $this->assertTrue(Storage::disk('public')->exists($path));

        $product->fresh()->forceDelete();

        $this->assertFalse(Storage::disk('public')->exists($path));
        $this->assertSame(0, ProductImage::count());
    }

    public function test_penjual_mengunggah_logo(): void
    {
        Storage::fake('public');
        $seller = $this->makeSeller();
        Sanctum::actingAs($seller->user);

        $this->post('/api/v1/seller/profile/logo', ['image' => $this->png()], self::JSON)->assertOk();

        $path = $seller->fresh()->logo;
        $this->assertNotNull($path);
        $this->assertTrue(Storage::disk('public')->exists($path));

        $this->post('/api/v1/seller/profile/bukan-valid', ['image' => $this->png()], self::JSON)->assertNotFound();
    }

    public function test_dokumen_verifikasi_disimpan_privat_dan_status_kembali_pending(): void
    {
        Storage::fake('local');
        Storage::fake('public');
        $seller = $this->makeSeller(['verification_status' => 'rejected']);
        Sanctum::actingAs($seller->user);

        $res = $this->post('/api/v1/seller/verifications', [
            'document_type' => 'nib',
            'document' => UploadedFile::fake()->create('nib.pdf', 100, 'application/pdf'),
        ], self::JSON)->assertCreated();

        $this->assertStringNotContainsString('document_path', $res->getContent());
        $this->assertStringNotContainsString('verifications/', $res->getContent());

        $path = Verification::first()->document_path;
        $this->assertTrue(Storage::disk('local')->exists($path));
        $this->assertFalse(Storage::disk('public')->exists($path));
        $this->assertSame('pending', $seller->fresh()->verification_status);
    }

    public function test_dokumen_verifikasi_tipe_berbahaya_ditolak(): void
    {
        Storage::fake('local');
        $seller = $this->makeSeller();
        Sanctum::actingAs($seller->user);

        $this->post('/api/v1/seller/verifications', [
            'document_type' => 'nib',
            'document' => UploadedFile::fake()->create('shell.php', 10, 'application/x-php'),
        ], self::JSON)->assertStatus(422);
    }

    public function test_hanya_admin_yang_bisa_mengunduh_dokumen_dan_tercatat_di_log(): void
    {
        Storage::fake('local');
        $seller = $this->makeSeller();
        Sanctum::actingAs($seller->user);
        $this->post('/api/v1/seller/verifications', [
            'document_type' => 'ktp',
            'document' => UploadedFile::fake()->create('ktp.pdf', 100, 'application/pdf'),
        ], self::JSON)->assertCreated();
        $verification = Verification::first();

        // pemilik sendiri dan penjual lain tidak boleh lewat endpoint admin
        $this->getJson("/api/v1/admin/verifications/{$verification->id}/document")->assertForbidden();
        Sanctum::actingAs($this->makeSeller()->user);
        $this->getJson("/api/v1/admin/verifications/{$verification->id}/document")->assertForbidden();

        $admin = $this->makeUser('admin');
        Sanctum::actingAs($admin);
        $this->get("/api/v1/admin/verifications/{$verification->id}/document", self::JSON)->assertOk();

        $this->assertDatabaseHas('activity_logs', ['action' => 'verification.document_viewed', 'user_id' => $admin->id]);
    }
}