<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class RentalContractCollection extends BaseCollection
{
    public function withResponse($request, $response)
    {
        parent::withResponse($request, $response);
        $response->header('X-Collection-Type', 'RentalContractCollection');
    }
}