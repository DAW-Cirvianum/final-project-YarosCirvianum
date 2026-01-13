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
Route::post('/register', [AuthController::class, 'store'])
    ->name('api.register');

// Profile User info
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/profile', [AuthController::class, 'profile'])
        ->name('api.profile');
});

// Login
Route::post('/login', [AuthController::class, 'login'])
    ->name('api.login');

// Logout (si vols afegir-la)
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum')
    ->name('api.logout');

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');

// ========== RecoveryController ==========

Route::post('/password/forgot', [RecoveryController::class, 'forgotPassword'])
    ->name('api.password.forgot');

Route::post('/password/reset', [RecoveryController::class, 'resetPassword'])
    ->name('api.password.reset');

Route::post('/email/resend', [RecoveryController::class, 'resendVerification'])
    ->middleware('auth:sanctum')
    ->name('api.verification.resend');

// ========== API Resources ==========

Route::middleware('auth:sanctum')->group(function () {

    // Devices - amb noms de ruta prefixats amb 'api.'
    Route::apiResource('devices', DeviceController::class)
        ->names([
            'index' => 'api.devices.index',
            'store' => 'api.devices.store',
            'show' => 'api.devices.show',
            'update' => 'api.devices.update',
            'destroy' => 'api.devices.destroy',
        ]);

    // Owners - amb noms de ruta prefixats amb 'api.'
    Route::apiResource('owners', OwnerController::class)
        ->names([
            'index' => 'api.owners.index',
            'store' => 'api.owners.store',
            'show' => 'api.owners.show',
            'update' => 'api.owners.update',
            'destroy' => 'api.owners.destroy',
        ]);

    // Providers - amb noms de ruta prefixats amb 'api.'
    Route::apiResource('providers', ProviderController::class)
        ->names([
            'index' => 'api.providers.index',
            'store' => 'api.providers.store',
            'show' => 'api.providers.show',
            'update' => 'api.providers.update',
            'destroy' => 'api.providers.destroy',
        ]);

    // Rental Contracts - amb noms de ruta prefixats amb 'api.'
    // Nota: Laravel automàticament converteix el guió a punt en els noms
    Route::apiResource('rental-contracts', RentalContractController::class)
        ->names([
            'index' => 'api.rental-contracts.index',
            'store' => 'api.rental-contracts.store',
            'show' => 'api.rental-contracts.show',
            'update' => 'api.rental-contracts.update',
            'destroy' => 'api.rental-contracts.destroy',
        ]);

    // Opcional: Pots afegir rutes personalitzades amb noms
    // Route::get('/devices/{id}/incidents', [DeviceController::class, 'incidents'])
    //     ->name('api.devices.incidents');
    // Route::get('/owners/{id}/devices', [OwnerController::class, 'devices'])
    //     ->name('api.owners.devices');
});

// ========== Ruta de test (sense autenticació per depuració) ==========
Route::get('/test-resource', function() {
    try {
        // Prova amb el DeviceResource
        $device = \App\Models\Device::first();
        
        if (!$device) {
            // Crea un device de prova si no n'hi ha
            $device = \App\Models\Device::create([
                'device_type' => 'laptop',
                'brand' => 'Test Brand',
                'model' => 'Test Model',
                'serial_number' => 'TEST-' . time(),
                'inventory_number' => 'INV-TEST-' . time(),
                'physical_location' => 'Test Location',
                'status' => 'in_stock',
                'has_warranty' => 0,
                'requires_maintenance' => 0,
                'is_insured' => 0,
                'is_leased' => 0,
            ]);
        }
        
        // Prova instanciar el Resource
        $resource = new \App\Http\Resources\DeviceResource($device);
        
        return response()->json([
            'status' => true,
            'device_exists' => !is_null($device),
            'device_id' => $device->id,
            'resource_class' => get_class($resource),
            'test' => 'Resource instanciat correctament',
            'route_names_working' => [
                'devices_show' => route('api.devices.show', 1),
                'owners_show' => route('api.owners.show', 1),
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->name('api.test.resource');

// ========== Ruta per llistar totes les rutes amb noms ==========
Route::get('/routes', function() {
    $routes = collect(Route::getRoutes())->map(function ($route) {
        return [
            'method' => implode('|', $route->methods()),
            'uri' => $route->uri(),
            'name' => $route->getName(),
            'action' => $route->getActionName(),
        ];
    })->filter(function ($route) {
        return str_starts_with($route['uri'], 'api/');
    })->values();
    
    return response()->json([
        'status' => true,
        'routes' => $routes
    ]);
})->name('api.routes.list');