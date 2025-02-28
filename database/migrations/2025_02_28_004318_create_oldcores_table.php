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
        Schema::create('oldcores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('migi_detail_id')->constrained('migi_details')->nullable();
            $table->string('item_code')->nullable();
            $table->string('desc')->nullable();
            $table->integer('total_qty')->default(0);
            $table->string('project_code')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oldcores');
    }
};
