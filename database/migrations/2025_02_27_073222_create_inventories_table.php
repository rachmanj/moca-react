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
            $table->integer('qty')->nullable();
            $table->decimal('unit_price', 10, 2)->nullable();
            $table->decimal('item_amount', 10, 2)->nullable();
            $table->string('uom')->nullable();
            $table->decimal('weight', 10, 2)->nullable(); // in gr
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
