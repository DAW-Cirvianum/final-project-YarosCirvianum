<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{AuthController, RecoveryController, DeviceController, OwnerController, ProviderController, RentalContractController, StatsController};

Route::middleware('auth:sanctum')->get('/user', fn(Request $r) => $r->user());

// Auth & Recovery
Route::post('/register', [AuthController::class, 'store'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/password/forgot', [RecoveryController::class, 'forgotPassword'])->name('api.password.forgot');
Route::post('/password/reset', [RecoveryController::class, 'resetPassword'])->name('api.password.reset');

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile'])->name('api.profile');
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::post('/email/resend', [RecoveryController::class, 'resendVerification'])->name('api.verification.resend');
    
    // Stats
    Route::get('/stats/dashboard', [StatsController::class, 'dashboard'])->name('api.stats.dashboard');

    // Resources (Devices, Owners, Providers, Contracts)
    Route::apiResources([
        'devices' => DeviceController::class,
        'owners' => OwnerController::class,
        'providers' => ProviderController::class,
        'rental-contracts' => RentalContractController::class,
    ]);
});

// Verification & Testing
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware('signed')->name('verification.verify');

Route::get('/test-resource', function() {
    try {
        $device = \App\Models\Device::firstOrCreate([
            'serial_number' => 'TEST-'.time()
        ], [
            'device_type' => 'laptop', 'brand' => 'Test', 'model' => 'Model', 'inventory_number' => 'INV-'.time(), 'physical_location' => 'Lab'
        ]);
        return response()->json(['status' => true, 'resource' => new \App\Http\Resources\DeviceResource($device)]);
    } catch (\Exception $e) { return response()->json(['error' => $e->getMessage()], 500); }
})->name('api.test.resource');

Route::get('/routes', fn() => response()->json(['routes' => collect(Route::getRoutes())->map(fn($r) => ['method'=>implode('|',$r->methods()), 'uri'=>$r->uri(), 'name'=>$r->getName()])->filter(fn($r)=>str_starts_with($r['uri'], 'api/'))->values()]));