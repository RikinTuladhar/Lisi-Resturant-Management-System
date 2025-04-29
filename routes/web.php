<?php

use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
Route::get('/admin/dashboard',[TestController::class,'admin'])->name('admin');
});

Route::middleware(['auth', 'verified','role:worker,admin'])->group(function () {
Route::get('/worker/dashboard',[TestController::class,'worker'])->name('worker');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
