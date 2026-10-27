<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', Rule::in(User::ROLES)],
            'status' => ['nullable', Rule::in(User::STATUSES)],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = User::with('sellerProfile')->latest('id');

        if ($term = $request->query('q')) {
            $like = '%'.addcslashes($term, '%_\\').'%';
            $query->where(fn ($q) => $q->where('name', 'like', $like)->orWhere('email', 'like', $like));
        }
        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return UserResource::collection($query->paginate((int) $request->query('per_page', 20))->withQueryString());
    }

    public function updateStatus(Request $request, User $user)
    {
        $data = $request->validate(['status' => ['required', Rule::in(User::STATUSES)]]);

        if ($user->id === $request->user()->id) {
            abort(422, 'Anda tidak dapat mengubah status akun sendiri.');
        }

        $old = $user->status;
        $user->forceFill(['status' => $data['status']])->save();

        if (in_array($data['status'], ['suspended', 'rejected'], true)) {
            $user->tokens()->delete(); // paksa logout di semua perangkat
        }

        ActivityLogger::log('user.status_changed', "Status akun {$user->email} diubah.", $request->user()->id, $user, [
            'from' => $old, 'to' => $data['status'],
        ]);

        return new UserResource($user);
    }
}