<?php

namespace App\Http\Controllers\Api;

// Models
use App\Models\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

// Resource
use App\Http\Resources\ProviderResource;

class ProviderController extends Controller
{
    // GET /api/providers
    // Llistar tots els proveïdors

    public function index(Request $request)
    {
        $query = Provider::query();

        // ===== Filtres opcionals =====
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $providers = $query
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data'   => ProviderResource::collection($providers),
        ], 200);
    }

    // POST /api/providers
    // Crear un nou proveïdor

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'            => ['required', 'string', 'max:150', 'unique:providers,name'],
            'contact_person'  => ['nullable', 'string', 'max:100'],
            'email'           => ['nullable', 'email', 'max:150'],
            'phone'           => ['nullable', 'string', 'max:30'],
            'address'         => ['nullable', 'string', 'max:255'],
            'notes'           => ['nullable', 'string'],
            'is_active'       => ['boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $provider = Provider::create($validator->validated());

        return response()->json([
            'status'  => true,
            'message' => 'Provider created successfully!',
            'data'    => new ProviderResource($provider),
        ], 201);
    }

    // GET /api/providers/{id}
    // Mostrar un proveïdor concret

    public function show($id)
    {
        $provider = Provider::find($id);

        if (! $provider) {
            return response()->json([
                'status'  => false,
                'message' => 'Provider not found.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data'   => new ProviderResource($provider),
        ], 200);
    }

    // PUT /api/providers/{id}
    // Actualitzar un proveïdor

    public function update(Request $request, $id)
    {
        $provider = Provider::find($id);

        if (! $provider) {
            return response()->json([
                'status'  => false,
                'message' => 'Provider not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'            => ['sometimes', 'string', 'max:150', 'unique:providers,name,' . $provider->id],
            'contact_person'  => ['nullable', 'string', 'max:100'],
            'email'           => ['nullable', 'email', 'max:150'],
            'phone'           => ['nullable', 'string', 'max:30'],
            'address'         => ['nullable', 'string', 'max:255'],
            'notes'           => ['nullable', 'string'],
            'is_active'       => ['boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $provider->update($validator->validated());

        return response()->json([
            'status'  => true,
            'message' => 'Provider updated successfully.',
            'data'    => new ProviderResource($provider),
        ], 200);
    }

    // DELETE /api/providers/{id}
    // Soft delete d’un proveidor

    public function destroy($id)
    {
        $provider = Provider::find($id);

        if (! $provider) {
            return response()->json([
                'status'  => false,
                'message' => 'Provider not found.',
            ], 404);
        }

        $provider->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Provider deleted successfully!',
        ], 200);
    }
}
