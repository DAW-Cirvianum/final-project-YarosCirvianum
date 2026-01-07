<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Owner extends Model
{
    use HasFactory;

    // ===== Valors per defecte, que no cal posar si ja és aixi, ho poso per l'exemple. =====
    protected $table = 'owners';
    protected $primaryKey = 'id';

    // Camps assignables en mass-assignment

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

    // Casts automatics

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'is_active' => 1,
    ];

    // ===== Query Scopes =====

    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', 0);
    }

    // ===== Relacions =====

    // Un Owner pot tenir molts dispositius
    public function devices()
    {
        return $this->hasMany(Device::class);
    }
}
