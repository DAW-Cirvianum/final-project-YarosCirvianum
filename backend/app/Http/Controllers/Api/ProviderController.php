<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Http\Resources\ProviderResource;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

class ProviderController extends Controller
{
    #[OA\Get(
        path: "/api/providers",
        summary: "Obtenir llista de proveïdors",
        tags: ["Providers"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "name", in: "query", description: "Filtrar per nom", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "is_active", in: "query", description: "Filtrar per estat actiu (0 o 1)", required: false, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "per_page", in: "query", description: "Resultats per pàgina", required: false, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Llista de proveïdors",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "ok", type: "boolean", example: true),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Provider"))
                    ]
                )
            )
        ]
    )]
    public function index(Request $request)
    {
        $query = Provider::query();

        // ===== FILTRES =====
        if ($request->filled('name')) {
            $query->where('name', 'like', "%{$request->name}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $providers = $query
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(
            ProviderResource::collection($providers),
            [
                'pagination' => [
                    'current_page' => $providers->currentPage(),
                    'last_page'    => $providers->lastPage(),
                    'per_page'     => $providers->perPage(),
                    'total'        => $providers->total(),
                ],
            ]
        );
    }

    #[OA\Post(
        path: "/api/providers",
        summary: "Crear un nou proveïdor",
        tags: ["Providers"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: "#/components/schemas/Provider")
        ),
        responses: [
            new OA\Response(response: 201, description: "Proveïdor creat"),
            new OA\Response(response: 422, description: "Error de validació")
        ]
    )]
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'           => ['required', 'string', 'max:100', 'unique:providers,name'],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'contact_email'  => ['nullable', 'email', 'max:150'],
            'contact_phone'  => ['nullable', 'string', 'max:20'],
            'address'        => ['nullable', 'string', 'max:500'],
            'tax_id'         => ['nullable', 'string', 'max:50'],
            'website'        => ['nullable', 'url', 'max:200'], 
            'provider_type'  => ['nullable', 'string', 'max:20'],
            'notes'          => ['nullable', 'string', 'max:1000'],
            'is_active'      => ['boolean'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $provider = Provider::create($validator->validated());

        return ApiResponse::success(new ProviderResource($provider), null, 201);
    }

    #[OA\Get(
        path: "/api/providers/{id}",
        summary: "Detalls d'un proveïdor",
        tags: ["Providers"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Dades del proveïdor"),
            new OA\Response(response: 404, description: "Proveïdor no trobat")
        ]
    )]
    public function show(int $id)
    {
        $provider = Provider::find($id);

        if (! $provider) {
            return ApiResponse::error(['provider' => ['Not found']], 404);
        }

        return ApiResponse::success(new ProviderResource($provider));
    }

    #[OA\Put(
        path: "/api/providers/{id}",
        summary: "Actualitzar un proveïdor existent",
        tags: ["Providers"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Nou Nom Proveïdor"),
                    new OA\Property(property: "is_active", type: "boolean", example: true)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Actualitzat correctament"),
            new OA\Response(response: 404, description: "Proveïdor no trobat")
        ]
    )]
    public function update(Request $request, int $id)
    {
        $provider = Provider::find($id);

        if (! $provider) {
            return ApiResponse::error(['provider' => ['Not found']], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'           => ['sometimes', 'string', 'max:100', 'unique:providers,name,' . $provider->id],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'contact_email'  => ['nullable', 'email', 'max:150'],
            'contact_phone'  => ['nullable', 'string', 'max:20'],
            'address'        => ['nullable', 'string', 'max:500'],
            'tax_id'         => ['nullable', 'string', 'max:50'],
            'website'        => ['nullable', 'url', 'max:200'],
            'provider_type'  => ['nullable', 'string', 'max:20'],
            'notes'          => ['nullable', 'string', 'max:1000'],
            'is_active'      => ['boolean'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $provider->update($validator->validated());

        return ApiResponse::success(new ProviderResource($provider));
    }

    #[OA\Delete(
        path: "/api/providers/{id}",
        summary: "Esborrar un proveïdor",
        tags: ["Providers"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Esborrat correctament"),
            new OA\Response(response: 404, description: "Proveïdor no trobat")
        ]
    )]
    public function destroy(int $id)
    {
        $provider = Provider::find($id);

        if (! $provider) {
            return ApiResponse::error(['provider' => ['Not found']], 404);
        }

        $provider->delete();

        return ApiResponse::success();
    }
}