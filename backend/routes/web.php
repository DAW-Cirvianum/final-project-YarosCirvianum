<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAuthController;

// Redirigeix arrel al login d'admin directament
Route::redirect('/', '/admin/login');

// Auth Routes
Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('login');
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

// Admin Console Routes
Route::middleware(['auth', 'admin'])->prefix('admin/users')->name('admin.users')->controller(AdminController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store')->name('.store');
    Route::put('/{user}', 'update')->name('.update');
    Route::delete('/{user}', 'destroy')->name('.destroy');
});