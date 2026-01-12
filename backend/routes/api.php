<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RecoveryController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\OwnerController;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\RentalContractController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ========== AuthController ==========

// Register
Route::post('/register', [AuthController::class, 'store']);

// Profile User info
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/profile', [AuthController::class, 'profile']);
});

// Login
Route::post('/login', [AuthController::class, 'login']);

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');

// ========== RecoveryController ==========

Route::post('/email/resend', [RecoveryController::class,  'resendVerification'])
    ->middleware('auth:sanctum');

// ========== API Resources ==========

Route::middleware('auth:sanctum')->group(function () {

    // Devices
    Route::apiResource('devices', DeviceController::class);

    // Owners
    Route::apiResource('owners', OwnerController::class);

    // Providers
    Route::apiResource('providers', ProviderController::class);

    // Rental Contracts
    Route::apiResource('rental-contracts', RentalContractController::class);
});
