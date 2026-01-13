<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProviderCollection extends BaseCollection
{
    public function withResponse($request, $response)
    {
        parent::withResponse($request, $response);
        $response->header('X-Collection-Type', 'ProviderCollection');
    }
}