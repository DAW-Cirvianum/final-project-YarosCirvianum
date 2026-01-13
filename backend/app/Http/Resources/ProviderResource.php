<?php
// app/Http/Resources/ProviderResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // ========== IDENTIFICACIÓ ==========
            'id' => $this->id,
            
            // ========== INFORMACIÓ DE LA COMPANYIA ==========
            'name' => $this->name,
            'contact_person' => $this->contact_person,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'address' => $this->address,
            'tax_id' => $this->tax_id,
            'website' => $this->website,
            'provider_type' => $this->provider_type,
            
            // ========== INFORMACIÓ ADICIONAL ==========
            'notes' => $this->notes,
            
            // ========== ESTAT ==========
            'is_active' => (bool) $this->is_active,
            
            // ========== DATES DEL SISTEMA ==========
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // ========== RELACIONS (SI ES CARREGUEN) ==========
            'devices_count' => $this->whenLoaded('devices', function () {
                return $this->devices->count();
            }),
            
            'rental_contracts_count' => $this->whenLoaded('rentalContracts', function () {
                return $this->rentalContracts->count();
            }),
            
            'active_contracts_count' => $this->whenLoaded('rentalContracts', function () {
                return $this->rentalContracts->where('status', 'active')->count();
            }),
            
            // ========== CÀLCULS DINÀMICS ==========
            'has_active_contracts' => $this->whenLoaded('rentalContracts', function () {
                return $this->rentalContracts->where('status', 'active')->count() > 0;
            }),
            
            // ========== LINKS PER A NAVEGACIÓ ==========
            'links' => [
                'self' => route('api.providers.show', $this->id),
                'devices' => route('api.devices.index', ['provider_id' => $this->id]),
                'rental_contracts' => route('api.rental-contracts.index', ['provider_id' => $this->id]),
            ],
        ];
    }
    
    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse($request, $response)
    {
        $response->header('X-Resource-Type', 'Provider');
    }
}