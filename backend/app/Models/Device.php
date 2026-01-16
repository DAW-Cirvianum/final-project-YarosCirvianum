<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Device",
    title: "Device",
    description: "Device model definition",
    required: ["device_type", "brand", "model", "serial_number", "physical_location", "status"],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "device_type", type: "string", example: "laptop"),
        new OA\Property(property: "brand", type: "string", example: "Dell"),
        new OA\Property(property: "model", type: "string", example: "XPS 15"),
        new OA\Property(property: "serial_number", type: "string", example: "SN-123456789"),
        new OA\Property(property: "inventory_number", type: "string", nullable: true, example: "INV-001"),
        new OA\Property(property: "physical_location", type: "string", example: "Office 101"),
        new OA\Property(property: "status", type: "string", example: "in_stock", description: "in_stock, assigned, repair, retired"),
        new OA\Property(property: "purchase_date", type: "string", format: "date", example: "2024-01-01"),
        new OA\Property(property: "warranty_end_date", type: "string", format: "date", example: "2026-01-01"),
        new OA\Property(property: "has_warranty", type: "boolean", example: true),
        new OA\Property(property: "owner_id", type: "integer", nullable: true, example: 5),
        new OA\Property(property: "provider_id", type: "integer", nullable: true, example: 2),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time")
    ]
)]
class Device extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id',
        'rental_contract_id',
        'provider_id',
        'device_type',
        'brand',
        'model',
        'serial_number',
        'inventory_number',
        'physical_location',
        'purchase_date',
        'warranty_end_date',
        'assignment_date',
        'status',
        'specifications',
        'notes',
        'assigned_by',
        'last_maintenance_date',
        'has_warranty',
        'requires_maintenance',
        'is_insured',
        'is_leased',
    ];

    // Casts per compatibilitat amb SQL Server
    protected $casts = [
        'purchase_date'         => 'date',
        'warranty_end_date'     => 'date',
        'assignment_date'       => 'date',
        'last_maintenance_date' => 'date',

        // TinyInt -> boolean
        'has_warranty'          => 'boolean',
        'requires_maintenance'  => 'boolean',
        'is_insured'            => 'boolean',
        'is_leased'             => 'boolean',
    ];

    // ===== RELACIONS =====
    public function owner() { return $this->belongsTo(Owner::class); }
    public function rentalContract() { return $this->belongsTo(RentalContract::class); }
    public function provider() { return $this->belongsTo(Provider::class); }
    public function incidents() { return $this->hasMany(DeviceIncident::class); }
    public function ownerHistory() { return $this->hasMany(OwnerHistory::class); }
    public function legacyDevice() { return $this->hasOne(LegacyDevice::class); }

    // ===== SCOPES (FILTRES RAPIDS) =====
    public function scopeActive($query) { return $query->where('status', '!=', 'retired'); }
    public function scopeInStock($query) { return $query->where('status', 'in_stock'); }
}