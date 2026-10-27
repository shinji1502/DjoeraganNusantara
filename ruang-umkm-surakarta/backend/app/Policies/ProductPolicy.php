<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /** Hanya pemilik produk (lewat seller profile) yang boleh mengubah/menghapus. */
    private function owns(User $user, Product $product): bool
    {
        return $user->sellerProfile !== null
            && $user->sellerProfile->id === $product->seller_profile_id;
    }

    public function view(User $user, Product $product): bool
    {
        return $this->owns($user, $product);
    }

    public function update(User $user, Product $product): bool
    {
        return $this->owns($user, $product);
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->owns($user, $product);
    }
}