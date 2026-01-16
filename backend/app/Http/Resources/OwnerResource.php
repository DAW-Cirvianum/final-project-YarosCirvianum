<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;

class OwnerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            // ========== IDENTIFICACIÓ ==========
            'id' => $this->id,

            // ========== INFORMACIÓ PERSONAL ==========
            'owner_name'    => $this->owner_name,
            'name'          => $this->owner_name, // Àlies útil per al frontend
            'email'         => $this->email,
            'department'    => $this->department,
            'location'      => $this->location,
            'employee_code' => $this->employee_code,
            'notes'         => $this->notes,

            // ========== CONTACTE ==========
            'phone'     => $this->phone,
            'extension' => $this->extension,

            // ========== ESTAT ==========
            'is_active' => (bool) $this->is_active,

            // ========== DATES DEL SISTEMA ==========
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),

            // ========== RELACIONS (SI ES CARREGUEN) ==========
            'devices_count' => $this->whenLoaded('devices', function () {
                return $this->devices->count();
            }),

            'active_devices_count' => $this->whenLoaded('devices', function () {
                return $this->devices->where('status', '!=', 'retired')->count();
            }),

            // ========== CÀLCULS DINÀMICS ==========
            'has_assigned_devices' => $this->whenLoaded('devices', function () {
                return $this->devices->where('status', 'in_use')->count() > 0;
            }),
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->header('X-Resource-Type', 'Owner');
        $response->header('X-Resource-ID', (string) $this->id);
    }
}