<?php
// app/Http/Resources/RentalContractResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalContractResource extends JsonResource
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
            
            // ========== INFORMACIÓ DEL CONTRACTE ==========
            'contract_number' => $this->contract_number,
            'name' => $this->name,
            'pdf_filename' => $this->pdf_filename,
            
            // ========== DATES DEL CONTRACTE ==========
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            
            // ========== INFORMACIÓ ECONÒMICA ==========
            'monthly_cost' => $this->monthly_cost ? (float) $this->monthly_cost : null,
            
            // ========== ESTAT I DETALLS ==========
            'status' => $this->status,
            'terms' => $this->terms,
            'notes' => $this->notes,
            
            // ========== DATES DEL SISTEMA ==========
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // ========== RELACIONS (SI ES CARREGUEN) ==========
            // Provider: Informació reduïda
            'provider' => $this->whenLoaded('provider', function () {
                return $this->provider ? [
                    'id' => $this->provider->id,
                    'name' => $this->provider->name,
                    'contact_person' => $this->provider->contact_person,
                    'contact_email' => $this->provider->contact_email,
                    'is_active' => (bool) $this->provider->is_active,
                ] : null;
            }),
            
            // Estadístiques de dispositius
            'devices_count' => $this->whenLoaded('devices', function () {
                return $this->devices->count();
            }),
            
            'active_devices_count' => $this->whenLoaded('devices', function () {
                return $this->devices->where('status', '!=', 'retired')->count();
            }),
            
            // ========== CÀLCULS DINÀMICS ==========
            'is_active' => $this->status === 'active',
            
            'is_expired' => $this->end_date 
                ? now()->greaterThan($this->end_date)
                : false,
            
            'days_remaining' => $this->end_date 
                ? now()->diffInDays($this->end_date, false)  // Negatiu si ha expirat
                : null,
            
            'total_cost_to_date' => $this->monthly_cost && $this->start_date 
                ? $this->calculateTotalCostToDate()
                : null,
            
            // ========== IDs DE RELACIONS ==========
            'provider_id' => $this->provider_id,
            
            // ========== LINKS PER A NAVEGACIÓ ==========
            'links' => [
                'self' => route('api.rental-contracts.show', $this->id),
                'provider' => route('api.providers.show', $this->provider_id),
                'devices' => route('api.devices.index', ['rental_contract_id' => $this->id]),
                'pdf_download' => 'cal implementar al RentalContractResource.php',
                // 'pdf_download' => $this->pdf_filename 
                //     ? route('api.rental-contracts.download', $this->id)
                //     : null,
            ],
        ];
    }
    
    /**
     * Calculate total cost from start date to today
     */
    private function calculateTotalCostToDate(): float
    {
        if (!$this->monthly_cost || !$this->start_date) {
            return 0.0;
        }
        
        $startDate = $this->start_date;
        $today = now();
        
        // Calculate months difference
        $months = $today->diffInMonths($startDate) + 1; // +1 to include current month
        
        return (float) ($this->monthly_cost * $months);
    }
    
    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse($request, $response)
    {
        $response->header('X-Resource-Type', 'RentalContract');
    }
}