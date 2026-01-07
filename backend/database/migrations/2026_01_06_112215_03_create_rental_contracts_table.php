<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->onDelete('cascade');
            $table->string('contract_number', 100)->unique();
            $table->string('name', 200);
            $table->string('pdf_filename')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('monthly_cost', 10, 2)->nullable();
            $table->string('status', 20)->default('active');
            $table->text('terms')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['contract_number', 'status', 'provider_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_contracts');
    }
};