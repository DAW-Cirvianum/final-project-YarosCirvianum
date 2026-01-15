<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Http\Resources\ProviderResource;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = Provider::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', "%{$request->name}%");
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $providers = $query->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(
            ProviderResource::collection($providers),
            [
                'pagination' => [
                    'current_page' => $providers->currentPage(),
                    'last_page'    => $providers->lastPage(),
                    'per_page'     => $providers->perPage(),
                    'total'        => $providers->total(),
                ],
            ]
        );
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'           => ['required', 'string', 'max:100', 'unique:providers,name'],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'contact_email'  => ['nullable', 'email', 'max:150'],
            
            'contact_phone'  => ['nullable', 'string', 'max:20'],
            
            'address'        => ['nullable', 'string', 'max:500'],
            'tax_id'         => ['nullable', 'string', 'max:50'],
            'website'        => ['nullable', 'url', 'max:200'], 
            'provider_type'  => ['nullable', 'string', 'max:20'],
            'notes'          => ['nullable', 'string', 'max:1000'],
            'is_active'      => ['boolean'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $provider = Provider::create($validator->validated());

        return ApiResponse::success(new ProviderResource($provider), null, 201);
    }

    public function show(int $id)
    {
        $provider = Provider::find($id);
        if (! $provider) return ApiResponse::error(['provider' => ['Not found']], 404);

        return ApiResponse::success(new ProviderResource($provider));
    }

    public function update(Request $request, int $id)
    {
        $provider = Provider::find($id);
        if (! $provider) return ApiResponse::error(['provider' => ['Not found']], 404);

        $validator = Validator::make($request->all(), [
            'name'           => ['sometimes', 'string', 'max:100', 'unique:providers,name,' . $provider->id],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'contact_email'  => ['nullable', 'email', 'max:150'],
            'contact_phone'  => ['nullable', 'string', 'max:20'],
            'address'        => ['nullable', 'string', 'max:500'],
            'tax_id'         => ['nullable', 'string', 'max:50'],
            'website'        => ['nullable', 'url', 'max:200'],
            'provider_type'  => ['nullable', 'string', 'max:20'],
            'notes'          => ['nullable', 'string', 'max:1000'],
            'is_active'      => ['boolean'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error($validator->errors()->toArray());
        }

        $provider->update($validator->validated());

        return ApiResponse::success(new ProviderResource($provider));
    }

    public function destroy(int $id)
    {
        $provider = Provider::find($id);
        if (! $provider) return ApiResponse::error(['provider' => ['Not found']], 404);

        $provider->delete();
        return ApiResponse::success();
    }
}