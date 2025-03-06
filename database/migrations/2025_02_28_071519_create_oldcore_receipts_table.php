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
        Schema::create('oldcore_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_number')->nullable();
            $table->foreignId('migi_detail_id')->constrained('migi_details')->nullable();
            $table->date('date');
            $table->string('item_code')->nullable();
            $table->text('desc')->nullable();
            $table->integer('qty');
            $table->decimal('weight_total', 15, 2); // in gr
            $table->foreignId('inventory_id')->constrained('inventories')->nullable();
            $table->decimal('grpo_avg_weight', 15, 2)->nullable();
            $table->decimal('expected_total_weight', 15, 2)->nullable();
            $table->string('project');
            $table->text('remarks')->nullable();
            $table->string('given_by')->nullable();
            $table->string('received_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oldcore_receipts');
    }
};
