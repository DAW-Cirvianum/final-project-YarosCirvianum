<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('owners', function (Blueprint $table) {
            $table->id();
            $table->string('owner_name', 100);
            $table->string('email', 150)->unique();
            $table->string('department', 100);
            $table->string('location', 100);
            $table->string('employee_code', 50)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('extension', 10)->nullable();
            
            // 1=actiu, 0=inactiu
            $table->unsignedTinyInteger('is_active')->default(1);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['owner_name', 'department', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('owners');
    }
};