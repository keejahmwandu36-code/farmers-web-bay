<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('field_id')->constrained()->cascadeOnDelete();
            $table->string('device_uid')->unique();
            $table->string('status')->default('offline');
            $table->unsignedTinyInteger('battery_level')->nullable();
            $table->integer('signal_strength')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('devices'); }
};
