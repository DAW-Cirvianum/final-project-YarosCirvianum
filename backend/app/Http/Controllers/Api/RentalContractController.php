<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use App\Models\RentalContract;
use App\Http\Resources\RentalContractResource;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RentalContractController extends Controller
{
    // GET /api/rental-contracts
    public function index(Request $request)
    {
        $query = RentalContract::with([
            'provider',
            'devices',
        ]);

        // ===== Filtres =====
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

    // POST /api/rental-contracts
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider_id'   => ['required', 'exists:providers,id'],
            'contract_code' => ['required', 'string', 'max:100', 'unique:rental_contracts,contract_code'],
            'start_date'    => ['required', 'date'],
            'end_date'      => ['required', 'date', 'after_or_equal:start_date'],
            'status'        => ['required', 'string', 'max:20'],
            'monthly_cost'  => ['nullable', 'numeric', 'min:0'],
            'notes'         => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $contract = RentalContract::create($validator->validated());

        return ApiResponse::success(
            new RentalContractResource(
                $contract->load(['provider', 'devices'])
            ),
            null,
            201
        );
    }

    // GET /api/rental-contracts/{id}
    public function show(int $id)
    {
        $contract = RentalContract::with([
            'provider',
            'devices',
        ])->find($id);

        if (! $contract) {
            return ApiResponse::error(['rental_contract' => ['Not found']], 404);
        }

        return ApiResponse::success(
            new RentalContractResource($contract)
        );
    }

    // PUT /api/rental-contracts/{id}
    public function update(Request $request, int $id)
    {
        $contract = RentalContract::find($id);

        if (! $contract) {
            return ApiResponse::error(['rental_contract' => ['Not found']], 404);
        }

        $validator = Validator::make($request->all(), [
            'provider_id'   => ['sometimes', 'exists:providers,id'],
            'contract_code' => ['sometimes', 'string', 'max:100', 'unique:rental_contracts,contract_code,' . $contract->id],
            'start_date'    => ['sometimes', 'date'],
            'end_date'      => ['sometimes', 'date', 'after_or_equal:start_date'],
            'status'        => ['sometimes', 'string', 'max:20'],
            'monthly_cost'  => ['nullable', 'numeric', 'min:0'],
            'notes'         => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $contract->update($validator->validated());

        return ApiResponse::success(
            new RentalContractResource(
                $contract->load(['provider', 'devices'])
            )
        );
    }

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
