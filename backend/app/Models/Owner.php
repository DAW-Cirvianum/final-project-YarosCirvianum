<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    // ===== Relacions =====

    public function devices()
    {
        return $this->hasMany(Device::class, 'owner_id');
    }

    // ===== Scopes =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }
}
