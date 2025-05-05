<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

class AuthController extends BaseController
{
    function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:user,worker,admin'
        ]);

        if ($validator->fails()) {
            return $this->sendErrorResponse('Validation Error', $validator->errors());
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        return $this->sendResponse(['user' => $user], 'User registered successfully.');
    }

    function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendErrorResponse('Validation Error', $validator->errors());
        }

        // Fetch user from the database
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->sendErrorResponse('Unauthorized', ['error' => 'Invalid credentials.']);
        }
        /** @var JWTGuard $auth */
        // Generate token
        $auth = auth();
        $token = $auth->login($user);

        return $this->sendResponse($this->respondWithToken($token), 'User logged in successfully.');
    }

    function logout()
    {
        /** @var JWTGuard $auth */
        $auth = auth();
        $auth->logout();
        return $this->sendResponse([], 'Logout successfully.');
    }

    function profile()
    {
        /** @var JWTGuard $auth */
        $auth = auth();
        $user = $auth->user();
        return $this->sendResponse(['user' => $user], 'User profile retrieved successfully.');
    }

    function refresh()
    {
        /** @var JWTGuard $auth */
        $auth = auth();
        $token =  $auth->refresh();
        return $this->sendResponse($this->respondWithToken($token), 'Token refreshed successfully.');
    }

    protected function respondWithToken($token)
    {
        /** @var JWTGuard $auth */
        $auth = auth();
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' =>   $auth->factory()->getTTL() * 60
        ];
    }
}
