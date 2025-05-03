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
    'middleware'=>'api',
    'prefix'=>'auth'
],function(){
    Route::post('/register',[AuthController::class,"register"]);
    Route::post('/login',[AuthController::class,"login"]);
    Route::get('/logout',[AuthController::class,"logout"])->middleware('auth:api');
    Route::get('/refresh',[AuthController::class,"refresh"])->middleware('auth:api');
    Route::get('/profile',[AuthController::class,"profile"])->middleware('auth:api');
});