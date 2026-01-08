<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnerHistory extends Model
{
    use HasFactory;

    protected $table = 'owner_history';

    protected $fillable = [
        'owner_id',
        'device_id',
        'assigned_date',
        'returned_date',
        'assigned_by',
        'returned_to',
        'assignment_notes',
        'return_notes',
        'was_damaged',
        'needed_maintenace',
    ];

    protected $casts = [
        'assignment_date'    => 'date',
        'returned_date'      => 'date',
        'was_damaged'        => 'boolean',
        'needed_maintenance' => 'boolean',
    ];

    // ===== Relacions =====

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    // ===== Scopes =====

    public function scopeActive($query)
    {
        return $query->whereNull('returned_date');
    }

    public function scopeReturned($query)
    {
        return $query->whereNotNull('returned_date');
    }
}
