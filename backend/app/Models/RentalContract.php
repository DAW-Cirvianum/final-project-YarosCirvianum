<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    protected $casts = [
        'start_date'   => 'date',
        'end_date'     => 'date',
        'monthly_cost' => 'decimal:2',
    ];

    // ===== Relacions =====

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }

    public function devices()
    {
        return $this->hasMany(Device::class, 'rental_contract_id');
    }

    // ===== Scopes =====

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpired($query)
    {
        return $query->whereDate('end_date', '<', now());
    }
}
