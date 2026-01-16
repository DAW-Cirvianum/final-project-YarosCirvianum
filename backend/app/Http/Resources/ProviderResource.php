<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;

class ProviderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            // ========== IDENTIFICACIÓ ==========
            'id' => $this->id,

            // ========== INFORMACIÓ DE LA COMPANYIA ==========
            'name'           => $this->name,
            'contact_person' => $this->contact_person,
            'contact_email'  => $this->contact_email,
            'contact_phone'  => $this->contact_phone,
            'address'        => $this->address,
            'tax_id'         => $this->tax_id,
            'website'        => $this->website,
            'provider_type'  => $this->provider_type,

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
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->header('X-Resource-Type', 'Provider');
        $response->header('X-Resource-ID', (string) $this->id);
    }
}