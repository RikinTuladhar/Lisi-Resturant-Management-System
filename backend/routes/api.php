<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/login', function () {
    return 'Please login to access this API';
})->name('login');


Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('/register', [AuthController::class, "register"]);
    Route::post('/login', [AuthController::class, "login"]);
    Route::get('/logout', [AuthController::class, "logout"])->middleware('auth:api');
    Route::get('/refresh', [AuthController::class, "refresh"])->middleware('auth:api');
    Route::get('/profile', [AuthController::class, "profile"])->middleware('auth:api');
});

Route::group(["prefix" => 'users'], function () {
    Route::get('/get-users', action: [AuthController::class, "getUsers"]);
    Route::get('get-user/{user_id}', [AuthController::class, "getUser"]);
    Route::get('/get-user-by-role', [AuthController::class, "getUsersByRole"]);
});

Route::group(['prefix' => 'public'], function () {
    Route::apiResource('categories', \App\Http\Controllers\CategoryController::class)->only(['index']);
    Route::apiResource('categories', \App\Http\Controllers\CategoryController::class)->only(['show']);
    Route::apiResource('items', \App\Http\Controllers\ItemController::class)->only(['index','show']);
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('categories', \App\Http\Controllers\CategoryController::class)->except(['index', 'show']);
    Route::apiResource('items', \App\Http\Controllers\ItemController::class)->except(['index', 'show']);
});
