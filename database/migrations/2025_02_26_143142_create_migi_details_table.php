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
        Schema::create('migi_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('migi_id')->constrained('migis');
            $table->integer('line')->nullable();
            $table->string('item_code')->nullable();
            $table->string('desc')->nullable();
            $table->integer('qty')->nullable();
            $table->decimal('stock_price', 10, 2)->nullable();
            $table->decimal('total_price', 10, 2)->nullable();
            $table->integer('wo_qty')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('migi_details');
    }
};
