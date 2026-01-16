<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 * title="Inventory Management API",
 * version="1.0.0",
 * description="Final Project API Documentation",
 * @OA\Contact(email="admin@admin.com")
 * )
 * @OA\Server(
 * url="http://localhost:8000",
 * description="Local API Server"
 * )
 */
class SwaggerConfig
{
    /**
     * @OA\Get(
     * path="/api/devices",
     * tags={"Devices"},
     * summary="Get all devices",
     * @OA\Response(
     * response=200,
     * description="Success",
     * @OA\JsonContent(type="object")
     * )
     * )
     */
    public function getDevices() {}
}