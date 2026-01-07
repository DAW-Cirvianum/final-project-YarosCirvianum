<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('legacy_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->unique()->constrained()->onDelete('cascade');
            $table->string('legacy_system_id', 100)->nullable();
            $table->string('legacy_system_name', 100)->nullable();
            $table->date('migration_date');
            $table->text('legacy_data')->nullable();
            $table->text('migration_notes')->nullable();
            
            // Booleans compatibles amb SQL SERVER 
            $table->unsignedTinyInteger('data_validated')->default(0);
            $table->unsignedTinyInteger('needs_review')->default(0);
            
            $table->timestamps();
            
            $table->index(['legacy_system_id', 'device_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legacy_devices');
    }
};