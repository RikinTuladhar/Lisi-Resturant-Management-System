<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class VerifyIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('admin/login')) {
            return $next($request);
        }

        if (Auth::user() && Auth::user()->role == UserRole::ADMIN) {
            return $next($request);
        }
        abort(403, 'You are not allowed to access this page');
        return $next($request);
    }
}
