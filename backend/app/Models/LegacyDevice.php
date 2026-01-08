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
        'legacy_data',
        'migration_notes',
        'data_validated',
        'needs_review',
    ];

    protected $casts = [
        'migration_date' => 'date',
        'data_validated' => 'boolean',
        'needs_review'   => 'boolean',
    ];

    // ===== Relacions =====

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function scopeValidated()
    {
        return $this->where('data_validated', true);
    }

    public function scopeNeedsReview()
    {
        return $this->where('needs_review', true);
    }
}
