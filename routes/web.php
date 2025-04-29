<?php

use App\Http\Controllers\CategoryController;
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

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [TestController::class, 'admin'])->name('admin');

    Route::controller(CategoryController::class)->prefix('categories')->group(function () {
        Route::get('/', 'index')->name('categories.index');
        Route::get('/create', 'create')->name('categories.create');
        Route::post('/store', 'store')->name('categories.store');
        Route::get('/{category}/edit', 'edit')->name('categories.edit');
        Route::put('/{category}/update', 'update')->name('categories.update');
        Route::delete('{id}', 'destroy')->name('categories.destroy');
        Route::get('/{category}', 'show')->name('categories.show');
    });
});

Route::middleware(['auth', 'verified', 'role:worker,admin'])->group(function () {
    Route::get('/worker/dashboard', [TestController::class, 'worker'])->name('worker');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
