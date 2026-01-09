<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::get('/test', function () {
//     return response()->json([
//         'status' => 'ok',
//         'message' => 'HOLA SOC PHP'
//     ]);
// });

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

Route::post('/email/resend', [RecoveryController::class,  'resendVerification'])
    ->middleware('auth:sanctum');