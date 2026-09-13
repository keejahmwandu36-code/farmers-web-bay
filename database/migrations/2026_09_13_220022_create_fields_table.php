<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('crop')->nullable();
            $table->decimal('area', 8, 2)->nullable();
            $table->decimal('minimum_moisture', 5, 2)->default(30.00);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('fields'); }
};
