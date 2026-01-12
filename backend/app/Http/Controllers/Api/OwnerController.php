<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Owner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OwnerController extends Controller
{
    // GET /api/owners
    // Llistar owners amb filtre opcional active/inactive
    public function index(Request $request)
    {
        $query = Owner::query();

        if ($request->filled('is_active')) {
            $query->where('is_active', (bool) $request->is_active);
        }

        $owners = $query->orderBy('owner_name')->get();

        return response()->json([
            'status' => true,
            'data'   => $owners,
        ], 200);
    }

    // POST /api/owners
    // Crear un nou owner
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'owner_name'   => ['required', 'string', 'max:100'],
            'email'        => ['required', 'email', 'max:150', 'unique:owners,email'],
            'department'   => ['required', 'string', 'max:100'],
            'location'     => ['required', 'string', 'max:100'],
            'employee_code'=> ['nullable', 'string', 'max:50'],
            'phone'        => ['nullable', 'string', 'max:20'],
            'extension'    => ['nullable', 'string', 'max:10'],
            'is_active'    => ['boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $owner = Owner::create($validator->validated());

        return response()->json([
            'status'  => true,
            'message' => 'Owner created successfully.',
            'data'    => $owner,
        ], 201);
    }

    // GET /api/owners/{id}
    // Mostrar un owner concret
    public function show($id)
    {
        $owner = Owner::find($id);

        if (! $owner) {
            return response()->json([
                'status'  => false,
                'message' => 'Owner not found.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data'   => $owner,
        ], 200);
    }

    // PUT /api/owners/{id}
    // Actualitzar un owner
    public function update(Request $request, $id)
    {
        $owner = Owner::find($id);

        if (! $owner) {
            return response()->json([
                'status'  => false,
                'message' => 'Owner not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'owner_name'   => ['sometimes', 'string', 'max:100'],
            'email'        => ['sometimes', 'email', 'max:150', 'unique:owners,email,' . $owner->id],
            'department'   => ['sometimes', 'string', 'max:100'],
            'location'     => ['sometimes', 'string', 'max:100'],
            'employee_code'=> ['nullable', 'string', 'max:50'],
            'phone'        => ['nullable', 'string', 'max:20'],
            'extension'    => ['nullable', 'string', 'max:10'],
            'is_active'    => ['boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $owner->update($validator->validated());

        return response()->json([
            'status'  => true,
            'message' => 'Owner updated successfully.',
            'data'    => $owner,
        ], 200);
    }

    // DELETE /api/owners/{id}
    // Soft delete (marca is_active = 0)
    public function destroy($id)
    {
        $owner = Owner::find($id);

        if (! $owner) {
            return response()->json([
                'status'  => false,
                'message' => 'Owner not found.',
            ], 404);
        }

        // Soft delete real: actualitza is_active i deleted_at
        $owner->update(['is_active' => 0]);
        $owner->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Owner deleted successfully.',
        ], 200);
    }
}
