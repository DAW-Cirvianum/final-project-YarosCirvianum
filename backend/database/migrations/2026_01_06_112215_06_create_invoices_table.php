<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->onDelete('cascade');
            $table->foreignId('rental_contract_id')->nullable()->constrained()->onDelete('set null');
            $table->string('invoice_number', 100)->unique();
            $table->string('pdf_filename')->nullable();
            $table->date('invoice_date');
            $table->date('due_date')->nullable();
            $table->decimal('amount', 10, 2);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->string('status', 20)->default('pending');
            $table->date('payment_date')->nullable();
            $table->text('notes')->nullable();
            
            // Booleans compatibles amb SQL SERVER 
            $table->unsignedTinyInteger('is_paid')->default(0);
            $table->unsignedTinyInteger('is_cancelled')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['invoice_number', 'status', 'invoice_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};