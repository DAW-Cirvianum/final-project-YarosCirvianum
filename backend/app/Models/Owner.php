<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Owner",
    title: "Owner",
    description: "Owner model definition",
    required: ["owner_name"],
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "owner_name", type: "string", example: "John Doe"),
        new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
        new OA\Property(property: "department", type: "string", example: "IT"),
        new OA\Property(property: "location", type: "string", example: "Barcelona"),
        new OA\Property(property: "employee_code", type: "string", example: "EMP-001"),
        new OA\Property(property: "phone", type: "string", example: "600123456"),
        new OA\Property(property: "extension", type: "string", example: "101"),
        new OA\Property(property: "is_active", type: "boolean", example: true),
        new OA\Property(property: "notes", type: "string", example: "Contractat el 2023"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time")
    ]
)]
class Owner extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'owners';

    protected $fillable = [
        'owner_name',
        'email',
        'department',
        'location',
        'employee_code',
        'phone',
        'extension',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'is_active'   => 'boolean',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
        'deleted_at'  => 'datetime',
    ];

    protected $attributes = [
        'is_active' => true,
    ];

    // ===== RELACIONS =====
    public function device() { return $this->belongsTo(Device::class); }
    public function owner() { return $this->belongsTo(Owner::class); }

    // ===== SCOPES =====
    public function scopeCurrent($query) { return $query->whereNull('unassigned_at'); }
    public function scopePast($query) { return $query->whereNotNull('unassigned_at'); }
}