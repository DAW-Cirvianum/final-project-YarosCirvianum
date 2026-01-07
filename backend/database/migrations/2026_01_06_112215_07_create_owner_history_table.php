<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('owner_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained()->onDelete('cascade');
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->date('assigned_date');
            $table->date('returned_date')->nullable();
            $table->string('assigned_by', 100)->nullable();
            $table->string('returned_to', 100)->nullable();
            $table->text('assignment_notes')->nullable();
            $table->text('return_notes')->nullable();
            
            // Boolean Compatible amb SQL SERVER
            $table->unsignedTinyInteger('was_damaged')->default(0);
            $table->unsignedTinyInteger('needed_maintenance')->default(0);
            
            $table->timestamps();
            
            $table->index(['owner_id', 'device_id']);
            $table->index(['assigned_date', 'returned_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('owner_history');
    }
};