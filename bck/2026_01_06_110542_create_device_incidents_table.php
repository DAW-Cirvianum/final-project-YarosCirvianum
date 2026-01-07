<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('device_incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->foreignId('reported_by_id')->nullable()->constrained('owners')->onDelete('set null');
            $table->foreignId('assigned_to_id')->nullable()->constrained('owners')->onDelete('set null');
            $table->string('title', 200);
            $table->text('description');
            $table->string('severity', 20)->default('medium');
            $table->string('status', 20)->default('open');
            $table->date('incident_date');
            $table->date('resolved_date')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->text('actions_taken')->nullable();
            
            // Booleans compatibles amb SQL SERVER
            $table->unsignedTinyInteger('requires_attention')->default(1);
            $table->unsignedTinyInteger('is_resolved')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['device_id', 'status', 'severity']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_incidents');
    }
};