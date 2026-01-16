<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use App\Models\Device;
use App\Models\Owner;
use App\Models\Provider;
use App\Models\RentalContract;
use Illuminate\Support\Facades\Http;
use OpenApi\Attributes as OA;

class StatsController extends Controller
{
    #[OA\Get(
        path: "/api/stats/dashboard",
        summary: "Global statistics and daily quote",
        tags: ["Stats"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Dashboard data including external API quote")
        ]
    )]
    public function dashboard()
    {
        // --- EXTERNAL API CALL (Extra Feature) ---
        // Default quote in English [cite: 128]
        $quote = "Everything you can imagine is real.";
        $author = "Pablo Picasso";

        try {
            // We use a timeout to ensure the dashboard doesn't hang if the external API is slow
            $response = Http::timeout(3)->get('https://zenquotes.io/api/random');
            
            if ($response->successful()) {
                $data = $response->json();
                $quote = $data[0]['q'];
                $author = $data[0]['a'];
            }
        } catch (\Exception $e) {
            // Silent catch: if external API fails, we use the default English quote
        }

        $stats = [
            'devices'          => Device::count(),
            'active_devices'   => Device::where('status', '!=', 'retired')->count(),
            
            'owners'           => Owner::count(),
            'active_owners'    => Owner::where('is_active', true)->count(),
            
            'providers'        => Provider::count(),
            'active_providers' => Provider::where('is_active', true)->count(),
            
            'contracts'        => RentalContract::count(),
            'active_contracts' => RentalContract::where('status', 'active')->count(),

            // External data for the frontend dashboard
            'external_quote' => [
                'text'   => $quote,
                'author' => $author
            ]
        ];

        return ApiResponse::success($stats);
    }
}