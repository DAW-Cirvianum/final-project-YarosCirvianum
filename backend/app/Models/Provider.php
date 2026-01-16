<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Provider",
    title: "Provider",
    description: "Provider model definition",
    required: ["name"],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "name", type: "string", example: "Tech Solutions S.L."),
        new OA\Property(property: "contact_person", type: "string", nullable: true, example: "Joan Garcia"),
        new OA\Property(property: "contact_email", type: "string", format: "email", nullable: true, example: "joan@techsolutions.com"),
        new OA\Property(property: "contact_phone", type: "string", nullable: true, example: "938887766"),
        new OA\Property(property: "address", type: "string", nullable: true, example: "Carrer Major 15, Barcelona"),
        new OA\Property(property: "tax_id", type: "string", nullable: true, example: "B12345678"),
        new OA\Property(property: "website", type: "string", format: "url", nullable: true, example: "https://techsolutions.com"),
        new OA\Property(property: "provider_type", type: "string", example: "rental", description: "rental, lifetime, etc."),
        new OA\Property(property: "is_active", type: "boolean", example: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time")
    ]
)]
class Provider extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'providers';

    protected $fillable = [
        'name',
        'contact_person',
        'contact_email',
        'contact_phone',
        'address',
        'tax_id',
        'website',
        'provider_type',
        'notes',
        'is_active',
    ];

    // Casts per compatibilitat amb SQL Server
    protected $casts = [
        // TinyInt -> boolean
        'is_active' => 'boolean',
    ];

    // Valors per defecte
    protected $attributes = [
        'is_active' => true,
    ];

    // ===== RELACIONS =====

    public function devices()
    {
        return $this->hasMany(Device::class);
    }

    public function rentalContracts()
    {
        return $this->hasMany(RentalContract::class);
    }

    // ===== SCOPES (FILTRES RÀPIDS) =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ===== MÈTODES HELPER =====

    public function deactivate()
    {
        $this->update(['is_active' => false]);
    }
}