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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('item_code')->nullable();
            $table->string('description')->nullable();
            $table->integer('total_qty')->nullable();
            $table->decimal('avg_unit_price', 15, 2)->nullable();
            $table->decimal('total_amount', 15, 2)->nullable();
            $table->string('uom')->nullable();
            $table->decimal('avg_weight', 15, 2)->nullable(); // in gr
            $table->decimal('total_weight', 15, 2)->nullable(); // in gr
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
