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
    // GET /api/owners
    public function index(Request $request)
    {
        $query = Owner::query();

        // ===== Filtres =====
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

    // POST /api/owners
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'       => ['required', 'string', 'max:150'],
            'email'      => ['nullable', 'email', 'max:150'],
            'phone'      => ['nullable', 'string', 'max:30'],
            'department' => ['nullable', 'string', 'max:100'],
            'notes'      => ['nullable', 'string'],
            'is_active'  => ['boolean'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $owner = Owner::create($validator->validated());

        return ApiResponse::success(
            new OwnerResource($owner),
            null,
            201
        );
    }

    // GET /api/owners/{id}
    public function show(int $id)
    {
        $owner = Owner::find($id);

        if (! $owner) {
            return ApiResponse::error(['owner' => ['Not found']], 404);
        }

        return ApiResponse::success(
            new OwnerResource($owner)
        );
    }

    // PUT /api/owners/{id}
    public function update(Request $request, int $id)
    {
        $owner = Owner::find($id);

        if (! $owner) {
            return ApiResponse::error(['owner' => ['Not found']], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'       => ['sometimes', 'string', 'max:150'],
            'email'      => ['nullable', 'email', 'max:150'],
            'phone'      => ['nullable', 'string', 'max:30'],
            'department' => ['nullable', 'string', 'max:100'],
            'notes'      => ['nullable', 'string'],
            'is_active'  => ['boolean'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $owner->update($validator->validated());

        return ApiResponse::success(
            new OwnerResource($owner)
        );
    }

    // DELETE /api/owners/{id}
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
