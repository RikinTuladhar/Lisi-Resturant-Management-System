<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name'); // Corresponds to the 'name' fillable
            $table->timestamps(); // Adds 'created_at' and 'updated_at'
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
