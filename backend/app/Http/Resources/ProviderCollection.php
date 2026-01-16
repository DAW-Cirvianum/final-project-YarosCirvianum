<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProviderCollection extends BaseCollection
{
    // Personalitza la resposta sortint del recurs
    public function withResponse(Request $request, JsonResponse $response): void
    {
        parent::withResponse($request, $response);

        $response->header('X-Collection-Type', 'ProviderCollection');
    }
}