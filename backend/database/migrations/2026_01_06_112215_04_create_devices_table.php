<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            
            // Relacions
            $table->foreignId('owner_id')->nullable()->constrained('owners')->onDelete('set null');
            $table->foreignId('rental_contract_id')->nullable()->constrained('rental_contracts')->onDelete('set null');
            $table->foreignId('provider_id')->nullable()->constrained('providers')->onDelete('set null');
            
            // Informació bàsica
            $table->string('device_type', 20)->default('laptop');
            $table->string('brand', 50);
            $table->string('model', 100);
            $table->string('serial_number', 100)->unique();
            $table->string('inventory_number', 100)->nullable();
            
            // Ubicació i dates
            $table->string('physical_location', 100);
            $table->date('purchase_date')->nullable();
            $table->date('warranty_end_date')->nullable();
            $table->date('assignment_date')->nullable();
            
            // Estat (string per compatibilitat)
            $table->string('status', 20)->default('in_stock');
            
            // Especificacions (text enlloc de json per compatibilitat)
            $table->text('specifications')->nullable();
            
            // Informacio addicional
            $table->text('notes')->nullable();
            $table->string('assigned_by', 100)->nullable();
            $table->date('last_maintenance_date')->nullable();
            
            // Booleans compatibles amb SQL SERVER
            $table->unsignedTinyInteger('has_warranty')->default(0);
            $table->unsignedTinyInteger('requires_maintenance')->default(0);
            $table->unsignedTinyInteger('is_insured')->default(0);
            $table->unsignedTinyInteger('is_leased')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índexs
            $table->index(['serial_number', 'inventory_number']);
            $table->index(['status', 'device_type']);
            $table->index(['owner_id', 'assignment_date']);
            $table->unique('inventory_number', 'devices_inventory_number_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};