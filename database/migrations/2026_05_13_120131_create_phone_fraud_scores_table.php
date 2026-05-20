<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phone_fraud_scores', function (Blueprint $table) {
            $table->id();
            $table->string('phone', 15)->index();
            $table->integer('score');
            $table->enum('risk_level', ['safe', 'medium', 'high']);
            $table->integer('total_orders')->default(0);
            $table->integer('delivered')->default(0);
            $table->integer('cancelled')->default(0);
            $table->integer('returned')->default(0);
            $table->json('courier_breakdown');
            $table->json('flags');
            $table->timestamp('last_fetched_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phone_fraud_scores');
    }
};
