<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name');
            $table->decimal('total_price', 10, 2); // Total price of the order
            $table->enum('status',['pending','completed','canceled'])->default('pending');
            $table->foreignId('invoice_id')->constrained()->onDelete('cascade'); // Invoice relation
            $table->foreignId('user_id')->constrained()->onDelete('null'); // User relation
            $table->timestamps(); // created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
