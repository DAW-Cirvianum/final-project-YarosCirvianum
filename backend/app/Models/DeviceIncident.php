<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeviceIncident extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'device_id',
        'reported_by_id',
        'assigned_to_id',
        'title',
        'description',
        'severity',
        'status',
        'incident_date',
        'resolved_date',
        'resolution_notes',
        'actions_taken',
        'requires_attention',
        'is_resolved',
    ];

    // Casts per compatibilitat amb SQL Server

    protected $casts = [
        'incident_date'      => 'date',
        'resolved_date'      => 'date',
        // Booleans
        'requires_attention' => 'boolean',
        'is_resolved'        => 'boolean',
    ];

    // ===== Relacions =====
    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function reportedBy()
    {
        return $this->belongsTo(Owner::class, 'reported_by_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(Owner::class, 'assigned_to_id');
    }

    // ===== SCOPES =====
    public function scopeUnresolved($query)
    {
        return $query->where('is_resolved', false);
    }

    public function scopeResolved($query)
    {
        return $query->where('is_resolved', true);
    }

    public function scopeRequiresAttention($query)
    {
        return $query->where('requires_attention', true);
    }
}
