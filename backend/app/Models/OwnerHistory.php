<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OwnerHistory extends Model
{
    use HasFactory;

    // Especifiquem la taula perque no segueix la convencio plural (owner_histories)
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
        'needed_maintenance',
    ];

    // Casts per compatibilitat amb SQL Server
    protected $casts = [
        'assigned_date'      => 'date',
        'returned_date'      => 'date',

        // TinyInt -> boolean
        'was_damaged'        => 'boolean',
        'needed_maintenance' => 'boolean',
    ];

    // ===== RELACIONS =====

    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    // ===== SCOPES (FILTRES RÀPIDS) =====

    public function scopeActive($query)
    {
        return $query->whereNull('returned_date');
    }

    public function scopeReturned($query)
    {
        return $query->whereNotNull('returned_date');
    }
}