<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Helpers\ApiResponse;
use App\Models\Owner;
use App\Http\Resources\OwnerResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OwnerController extends Controller
{
    public function index(Request $request)
    {
        $query = Owner::query();

        if ($request->filled('name')) {
            $query->where('owner_name', 'like', "%{$request->name}%");
        }
        if ($request->filled('email')) {
            $query->where('email', 'like', "%{$request->email}%");
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $owners = $query->orderByDesc('created_at')
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

        $validated = $validator->validated();

        $owner = Owner::create([
            'owner_name'    => $validated['name'],
            'email'         => $validated['email'] ?? null,
            'phone'         => $validated['phone'] ?? null,
            'extension'     => $validated['extension'] ?? null,
            'department'    => $validated['department'] ?? null,
            'location'      => $validated['location'] ?? null,
            'employee_code' => $validated['employee_code'] ?? null,
            'notes'         => $validated['notes'] ?? null,
            'is_active'     => $validated['is_active'] ?? true,
        ]);

        return ApiResponse::success(new OwnerResource($owner), null, 201);
    }

    public function show(int $id)
    {
        $owner = Owner::find($id);
        if (!$owner) return ApiResponse::error(['owner' => ['Not found']], 404);
        
        return ApiResponse::success(new OwnerResource($owner));
    }

    public function update(Request $request, int $id)
    {
        $owner = Owner::find($id);
        if (!$owner) return ApiResponse::error(['owner' => ['Not found']], 404);

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

        $validated = $validator->validated();

        if (array_key_exists('name', $validated)) {
            $owner->owner_name = $validated['name'];
        }

        $owner->fill(collect($validated)->except(['name'])->toArray());
        
        $owner->save();

        return ApiResponse::success(new OwnerResource($owner));
    }

    public function destroy(int $id)
    {
        $owner = Owner::find($id);
        if (!$owner) return ApiResponse::error(['owner' => ['Not found']], 404);
        
        $owner->delete();
        return ApiResponse::success();
    }
}