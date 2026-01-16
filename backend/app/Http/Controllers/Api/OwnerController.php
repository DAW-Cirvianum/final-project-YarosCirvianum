<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use App\Models\Owner;
use App\Http\Resources\OwnerResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

class OwnerController extends Controller
{
    #[OA\Get(
        path: "/api/owners",
        summary: "Obtenir llista de propietaris",
        tags: ["Owners"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "name", in: "query", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "email", in: "query", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "is_active", in: "query", schema: new OA\Schema(type: "boolean"))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Llista de propietaris",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "ok", type: "boolean", example: true),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Owner"))
                    ]
                )
            )
        ]
    )]
    public function index(Request $request)
    {
        $query = Owner::query();

        // ===== FILTRES =====
        if ($request->filled('name')) {
            $query->where('owner_name', 'like', "%{$request->name}%");
        }
        if ($request->filled('email')) {
            $query->where('email', 'like', "%{$request->email}%");
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $owners = $query
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(
            OwnerResource::collection($owners),
            [
                'pagination' => [
                    'current_page' => $owners->currentPage(),
                    'last_page'    => $owners->lastPage(),
                    'per_page'     => $owners->perPage(),
                    'total'        => $owners->total(),
                ],
            ]
        );
    }

    #[OA\Post(
        path: "/api/owners",
        summary: "Crear un nou propietari",
        tags: ["Owners"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "John Doe"),
                    new OA\Property(property: "email", type: "string", example: "john@doe.com"),
                    new OA\Property(property: "department", type: "string", example: "Sales")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Creat correctament"),
            new OA\Response(response: 422, description: "Error de validació")
        ]
    )]
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'          => ['required', 'string', 'max:40'],
            'email'         => ['nullable', 'email', 'max:150', 'unique:owners,email'],
            'phone'         => ['nullable', 'string', 'max:20'],
            'extension'     => ['nullable', 'string', 'max:3'],
            'department'    => ['nullable', 'string', 'max:30'],
            'location'      => ['nullable', 'string', 'max:30'],
            'employee_code' => ['nullable', 'string', 'max:30'],
            'notes'         => ['nullable', 'string', 'max:1000'],
            'is_active'     => ['boolean'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray(), 422);
        }

        $data = $validator->validated();
        $data['owner_name'] = $data['name'];
        unset($data['name']);

        $data['is_active'] = $data['is_active'] ?? true;

        $owner = Owner::create($data);

        return ApiResponse::success(new OwnerResource($owner), null, 201);
    }

    #[OA\Get(
        path: "/api/owners/{id}",
        summary: "Detalls d'un propietari",
        tags: ["Owners"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "OK"),
            new OA\Response(response: 404, description: "No trobat")
        ]
    )]
    public function show(int $id)
    {
        $owner = Owner::find($id);

        if (! $owner) {
            return ApiResponse::error(['owner' => ['Not found']], 404);
        }

        return ApiResponse::success(new OwnerResource($owner));
    }

    #[OA\Put(
        path: "/api/owners/{id}",
        summary: "Actualitzar propietari",
        tags: ["Owners"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "department", type: "string", example: "Human Resources"),
                    new OA\Property(property: "is_active", type: "boolean", example: false)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Actualitzat correctament"),
            new OA\Response(response: 404, description: "No trobat")
        ]
    )]
    public function update(Request $request, int $id)
    {
        $owner = Owner::find($id);

        if (! $owner) {
            return ApiResponse::error(['owner' => ['Not found']], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'          => ['sometimes', 'string', 'max:40'],
            'email'         => ['nullable', 'email', 'max:150', "unique:owners,email,{$id}"],
            'phone'         => ['nullable', 'string', 'max:20'],
            'extension'     => ['nullable', 'string', 'max:3'],
            'department'    => ['nullable', 'string', 'max:30'],
            'location'      => ['nullable', 'string', 'max:30'],
            'employee_code' => ['nullable', 'string', 'max:30'],
            'notes'         => ['nullable', 'string', 'max:1000'],
            'is_active'     => ['boolean'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray(), 422);
        }

        $data = $validator->validated();

        if (array_key_exists('name', $data)) {
            $data['owner_name'] = $data['name'];
            unset($data['name']);
        }

        $owner->update($data);

        return ApiResponse::success(new OwnerResource($owner));
    }

    #[OA\Delete(
        path: "/api/owners/{id}",
        summary: "Esborrar propietari",
        tags: ["Owners"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Esborrat correctament"),
            new OA\Response(response: 404, description: "No trobat")
        ]
    )]
    public function destroy(int $id)
    {
        $owner = Owner::find($id);

        if (! $owner) {
            return ApiResponse::error(['owner' => ['Not found']], 404);
        }

        $owner->delete();

        return ApiResponse::success();
    }
}