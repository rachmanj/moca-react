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
        Schema::create('grpo_temps', function (Blueprint $table) {
            $table->id();
            $table->string('po_no')->nullable();
            $table->date('po_date')->nullable();
            $table->date('po_delivery_date')->nullable();
            $table->date('grpo_date')->nullable();
            $table->date('grpo_create_date')->nullable();
            $table->string('grpo_no')->nullable();
            $table->string('po_delivery_status')->nullable();
            $table->string('vendor_code')->nullable();
            $table->string('dept_code')->nullable();
            $table->string('dept_name')->nullable();
            $table->string('unit_no')->nullable();
            $table->string('item_code')->nullable();
            $table->text('description')->nullable();
            $table->decimal('qty', 10, 2)->nullable();
            $table->string('grpo_currency')->nullable();
            $table->decimal('unit_price', 15, 2)->nullable();
            $table->decimal('item_amount', 15, 2)->nullable();
            $table->string('uom')->nullable();
            $table->decimal('weight', 10, 2)->nullable();
            $table->string('for_project')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grpo_temps');
    }
};
