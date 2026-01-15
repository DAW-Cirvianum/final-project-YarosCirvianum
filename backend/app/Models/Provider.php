<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => true,
    ];

    // ===== Relacions =====

    public function devices()
    {
        return $this->hasMany(Device::class, 'provider_id');
    }

    public function rentalContracts()
    {
        return $this->hasMany(RentalContract::class, 'provider_id');
    }

    // ===== Scopes =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function deactivate()
    {
        $this->update(['is_active' => false]);
    }
}
