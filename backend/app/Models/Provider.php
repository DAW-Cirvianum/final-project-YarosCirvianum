<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    // ===== Valors per defecte, que no cal posar si ja és aixi, ho poso per l'exemple. =====
    protected $table = 'providers';
    protected $primaryKey = 'id';

    // Camps assignables en mass-assignment

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
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];


    // ===== Scopes =====
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    // ===== Desactivar el Provider =====
    public function deactivate()
    {
        $this->update(['is_active' => 0]);
    }
}
