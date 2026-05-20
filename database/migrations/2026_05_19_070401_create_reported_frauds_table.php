<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reported_frauds', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->index();
            $table->string('name')->nullable();
            $table->text('details')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // The user who reported it manually
            $table->string('source')->default('manual'); // e.g. 'manual', 'steadfast'
            $table->string('external_id')->nullable()->index(); // e.g. Steadfast's fraud id to prevent duplicates
            $table->boolean('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reported_frauds');
    }
};
