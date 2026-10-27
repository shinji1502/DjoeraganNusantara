<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            return response()->json(['message' => 'Anda tidak memiliki akses ke sumber daya ini.'], 403);
        }

        if (! $user->isActive()) {
            return response()->json(['message' => 'Akun Anda belum aktif.'], 403);
        }

        return $next($request);
    }
}