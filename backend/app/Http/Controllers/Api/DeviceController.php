<?php

namespace App\Http\Controllers\Api;

// Models
use App\Models\Device;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeviceController extends Controller
{
    public function index(Request $request)
    {
        $query = Device::with(['owner', 'provider', 'rentalContract']);

        // ===== Filtres opcionals =====
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('owner_id')) {
            $query->where('owner_id', $request->owner_id);
        }

        if ($request->filled('device_type')) {
            $query->where('device_type', $request->device_type);
        }

        if ($request->filled('provider_id')) {
            $query->where('provider_id', $request->provider_id);
        }

        $devices = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data'   => $devices,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'owner_id'             => ['nullable', 'exists:owners,id'],
            'provider_id'          => ['nullable', 'exists:providers,id'],
            'rental_contract_id'   => ['nullable', 'exists:rental_contracts,id'],

            'device_type'          => ['required', 'string', 'max:20'],
            'brand'                => ['required', 'string', 'max:50'],
            'model'                => ['required', 'string', 'max:100'],
            'serial_number'        => ['required', 'string', 'max:100', 'unique:devices,serial_number'],
            'inventory_number'     => ['nullable', 'string', 'max:100', 'unique:devices,inventory_number'],

            'physical_location'    => ['required', 'string', 'max:100'],
            'purchase_date'        => ['nullable', 'date'],
            'warranty_end_date'    => ['nullable', 'date'],
            'assignment_date'      => ['nullable', 'date'],

            'status'               => ['required', 'string', 'max:20'],
            'specifications'       => ['nullable', 'string'],
            'notes'                => ['nullable', 'string'],
            'assigned_by'          => ['nullable', 'string', 'max:100'],
            'last_maintenance_date'=> ['nullable', 'date'],

            'has_warranty'         => ['boolean'],
            'requires_maintenance' => ['boolean'],
            'is_insured'           => ['boolean'],
            'is_leased'            => ['boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $device = Device::create($validator->validated());

        return response()->json([
            'status' => true,
            'message' => 'Device created successfully!',
            'data' => $device->load(['owner', 'provider', 'rentalContract']),
        ], 201);
    }

    // GET /api/devices/{id}
    // Mostrar device concret

    public function show($id)
    {
        $device = Device::with(['owner', 'provider', 'rentalContract'])->find($id);

        if (! $device) {
            return response()->json([
                'status' => false,
                'message' => 'Device not found.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $device,
        ], 200);
    }

    // PUT /api/devices/{id}
    // Actualitzar un dispositiu

    public function update(Request $request, $id)
    {
        $device = Device::find($id);

        if (! $device) {
            return response()->json([
                'status' => false,
                'message' => 'Device not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'owner_id'             => ['nullable', 'exists:owners,id'],
            'provider_id'          => ['nullable', 'exists:providers,id'],
            'rental_contract_id'   => ['nullable', 'exists:rental_contracts,id'],

            'device_type'          => ['sometimes', 'string', 'max:20'],
            'brand'                => ['sometimes', 'string', 'max:50'],
            'model'                => ['sometimes', 'string', 'max:100'],
            'serial_number'        => ['sometimes', 'string', 'max:100', 'unique:devices,serial_number,' . $device->id],
            'inventory_number'     => ['nullable', 'string', 'max:100', 'unique:devices,inventory_number,' . $device->id],

            'physical_location'    => ['sometimes', 'string', 'max:100'],
            'purchase_date'        => ['nullable', 'date'],
            'warranty_end_date'    => ['nullable', 'date'],
            'assignment_date'      => ['nullable', 'date'],

            'status'               => ['sometimes', 'string', 'max:20'],
            'specifications'       => ['nullable', 'string'],
            'notes'                => ['nullable', 'string'],
            'assigned_by'          => ['nullable', 'string', 'max:100'],
            'last_maintenance_date'=> ['nullable', 'date'],

            'has_warranty'         => ['boolean'],
            'requires_maintenance' => ['boolean'],
            'is_insured'           => ['boolean'],
            'is_leased'            => ['boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $device->update($validator->validated());

        return response()->json([
            'status'  => true,
            'message' => 'Device updated successfully.',
            'data'    => $device->load(['owner', 'provider', 'rentalContract']),
        ], 200);
    }

    // DELETE /api/devices/{id}
    // Soft delete

    public function destroy($id)
    {
        $device = Device::find($id);

        if (! $device) {
            return response()->json([
                'status' => false,
                'message' => 'Device not found.',
            ], 404);
        }

        $device->delete();

        return response()->json([
            'status' => true,
            'message' => 'Device deleted successfully!',
        ], 200);
    }
}
