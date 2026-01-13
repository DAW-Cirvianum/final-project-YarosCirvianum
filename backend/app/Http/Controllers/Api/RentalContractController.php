<?php

namespace App\Http\Controllers\Api;

// Models
use App\Models\RentalContract;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

// Resource
use App\Http\Resources\RentalContractResource;
use App\Http\Resources\RentalContractCollection;

class RentalContractController extends Controller
{
    // GET /api/rental-contracts
    // Llistar contractes de renting amb filtres opcionals

    public function index(Request $request)
    {
        $query = RentalContract::with('provider');

        // ===== Filtres opcionals =====
        if ($request->filled('provider_id')) {
            $query->where('provider_id', $request->provider_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('end_date', '<=', $request->end_date);
        }

        // Adaptar el return als Collections
        $perPage = $request->input('per_page', 20);
        $contracts = $query->orderBy('start_date', 'desc')->paginate($perPage);

        // Retornar Collection
        return new RentalContractCollection($contracts);
    }

    // POST /api/rental-contracts
    // Crear un nou contracte de renting

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider_id'     => ['required', 'exists:providers,id'],
            'contract_number' => ['required', 'string', 'max:100', 'unique:rental_contracts,contract_number'],
            'name'            => ['required', 'string', 'max:200'],
            'pdf_filename'    => ['nullable', 'string', 'max:255'],
            'start_date'      => ['required', 'date'],
            'end_date'        => ['nullable', 'date', 'after_or_equal:start_date'],
            'monthly_cost'    => ['nullable', 'numeric'],
            'status'          => ['required', 'string', 'max:20'],
            'terms'           => ['nullable', 'string'],
            'notes'           => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $contract = RentalContract::create($validator->validated());

        return response()->json([
            'status'  => true,
            'message' => 'Rental contract created successfully.',
            'data'    => new RentalContractResource($contract->load('provider')),
        ], 201);
    }

    // GET /api/rental-contracts/{id}
    // Mostrar un contracte concret

    public function show($id)
    {
        $contract = RentalContract::with('provider')->find($id);

        if (! $contract) {
            return response()->json([
                'status'  => false,
                'message' => 'Rental contract not found.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data'   => new RentalContractResource($contract),
        ], 200);
    }

    // PUT /api/rental-contracts/{id}
    // Actualitzar un contracte de renting

    public function update(Request $request, $id)
    {
        $contract = RentalContract::find($id);

        if (! $contract) {
            return response()->json([
                'status'  => false,
                'message' => 'Rental contract not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'provider_id'     => ['sometimes', 'exists:providers,id'],
            'contract_number' => ['sometimes', 'string', 'max:100', 'unique:rental_contracts,contract_number,' . $contract->id],
            'name'            => ['sometimes', 'string', 'max:200'],
            'pdf_filename'    => ['nullable', 'string', 'max:255'],
            'start_date'      => ['sometimes', 'date'],
            'end_date'        => ['nullable', 'date', 'after_or_equal:start_date'],
            'monthly_cost'    => ['nullable', 'numeric'],
            'status'          => ['sometimes', 'string', 'max:20'],
            'terms'           => ['nullable', 'string'],
            'notes'           => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $contract->update($validator->validated());

        return response()->json([
            'status'  => true,
            'message' => 'Rental contract updated successfully.',
            'data'    => new RentalContractResource($contract->load('provider')),
        ], 200);
    }

    // DELETE /api/rental-contracts/{id}
    // Soft delete d’un contracte

    public function destroy($id)
    {
        $contract = RentalContract::find($id);

        if (! $contract) {
            return response()->json([
                'status'  => false,
                'message' => 'Rental contract not found.',
            ], 404);
        }

        $contract->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Rental contract deleted successfully.',
        ], 200);
    }
}
