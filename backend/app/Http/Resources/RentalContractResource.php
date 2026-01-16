<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;

class RentalContractResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            // ========== IDENTIFICACIÓ ==========
            'id' => $this->id,

            // ========== INFORMACIÓ DEL CONTRACTE ==========
            'contract_number' => $this->contract_number,
            'contract_code'   => $this->contract_number, // Àlies útil
            'name'            => $this->name,
            'pdf_filename'    => $this->pdf_filename,

            // ========== DATES DEL CONTRACTE ==========
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date'   => $this->end_date?->format('Y-m-d'),

            // ========== INFORMACIÓ ECONÒMICA ==========
            'monthly_cost' => $this->monthly_cost ? (float) $this->monthly_cost : null,

            // ========== ESTAT I DETALLS ==========
            'status' => $this->status,
            'terms'  => $this->terms,
            'notes'  => $this->notes,

            // ========== DATES DEL SISTEMA ==========
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),

            // ========== RELACIONS (SI ES CARREGUEN) ==========
            'provider' => $this->whenLoaded('provider', function () {
                return $this->provider ? [
                    'id'             => $this->provider->id,
                    'name'           => $this->provider->name,
                    'contact_person' => $this->provider->contact_person,
                    'contact_email'  => $this->provider->contact_email,
                    'is_active'      => (bool) $this->provider->is_active,
                ] : null;
            }),

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
                ? now()->diffInDays($this->end_date, false) // Negatiu si ha expirat
                : null,

            'total_cost_to_date' => $this->monthly_cost && $this->start_date
                ? $this->calculateTotalCostToDate()
                : null,

            // ========== IDs DE RELACIONS ==========
            'provider_id' => $this->provider_id,
        ];
    }

    /**
     * Calcular el cost total des de start date fins avui
     */
    private function calculateTotalCostToDate(): float
    {
        if (! $this->monthly_cost || ! $this->start_date) {
            return 0.0;
        }

        // Si la data d'inici és futura, el cost és 0
        if (now()->lessThan($this->start_date)) {
            return 0.0;
        }

        $startDate = $this->start_date;
        $endDate   = now();

        // Si el contracte ja ha acabat (i expirat), parem de comptar a la data fi?
        // De moment comptem fins avui, o fins a end_date si ja ha passat:
        if ($this->end_date && now()->greaterThan($this->end_date)) {
            $endDate = $this->end_date;
        }

        // Càlcul de mesos complets (o aproximats)
        // Utilitzem floatDiffInMonths per més precisió o diffInMonths per enters
        $months = $startDate->diffInMonths($endDate) + 1;

        return (float) ($this->monthly_cost * $months);
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->header('X-Resource-Type', 'RentalContract');
        $response->header('X-Resource-ID', (string) $this->id);
    }
}