<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class OwnerCollection extends BaseCollection
{
    public function withResponse($request, $response)
    {
        parent::withResponse($request, $response);
        $response->header('X-Collection-Type', 'OwnerCollection');
    }
}