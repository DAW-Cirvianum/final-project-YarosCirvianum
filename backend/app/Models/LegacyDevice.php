<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegacyDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'legacy_system_id',
        'legacy_system_name',
        'migration_date',
        'legacy_data',       // Si és JSON, considera afegir el cast 'array' a sota
        'migration_notes',
        'data_validated',
        'needs_review',
    ];

    // Casts per compatibilitat amb SQL Server
    protected $casts = [
        'migration_date' => 'date',

        // TinyInt -> boolean
        'data_validated' => 'boolean',
        'needs_review'   => 'boolean',
        
        // Opcional: si legacy_data és un JSON a la BD
        // 'legacy_data' => 'array', 
    ];

    // ===== RELACIONS =====

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    // ===== SCOPES (FILTRES RÀPIDS) =====

    public function scopeValidated($query)
    {
        return $query->where('data_validated', true);
    }

    public function scopeNeedsReview($query)
    {
        return $query->where('needs_review', true);
    }
}