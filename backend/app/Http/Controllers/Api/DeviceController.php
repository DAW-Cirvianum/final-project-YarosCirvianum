<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use App\Models\Device;
use App\Http\Resources\DeviceResource;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeviceController extends Controller
{
    // GET /api/devices
    public function index(Request $request)
    {
        $query = Device::with([
            'owner',
            'provider',
            'rentalContract',
        ]);

        // ===== Filtres =====
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('owner_id')) {
            $query->where('owner_id', $request->owner_id);
        }

        if ($request->filled('provider_id')) {
            $query->where('provider_id', $request->provider_id);
        }

        if ($request->filled('device_type')) {
            $query->where('device_type', 'like', "%{$request->device_type}%");
        }

        if ($request->filled('rental_contract_id')) {
            $query->where('rental_contract_id', $request->rental_contract_id);
        }

        $devices = $query
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(
            DeviceResource::collection($devices),
            [
                'pagination' => [
                    'current_page' => $devices->currentPage(),
                    'last_page'    => $devices->lastPage(),
                    'per_page'     => $devices->perPage(),
                    'total'        => $devices->total(),
                ],
            ]
        );
    }

    // POST /api/devices
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
            return ApiResponse::error($validator->errors()->toArray());
        }

        $device = Device::create($validator->validated());

        return ApiResponse::success(
            new DeviceResource(
                $device->load(['owner', 'provider', 'rentalContract'])
            ),
            null,
            201
        );
    }

    // GET /api/devices/{id}
    public function show(int $id)
    {
        $device = Device::with([
            'owner',
            'provider',
            'rentalContract',
        ])->find($id);

        if (! $device) {
            return ApiResponse::error(['device' => ['Not found']], 404);
        }

        return ApiResponse::success(
            new DeviceResource($device)
        );
    }

    // PUT /api/devices/{id}
    public function update(Request $request, int $id)
    {
        $device = Device::find($id);

        if (! $device) {
            return ApiResponse::error(['device' => ['Not found']], 404);
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
            return ApiResponse::error($validator->errors()->toArray());
        }

        $device->update($validator->validated());

        return ApiResponse::success(
            new DeviceResource(
                $device->load(['owner', 'provider', 'rentalContract'])
            )
        );
    }

    // DELETE /api/devices/{id}
    public function destroy(int $id)
    {
        $device = Device::find($id);

        if (! $device) {
            return ApiResponse::error(['device' => ['Not found']], 404);
        }

        $device->delete();

        return ApiResponse::success();
    }
}
