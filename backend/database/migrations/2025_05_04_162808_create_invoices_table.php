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
            $table->decimal('discount', 8, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            $table->decimal('service_charge', 8, 2)->default(0);
            $table->enum('status',['pending','completed','canceled'])->default('pending');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Assuming invoices belong to a user
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
