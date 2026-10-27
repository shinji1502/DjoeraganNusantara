<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return AddressResource::collection(
            $request->user()->addresses()->orderByDesc('is_default')->latest('id')->get()
        );
    }

    public function store(StoreAddressRequest $request)
    {
        $user = $request->user();

        $address = DB::transaction(function () use ($request, $user) {
            // Alamat pertama otomatis default; hanya satu default per pengguna.
            $makeDefault = $request->boolean('is_default') || ! $user->addresses()->exists();
            if ($makeDefault) {
                $user->addresses()->update(['is_default' => false]);
            }

            $address = new Address($request->safe()->except('is_default'));
            $address->user_id = $user->id;
            $address->is_default = $makeDefault;
            $address->save();

            return $address;
        });

        return (new AddressResource($address))->response()->setStatusCode(201);
    }

    public function update(StoreAddressRequest $request, int $id)
    {
        $user = $request->user();
        $address = $user->addresses()->findOrFail($id); // alamat orang lain → 404

        DB::transaction(function () use ($request, $user, $address) {
            $address->fill($request->safe()->except('is_default'));
            if ($request->boolean('is_default') && ! $address->is_default) {
                $user->addresses()->update(['is_default' => false]);
                $address->is_default = true;
            }
            $address->save();
        });

        return new AddressResource($address->fresh());
    }

    public function destroy(Request $request, int $id)
    {
        $user = $request->user();
        $address = $user->addresses()->findOrFail($id);

        // Riwayat pesanan aman karena alamat disimpan sebagai snapshot.
        DB::transaction(function () use ($user, $address) {
            $wasDefault = $address->is_default;
            $address->delete();

            if ($wasDefault) {
                $user->addresses()->latest('id')->first()?->update(['is_default' => true]);
            }
        });

        return response()->json(['message' => 'Alamat dihapus.']);
    }
}