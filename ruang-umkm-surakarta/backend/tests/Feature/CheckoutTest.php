<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesFixtures;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase, CreatesFixtures;

    private function order(array $items, int $addressId, array $extra = [])
    {
        return $this->postJson('/api/v1/orders', array_merge([
            'address_id' => $addressId,
            'payment_method' => 'transfer_bank',
            'items' => $items,
        ], $extra));
    }

    public function test_total_dihitung_backend_dan_manipulasi_harga_diabaikan(): void
    {
        $a = $this->makeProduct($this->makeSeller(), ['price' => 100000, 'stock' => 10]);
        $b = $this->makeProduct($this->makeSeller(), ['price' => 25000, 'stock' => 10]);
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $res = $this->order([
            ['product_id' => $a->id, 'quantity' => 2, 'price' => 1],
            ['product_id' => $b->id, 'quantity' => 4, 'price' => 1],
        ], $address->id, ['total_amount' => 1, 'subtotal' => 1, 'payment_status' => 'paid'])
            ->assertCreated();

        // 2x100000 + 4x25000 = 300000 ; ongkir 2 penjual x 10000
        $this->assertEquals(300000, $res->json('data.subtotal'));
        $this->assertEquals(20000, $res->json('data.shipping_cost'));
        $this->assertEquals(320000, $res->json('data.total_amount'));
        $res->assertJsonPath('data.payment_status', 'pending');
        $res->assertJsonCount(2, 'data.seller_orders');
        $this->assertDatabaseCount('seller_orders', 2);
        $this->assertDatabaseHas('payments', ['status' => 'pending']);
    }

    public function test_stok_berkurang_setelah_checkout(): void
    {
        $product = $this->makeProduct($this->makeSeller(), ['stock' => 10]);
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $this->order([['product_id' => $product->id, 'quantity' => 3]], $address->id)->assertCreated();

        $this->assertSame(7, $product->fresh()->stock);
    }

    public function test_oversell_ditolak_dan_stok_tidak_berubah(): void
    {
        $product = $this->makeProduct($this->makeSeller(), ['stock' => 5]);
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $this->order([['product_id' => $product->id, 'quantity' => 6]], $address->id)
            ->assertStatus(422)
            ->assertJsonValidationErrors('items');

        $this->assertSame(5, $product->fresh()->stock);
        $this->assertSame(0, Order::count());
    }

    public function test_checkout_atomik_gagal_sebagian_membatalkan_semuanya(): void
    {
        $ok = $this->makeProduct($this->makeSeller(), ['stock' => 10]);
        $short = $this->makeProduct($this->makeSeller(), ['stock' => 1]);
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $this->order([
            ['product_id' => $ok->id, 'quantity' => 2],
            ['product_id' => $short->id, 'quantity' => 5],
        ], $address->id)->assertStatus(422);

        $this->assertSame(10, $ok->fresh()->stock);
        $this->assertSame(1, $short->fresh()->stock);
        $this->assertSame(0, Order::count());
        $this->assertDatabaseCount('order_items', 0);
        $this->assertDatabaseCount('payments', 0);
    }

    public function test_stok_tidak_pernah_negatif_pada_checkout_berturut_turut(): void
    {
        $product = $this->makeProduct($this->makeSeller(), ['stock' => 3]);
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $this->order([['product_id' => $product->id, 'quantity' => 2]], $address->id)->assertCreated();
        $this->order([['product_id' => $product->id, 'quantity' => 2]], $address->id)->assertStatus(422);

        $this->assertSame(1, $product->fresh()->stock);
    }

    public function test_harga_pesanan_adalah_snapshot(): void
    {
        $product = $this->makeProduct($this->makeSeller(), ['price' => 50000, 'name' => 'Nama Lama']);
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $this->order([['product_id' => $product->id, 'quantity' => 1]], $address->id)->assertCreated();

        $product->forceFill(['price' => 99000, 'name' => 'Nama Baru'])->save();

        $this->assertDatabaseHas('order_items', [
            'product_name_snapshot' => 'Nama Lama',
            'unit_price' => 50000,
        ]);
    }

    public function test_produk_draft_tidak_bisa_dipesan(): void
    {
        $product = $this->makeProduct($this->makeSeller(), ['status' => 'draft']);
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $this->order([['product_id' => $product->id, 'quantity' => 1]], $address->id)->assertStatus(422);
    }

    public function test_produk_dari_penjual_belum_terverifikasi_tidak_bisa_dipesan(): void
    {
        $product = $this->makeProduct($this->makeSeller(['verification_status' => 'pending']));
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $this->order([['product_id' => $product->id, 'quantity' => 1]], $address->id)->assertStatus(422);
    }

    public function test_alamat_milik_orang_lain_ditolak(): void
    {
        $product = $this->makeProduct($this->makeSeller());
        $buyer = $this->makeUser();
        $otherAddress = $this->makeAddress($this->makeUser());
        Sanctum::actingAs($buyer);

        $this->order([['product_id' => $product->id, 'quantity' => 1]], $otherAddress->id)
            ->assertStatus(422)
            ->assertJsonValidationErrors('address_id');
    }

    public function test_jumlah_nol_atau_negatif_ditolak(): void
    {
        $product = $this->makeProduct($this->makeSeller());
        $buyer = $this->makeUser();
        $address = $this->makeAddress($buyer);
        Sanctum::actingAs($buyer);

        $this->order([['product_id' => $product->id, 'quantity' => 0]], $address->id)->assertStatus(422);
        $this->order([['product_id' => $product->id, 'quantity' => -2]], $address->id)->assertStatus(422);
    }

    public function test_penjual_tidak_bisa_membeli_produk_sendiri(): void
    {
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller);
        $address = $this->makeAddress($seller->user);

        $this->expectException(ValidationException::class);
        app(OrderService::class)->create(
            $seller->user,
            $address,
            [['product_id' => $product->id, 'quantity' => 1]],
            'cod'
        );
    }

    public function test_pesanan_hanya_bisa_dilihat_pemiliknya(): void
    {
        $product = $this->makeProduct($this->makeSeller());
        $owner = $this->makeUser();
        $address = $this->makeAddress($owner);
        Sanctum::actingAs($owner);

        $number = $this->order([['product_id' => $product->id, 'quantity' => 1]], $address->id)
            ->assertCreated()
            ->json('data.order_number');

        $this->getJson("/api/v1/orders/$number")->assertOk();

        Sanctum::actingAs($this->makeUser());
        $this->getJson("/api/v1/orders/$number")->assertNotFound();

        $this->getJson('/api/v1/orders')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_penjual_tidak_bisa_checkout(): void
    {
        Sanctum::actingAs($this->makeSeller()->user);

        $this->getJson('/api/v1/orders')->assertForbidden();
    }

    public function test_checkout_tanpa_login_ditolak(): void
    {
        $this->postJson('/api/v1/orders', [])->assertUnauthorized();
    }
}