<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'provider_id',
        'rental_contract_id',
        'invoice_number',
        'pdf_filename',
        'invoice_date',
        'due_date',
        'amount',
        'tax_amount',
        'total_amount',
        'status',
        'payment_date',
        'notes',
        'is_paid',
        'is_cancelled',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'due_date'     => 'date',
        'payment_date' => 'date',

        // Booleans (tinyint)
        'is_paid'      => 'boolean',
        'is_cancelled' => 'boolean',

        // Decimals
        'amount'       => 'decimal:2',
        'tax_amount'   => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    // ===== Relacions =====

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function rentalContract()
    {
        return $this->belongsTo(rentalContract::class);
    }

    // ===== Scopes =====
    public function scopePending($query)
    {
        return $query->where('is_paid', false)->where('is_cancelled', false);
    }

    public function scopePaid($query)
    {
        return $query->where('is_paid', true);
    }

    public function scopeOverdue($query)
    {
        return $query->where('is_paid', false)
                     ->whereNotNull('due_date')
                     ->whereDate('due_date', '<', now());
    }
}
