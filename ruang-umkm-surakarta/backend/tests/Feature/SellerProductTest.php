<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesFixtures;
use Tests\TestCase;

class SellerProductTest extends TestCase
{
    use RefreshDatabase, CreatesFixtures;

    private function payload(array $extra = []): array
    {
        return array_merge([
            'name' => 'Produk Uji',
            'description' => 'Deskripsi produk uji.',
            'price' => 50000,
            'stock' => 10,
            'unit' => 'pcs',
        ], $extra);
    }

    public function test_penjual_bisa_membuat_produk_berstatus_draft(): void
    {
        $seller = $this->makeSeller();
        Sanctum::actingAs($seller->user);

        $this->postJson('/api/v1/seller/products', $this->payload())
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft');

        $this->assertDatabaseHas('products', ['name' => 'Produk Uji', 'seller_profile_id' => $seller->id]);
    }

    public function test_seller_profile_id_dari_request_diabaikan(): void
    {
        $me = $this->makeSeller();
        $other = $this->makeSeller();
        Sanctum::actingAs($me->user);

        $this->postJson('/api/v1/seller/products', $this->payload(['seller_profile_id' => $other->id]))
            ->assertCreated();

        $this->assertSame($me->id, Product::where('name', 'Produk Uji')->value('seller_profile_id'));
    }

    public function test_penjual_tidak_bisa_mengubah_produk_penjual_lain(): void
    {
        $me = $this->makeSeller();
        $other = $this->makeSeller();
        $product = $this->makeProduct($other, ['name' => 'Milik Orang Lain']);
        Sanctum::actingAs($me->user);

        $this->putJson("/api/v1/seller/products/{$product->id}", $this->payload())->assertForbidden();

        $this->assertSame('Milik Orang Lain', $product->fresh()->name);
    }

    public function test_penjual_tidak_bisa_menghapus_produk_penjual_lain(): void
    {
        $me = $this->makeSeller();
        $product = $this->makeProduct($this->makeSeller());
        Sanctum::actingAs($me->user);

        $this->deleteJson("/api/v1/seller/products/{$product->id}")->assertForbidden();

        $this->assertNotSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_penjual_tidak_bisa_memaksa_status_published(): void
    {
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller, ['status' => 'draft']);
        Sanctum::actingAs($seller->user);

        $this->putJson("/api/v1/seller/products/{$product->id}", $this->payload(['status' => 'published']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');

        $this->assertSame('draft', $product->fresh()->status);
    }

    public function test_harga_dan_stok_negatif_ditolak(): void
    {
        Sanctum::actingAs($this->makeSeller()->user);

        $this->postJson('/api/v1/seller/products', $this->payload(['price' => -5]))
            ->assertStatus(422)->assertJsonValidationErrors('price');

        $this->postJson('/api/v1/seller/products', $this->payload(['stock' => -1]))
            ->assertStatus(422)->assertJsonValidationErrors('stock');
    }

    public function test_hapus_produk_memakai_soft_delete(): void
    {
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        Sanctum::actingAs($seller->user);

        $this->deleteJson("/api/v1/seller/products/{$product->id}")->assertOk();

        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_pembeli_tidak_bisa_mengakses_area_penjual(): void
    {
        Sanctum::actingAs($this->makeUser('pembeli'));

        $this->getJson('/api/v1/seller/products')->assertForbidden();
    }

    public function test_daftar_produk_penjual_hanya_milik_sendiri(): void
    {
        $me = $this->makeSeller();
        $this->makeProduct($me, ['name' => 'Punya Saya']);
        $this->makeProduct($this->makeSeller(), ['name' => 'Punya Orang']);
        Sanctum::actingAs($me->user);

        $names = collect($this->getJson('/api/v1/seller/products')->assertOk()->json('data'))->pluck('name');

        $this->assertSame(['Punya Saya'], $names->all());
    }

    public function test_produk_draft_tidak_muncul_di_katalog_publik(): void
    {
        $seller = $this->makeSeller();
        $this->makeProduct($seller, ['name' => 'Tampil', 'status' => 'published']);
        $this->makeProduct($seller, ['name' => 'Tersembunyi', 'status' => 'draft']);

        $names = collect($this->getJson('/api/v1/products')->assertOk()->json('data'))->pluck('name');

        $this->assertTrue($names->contains('Tampil'));
        $this->assertFalse($names->contains('Tersembunyi'));
    }
}