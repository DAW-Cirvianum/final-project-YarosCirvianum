<?php

namespace App\Http\Controllers\Api;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Inventory Management API",
    version: "1.0.0",
    description: "Documentació oficial de l'API d'Inventari - Projecte Final",
    contact: new OA\Contact(email: "admin@admin.com")
)]
#[OA\Server(url: "http://localhost:8000", description: "Servidor Local")]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]
class OpenApiSpec {}