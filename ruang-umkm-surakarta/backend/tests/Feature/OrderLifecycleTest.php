<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesFixtures;
use Tests\Concerns\PlacesOrders;
use Tests\TestCase;

class OrderLifecycleTest extends TestCase
{
    use RefreshDatabase, CreatesFixtures, PlacesOrders;

    private function scenario(string $method = 'transfer_bank', int $stock = 10): array
    {
        $seller = $this->makeSeller();
        $product = $this->makeProduct($seller, ['price' => 50000, 'stock' => $stock]);
        $buyer = $this->makeUser();
        $order = $this->placeOrder($buyer, [['product_id' => $product->id, 'quantity' => 2]], $method);

        return [$seller, $product, $buyer, $order, $order->sellerOrders->first()];
    }

    private function updateSellerOrderStatus(int $id, string $status, array $extra = [])
    {
        return $this->patchJson("/api/v1/seller/orders/$id/status", array_merge(['status' => $status], $extra));
    }

    private function adminPays(Order $order): void
    {
        Sanctum::actingAs($this->makeUser('admin'));
        $this->patchJson("/api/v1/admin/orders/{$order->order_number}/payment", ['status' => 'paid'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'paid');
    }

    private function webhook(array $payload, string $secret = 'rahasia', ?string $signature = null)
    {
        $json = json_encode($payload);

        return $this->call('POST', '/api/v1/payments/webhook', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_X_SIGNATURE' => $signature ?? hash_hmac('sha256', $json, $secret),
        ], $json);
    }

    public function test_pembeli_membatalkan_pesanan_belum_dibayar_dan_stok_kembali(): void
    {
        [, $product, $buyer, $order] = $this->scenario();
        $this->assertSame(8, $product->fresh()->stock);

        Sanctum::actingAs($buyer);
        $this->postJson("/api/v1/orders/{$order->order_number}/cancel")
            ->assertOk()
            ->assertJsonPath('data.order_status', 'cancelled');

        $this->assertSame(10, $product->fresh()->stock);
        $this->assertDatabaseHas('seller_orders', ['order_id' => $order->id, 'status' => 'cancelled']);
        $this->assertDatabaseHas('payments', ['order_id' => $order->id, 'status' => 'cancelled']);

        // idempoten: stok tidak bertambah dua kali
        $this->postJson("/api/v1/orders/{$order->order_number}/cancel")->assertOk();
        $this->assertSame(10, $product->fresh()->stock);
    }

    public function test_pesanan_yang_sudah_dibayar_tidak_bisa_dibatalkan_pembeli(): void
    {
        [, $product, $buyer, $order] = $this->scenario();
        $this->adminPays($order);

        Sanctum::actingAs($buyer);
        $this->postJson("/api/v1/orders/{$order->order_number}/cancel")->assertStatus(422);

        $this->assertSame(8, $product->fresh()->stock);
    }

    public function test_pembeli_lain_tidak_bisa_membatalkan_pesanan_orang(): void
    {
        [, , , $order] = $this->scenario();

        Sanctum::actingAs($this->makeUser());
        $this->postJson("/api/v1/orders/{$order->order_number}/cancel")->assertNotFound();
    }

    public function test_alur_lengkap_dibayar_diproses_dikirim_diterima(): void
    {
        [$seller, , $buyer, $order, $so] = $this->scenario();
        $this->adminPays($order);

        Sanctum::actingAs($seller->user);
        $this->updateSellerOrderStatus($so->id, 'confirmed')->assertOk()->assertJsonPath('data.status', 'confirmed');
        $this->updateSellerOrderStatus($so->id, 'processing')->assertOk();
        $this->updateSellerOrderStatus($so->id, 'shipped')->assertStatus(422)->assertJsonValidationErrors('courier');
        $this->updateSellerOrderStatus($so->id, 'shipped', ['courier' => 'JNE', 'service' => 'REG', 'tracking_number' => 'JNE123'])
            ->assertOk()
            ->assertJsonPath('data.shipment.courier', 'JNE');

        $this->assertDatabaseHas('shipments', ['seller_order_id' => $so->id, 'status' => 'shipped', 'tracking_number' => 'JNE123']);
        $this->assertSame('shipped', $order->fresh()->order_status);

        Sanctum::actingAs($buyer);
        $this->postJson("/api/v1/orders/{$order->order_number}/seller-orders/{$so->id}/received")
            ->assertOk()
            ->assertJsonPath('data.order_status', 'completed');

        $this->assertDatabaseHas('shipments', ['seller_order_id' => $so->id, 'status' => 'delivered']);
        $this->assertNotNull($order->fresh()->completed_at);
    }

    public function test_penjual_tidak_bisa_konfirmasi_pesanan_belum_dibayar(): void
    {
        [$seller, , , , $so] = $this->scenario();

        Sanctum::actingAs($seller->user);
        $this->updateSellerOrderStatus($so->id, 'confirmed')->assertStatus(422);

        $this->assertSame('pending', $so->fresh()->status);
    }

    public function test_loncat_status_ditolak(): void
    {
        [$seller, , , $order, $so] = $this->scenario();
        $this->adminPays($order);

        Sanctum::actingAs($seller->user);
        $this->updateSellerOrderStatus($so->id, 'shipped', ['courier' => 'JNE'])->assertStatus(422);
        $this->updateSellerOrderStatus($so->id, 'processing')->assertStatus(422);
    }

    public function test_penjual_lain_tidak_bisa_mengubah_sub_pesanan(): void
    {
        [, , , $order, $so] = $this->scenario();
        $this->adminPays($order);

        Sanctum::actingAs($this->makeSeller()->user);
        $this->updateSellerOrderStatus($so->id, 'confirmed')->assertNotFound();
        $this->getJson("/api/v1/seller/orders/{$so->id}")->assertNotFound();
    }

    public function test_daftar_pesanan_penjual_hanya_miliknya(): void
    {
        [$seller] = $this->scenario();
        $this->scenario(); // pesanan penjual lain

        Sanctum::actingAs($seller->user);
        $this->getJson('/api/v1/seller/orders')->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_cod_bisa_dikonfirmasi_tanpa_bayar_dan_lunas_setelah_diterima(): void
    {
        [$seller, , $buyer, $order, $so] = $this->scenario('cod');

        Sanctum::actingAs($seller->user);
        $this->updateSellerOrderStatus($so->id, 'confirmed')->assertOk();
        $this->updateSellerOrderStatus($so->id, 'processing')->assertOk();
        $this->updateSellerOrderStatus($so->id, 'shipped', ['courier' => 'Kurir Toko'])->assertOk();

        $this->assertSame('failed', 'failed'); // placeholder agar urutan assert jelas
        $this->assertNotSame('paid', $order->fresh()->payment_status);

        Sanctum::actingAs($buyer);
        $this->postJson("/api/v1/orders/{$order->order_number}/seller-orders/{$so->id}/received")->assertOk();

        $this->assertSame('paid', $order->fresh()->payment_status);
        $this->assertDatabaseHas('payments', ['order_id' => $order->id, 'status' => 'paid']);
    }

    public function test_pesanan_yang_sudah_diproses_penjual_tidak_bisa_dibatalkan(): void
    {
        [$seller, , $buyer, $order, $so] = $this->scenario('cod');

        Sanctum::actingAs($seller->user);
        $this->updateSellerOrderStatus($so->id, 'confirmed')->assertOk();

        Sanctum::actingAs($buyer);
        $this->postJson("/api/v1/orders/{$order->order_number}/cancel")->assertStatus(422);
    }

    public function test_pembeli_lain_tidak_bisa_mengonfirmasi_penerimaan(): void
    {
        [$seller, , , $order, $so] = $this->scenario('cod');

        Sanctum::actingAs($seller->user);
        $this->updateSellerOrderStatus($so->id, 'confirmed');
        $this->updateSellerOrderStatus($so->id, 'processing');
        $this->updateSellerOrderStatus($so->id, 'shipped', ['courier' => 'JNE']);

        Sanctum::actingAs($this->makeUser());
        $this->postJson("/api/v1/orders/{$order->order_number}/seller-orders/{$so->id}/received")->assertNotFound();
    }

    public function test_webhook_nonaktif_tanpa_secret(): void
    {
        config(['umkm.payment_webhook_secret' => null]);

        $this->webhook(['payment_reference' => 'X', 'status' => 'paid', 'amount' => 1])->assertStatus(503);
    }

    public function test_webhook_signature_salah_ditolak(): void
    {
        [, , , $order] = $this->scenario();
        config(['umkm.payment_webhook_secret' => 'rahasia']);

        $this->webhook([
            'payment_reference' => $order->payments->first()->payment_reference,
            'status' => 'paid',
            'amount' => (float) $order->total_amount,
        ], 'rahasia', 'signature-palsu')->assertStatus(401);

        $this->assertSame('pending', $order->fresh()->payment_status);
    }

    public function test_webhook_paid_melunasi_pesanan_dan_idempoten(): void
    {
        [, , , $order] = $this->scenario();
        config(['umkm.payment_webhook_secret' => 'rahasia']);

        $payload = [
            'payment_reference' => $order->payments->first()->payment_reference,
            'status' => 'paid',
            'amount' => (float) $order->total_amount,
            'provider_transaction_id' => 'TX-1',
        ];

        $this->webhook($payload)->assertOk();
        $this->webhook($payload)->assertOk();

        $this->assertSame('paid', $order->fresh()->payment_status);
        $this->assertDatabaseHas('payments', ['order_id' => $order->id, 'status' => 'paid', 'provider_transaction_id' => 'TX-1']);
    }

    public function test_webhook_nominal_tidak_cocok_ditolak(): void
    {
        [, , , $order] = $this->scenario();
        config(['umkm.payment_webhook_secret' => 'rahasia']);

        $this->webhook([
            'payment_reference' => $order->payments->first()->payment_reference,
            'status' => 'paid',
            'amount' => 1000,
        ])->assertStatus(422);

        $this->assertSame('pending', $order->fresh()->payment_status);
    }

    public function test_webhook_referensi_tidak_dikenal_404(): void
    {
        config(['umkm.payment_webhook_secret' => 'rahasia']);

        $this->webhook(['payment_reference' => 'TIDAK-ADA', 'status' => 'paid', 'amount' => 1])->assertNotFound();
    }

    public function test_webhook_expired_membatalkan_pesanan_dan_mengembalikan_stok(): void
    {
        [, $product, , $order] = $this->scenario();
        config(['umkm.payment_webhook_secret' => 'rahasia']);

        $this->webhook([
            'payment_reference' => $order->payments->first()->payment_reference,
            'status' => 'expired',
            'amount' => (float) $order->total_amount,
        ])->assertOk();

        $this->assertSame('cancelled', $order->fresh()->order_status);
        $this->assertSame(10, $product->fresh()->stock);
    }

    public function test_command_expire_membatalkan_pesanan_non_cod_yang_lewat_batas(): void
    {
        [, $product, , $order] = $this->scenario();
        [, , , $cod] = $this->scenario('cod');
        Payment::query()->update(['expired_at' => now()->subHour()]);

        $this->artisan('orders:expire-unpaid')->assertExitCode(0);

        $this->assertSame('cancelled', $order->fresh()->order_status);
        $this->assertSame(10, $product->fresh()->stock);
        $this->assertSame('pending', $cod->fresh()->order_status); // COD tidak kedaluwarsa
    }

    public function test_admin_tidak_bisa_melunasi_pesanan_yang_sudah_dibatalkan(): void
    {
        [, , $buyer, $order] = $this->scenario();

        Sanctum::actingAs($buyer);
        $this->postJson("/api/v1/orders/{$order->order_number}/cancel")->assertOk();

        Sanctum::actingAs($this->makeUser('admin'));
        $this->patchJson("/api/v1/admin/orders/{$order->order_number}/payment", ['status' => 'paid'])->assertStatus(422);
    }

    public function test_non_admin_tidak_bisa_mengubah_status_pembayaran(): void
    {
        [, , $buyer, $order] = $this->scenario();

        Sanctum::actingAs($buyer);
        $this->patchJson("/api/v1/admin/orders/{$order->order_number}/payment", ['status' => 'paid'])->assertForbidden();

        $this->assertSame('pending', $order->fresh()->payment_status);
    }
}