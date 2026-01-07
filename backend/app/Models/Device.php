<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    // ===== Relacions =====
    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function rentalContract()
    {
        return $this->belongsTo(RentalContract::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function incidents()
    {
        return $this->hasMany(DeviceIncident::class);
    }
    
    public function ownerHistory()
    {
        return $this->hasMany(OwnerHistory::class);
    }

    public function legacyDevice()
    {
        return $this->hasOne(LegacyDevice::class);
    }

    /* ================= SCOPES ================= */

    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'retired');
    }

    public function scopeInStock($query)
    {
        return $query->where('status', 'in_stock');
    }

}
