<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Owner;
use App\Models\Provider;
use App\Models\RentalContract;
use Illuminate\Http\Request;
use App\Helpers\ApiResponse;

class StatsController extends Controller
{
    public function dashboard()
    {
        // Només comptem els registres "actius" o totals, segons vulguis.
        // Aquí fem recompte total (tenint en compte que soft-deleted ja s'exclouen sols)
        
        $stats = [
            'devices' => Device::count(),
            'active_devices' => Device::where('status', '!=', 'retired')->count(),
            
            'owners' => Owner::count(),
            'active_owners' => Owner::where('is_active', true)->count(),
            
            'providers' => Provider::count(),
            'active_providers' => Provider::where('is_active', true)->count(),
            
            'contracts' => RentalContract::count(),
            'active_contracts' => RentalContract::where('status', 'active')->count(),
        ];

        return ApiResponse::success($stats);
    }
}