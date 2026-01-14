<?php
// app/Http/Resources/DeviceResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeviceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            // ========== IDENTIFICACIÓ ==========
            'id' => $this->id,
            
            // ========== INFORMACIÓ BÀSICA ==========
            'device_type' => $this->device_type,
            'brand' => $this->brand,
            'model' => $this->model,
            'serial_number' => $this->serial_number,
            'inventory_number' => $this->inventory_number,
            
            // ========== UBICACIÓ I DATES ==========
            'physical_location' => $this->physical_location,
            'purchase_date' => $this->purchase_date?->format('Y-m-d'),
            'warranty_end_date' => $this->warranty_end_date?->format('Y-m-d'),
            'assignment_date' => $this->assignment_date?->format('Y-m-d'),
            'last_maintenance_date' => $this->last_maintenance_date?->format('Y-m-d'),
            
            // ========== ESTAT I CONFIGURACIÓ ==========
            'status' => $this->status,
            'specifications' => $this->specifications,
            'notes' => $this->notes,
            'assigned_by' => $this->assigned_by,
            
            // ========== BANDERES (BOOLEANS) ==========
            'has_warranty' => (bool) $this->has_warranty,
            'requires_maintenance' => (bool) $this->requires_maintenance,
            'is_insured' => (bool) $this->is_insured,
            'is_leased' => (bool) $this->is_leased,
            
            // ========== DATES DEL SISTEMA ==========
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),

            // ========== RELACIONS (SI ES CARREGUEN) ==========
            'owner'     => $this->whenLoaded('owner', function () {
                return $this->owner ? [
                    'id' => $this->owner->id,
                    'owner_name' => $this->owner->owner_name,
                    'email' => $this->owner->email,
                    'department' => $this->owner->department,
                    'location' => $this->owner->location,
                    'is_active' => (bool) $this->owner->is_active,
                ] : null;
            }),

            // Provider: Informació reduïda del proveïdor
            'provider' => $this->whenLoaded('provider', function () {
                return $this->provider ? [
                    'id' => $this->provider->id,
                    'name' => $this->provider->name,
                    'contact_person' => $this->provider->contact_person,
                    'contact_email' => $this->provider->contact_email,
                    'contact_phone' => $this->provider->contact_phone,
                    'is_active' => (bool) $this->provider->is_active,
                ] : null;
            }),

            // Rental Contract: Informació bàsica del contracte
            'rental_contract' => $this->whenLoaded('rentalContract', function () {
                return $this->rentalContract ? [
                    'id' => $this->rentalContract->id,
                    'contract_number' => $this->rentalContract->contract_number,
                    'name' => $this->rentalContract->name,
                    'start_date' => $this->rentalContract->start_date?->format('Y-m-d'),
                    'end_date' => $this->rentalContract->end_date?->format('Y-m-d'),
                    'monthly_cost' => $this->rentalContract->monthly_cost ? (float) $this->rentalContract->monthly_cost : null,
                    'status' => $this->rentalContract->status,
                ] : null;
            }),

            // ========== IDs DE RELACIONS (per a forms) ==========
            // IMPORTANT: Mantenim els IDs perquè React pugui enviar-los en updates
            'owner_id' => $this->owner_id,
            'provider_id' => $this->provider_id,
            'rental_contract_id' => $this->rental_contract_id,

            // ========== ESTADÍSTIQUES (si es carreguen) ==========
            // DESHABILITAT
            // 'incidents_count' => $this->whenLoaded('incidents', function () {
            //     return $this->incidents->count();
            // }),

            // 'active_incidents_count' => $this->whenLoaded('incidents', function () {
            //     return $this->incidents->where('is_resolved', false)->count();
            // }),

            // ========== CÀLCULS DINÀMICS ==========
            'is_warranty_active' => $this->warranty_end_date 
                ? now()->lessThanOrEqualTo($this->warranty_end_date)
                : false,
            
            'needs_maintenance_soon' => $this->last_maintenance_date 
                ? now()->diffInMonths($this->last_maintenance_date) >= 6
                : false,
        ];
    }

        
    /**
     * Customize the outgoing response for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Response  $response
     * @return void
     */
    public function withResponse($request, $response)
    {
        // Afegim headers útils
        $response->header('X-Resource-Type', 'Device');
        $response->header('X-Resource-ID', $this->id);
    }

}