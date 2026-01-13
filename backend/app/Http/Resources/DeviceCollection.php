<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class DeviceCollection extends BaseCollection
{
    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse($request, $response)
    {
        parent::withResponse($request, $response);
        $response->header('X-Collection-Type', 'DeviceCollection');
    }
}