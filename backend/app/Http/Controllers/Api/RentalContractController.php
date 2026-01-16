<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use App\Models\RentalContract;
use App\Http\Resources\RentalContractResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

class RentalContractController extends Controller
{
    #[OA\Get(
        path: "/api/rental-contracts",
        summary: "Llistar contractes de lloguer",
        tags: ["Rental Contracts"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "provider_id", in: "query", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "status", in: "query", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "start_from", in: "query", description: "Data inici des de (YYYY-MM-DD)", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "end_to", in: "query", description: "Data fi fins a (YYYY-MM-DD)", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "per_page", in: "query", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Llista de contractes",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "ok", type: "boolean", example: true),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/RentalContract"))
                    ]
                )
            )
        ]
    )]
    // GET /api/rental-contracts
    public function index(Request $request)
    {
        $query = RentalContract::with(['provider', 'devices']);

        // ===== FILTRES =====
        if ($request->filled('provider_id')) {
            $query->where('provider_id', $request->provider_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_from')) {
            $query->where('start_date', '>=', $request->start_from);
        }

        if ($request->filled('end_to')) {
            $query->where('end_date', '<=', $request->end_to);
        }

        $contracts = $query
            ->orderByDesc('start_date')
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(
            RentalContractResource::collection($contracts),
            [
                'pagination' => [
                    'current_page' => $contracts->currentPage(),
                    'last_page'    => $contracts->lastPage(),
                    'per_page'     => $contracts->perPage(),
                    'total'        => $contracts->total(),
                ],
            ]
        );
    }

    #[OA\Post(
        path: "/api/rental-contracts",
        summary: "Crear un nou contracte",
        tags: ["Rental Contracts"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: "#/components/schemas/RentalContract")
        ),
        responses: [
            new OA\Response(response: 201, description: "Creat correctament"),
            new OA\Response(response: 422, description: "Error de validació")
        ]
    )]
    // POST /api/rental-contracts
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider_id'     => ['required', 'exists:providers,id'],
            'contract_number' => ['required', 'string', 'max:100', 'unique:rental_contracts,contract_number'],
            'name'            => ['nullable', 'string', 'max:200'],
            'contract_code'   => ['nullable', 'string', 'max:100'],
            'start_date'      => ['required', 'date'],
            'end_date'        => ['required', 'date', 'after_or_equal:start_date'],
            'status'          => ['required', 'string', 'max:20'],
            'monthly_cost'    => ['nullable', 'numeric', 'min:0'],
            'terms'           => ['nullable', 'string', 'max:1000'],
            'notes'           => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $contract = RentalContract::create($validator->validated());

        return ApiResponse::success(
            new RentalContractResource($contract->load(['provider', 'devices'])),
            null,
            201
        );
    }

    #[OA\Get(
        path: "/api/rental-contracts/{id}",
        summary: "Detalls d'un contracte",
        tags: ["Rental Contracts"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "OK"),
            new OA\Response(response: 404, description: "No trobat")
        ]
    )]
    // GET /api/rental-contracts/{id}
    public function show(int $id)
    {
        $contract = RentalContract::with(['provider', 'devices'])->find($id);

        if (! $contract) {
            return ApiResponse::error(['rental_contract' => ['Not found']], 404);
        }

        return ApiResponse::success(new RentalContractResource($contract));
    }

    #[OA\Put(
        path: "/api/rental-contracts/{id}",
        summary: "Actualitzar contracte",
        tags: ["Rental Contracts"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "status", type: "string", example: "inactive"),
                    new OA\Property(property: "monthly_cost", type: "number", example: 500.00)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Actualitzat correctament"),
            new OA\Response(response: 404, description: "No trobat")
        ]
    )]
    // PUT /api/rental-contracts/{id}
    public function update(Request $request, int $id)
    {
        $contract = RentalContract::find($id);

        if (! $contract) {
            return ApiResponse::error(['rental_contract' => ['Not found']], 404);
        }

        $validator = Validator::make($request->all(), [
            'provider_id'     => ['sometimes', 'exists:providers,id'],
            'contract_number' => ['sometimes', 'string', 'max:100', 'unique:rental_contracts,contract_number,' . $contract->id],
            'name'            => ['nullable', 'string', 'max:200'],
            'contract_code'   => ['nullable', 'string', 'max:100'],
            'start_date'      => ['sometimes', 'date'],
            'end_date'        => ['sometimes', 'date', 'after_or_equal:start_date'],
            'status'          => ['sometimes', 'string', 'max:20'],
            'monthly_cost'    => ['nullable', 'numeric', 'min:0'],
            'terms'           => ['nullable', 'string', 'max:1000'],
            'notes'           => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $contract->update($validator->validated());

        return ApiResponse::success(
            new RentalContractResource($contract->load(['provider', 'devices']))
        );
    }

    #[OA\Delete(
        path: "/api/rental-contracts/{id}",
        summary: "Esborrar contracte",
        tags: ["Rental Contracts"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Esborrat correctament"),
            new OA\Response(response: 404, description: "No trobat")
        ]
    )]
    // DELETE /api/rental-contracts/{id}
    public function destroy(int $id)
    {
        $contract = RentalContract::find($id);

        if (! $contract) {
            return ApiResponse::error(['rental_contract' => ['Not found']], 404);
        }

        $contract->delete();

        return ApiResponse::success();
    }
}