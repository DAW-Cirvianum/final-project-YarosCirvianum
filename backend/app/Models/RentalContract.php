<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "RentalContract",
    title: "RentalContract",
    description: "Rental Contract model definition",
    required: ["provider_id", "contract_number", "start_date", "status"],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "provider_id", type: "integer", example: 2),
        new OA\Property(property: "contract_number", type: "string", example: "RC-2024-001"),
        new OA\Property(property: "name", type: "string", nullable: true, example: "Main Office Lease"),
        new OA\Property(property: "start_date", type: "string", format: "date", example: "2024-01-01"),
        new OA\Property(property: "end_date", type: "string", format: "date", nullable: true, example: "2027-01-01"),
        new OA\Property(property: "monthly_cost", type: "number", format: "float", nullable: true, example: 450.50),
        new OA\Property(property: "status", type: "string", example: "active"),
        new OA\Property(property: "terms", type: "string", nullable: true),
        new OA\Property(property: "notes", type: "string", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time")
    ]
)]
class RentalContract extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'rental_contracts';

    protected $fillable = [
        'provider_id',
        'contract_number',
        'name',
        'start_date',
        'end_date',
        'monthly_cost',
        'status',
        'terms',
        'notes',
    ];

    // Casts per compatibilitat i format decimal
    protected $casts = [
        'start_date'   => 'date',
        'end_date'     => 'date',
        'monthly_cost' => 'decimal:2',
    ];

    // ===== RELACIONS =====

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function devices()
    {
        return $this->hasMany(Device::class);
    }

    // ===== SCOPES (FILTRES RÀPIDS) =====

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpired($query)
    {
        return $query->whereDate('end_date', '<', now());
    }
}