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
        Schema::create('grpos', function (Blueprint $table) {
            $table->id();   
            $table->date('grpo_date')->nullable();          
            $table->date('grpo_create_date')->nullable();
            $table->string('grpo_no')->nullable();
            $table->string('unit_no')->nullable();
            $table->string('for_project')->nullable();
            $table->string('remarks')->nullable();
            $table->integer('batch')->nullable();
            $table->timestamps();
        });     
    }

    /**
     * Reverse the migrations.  
     */
    public function down(): void
    {
        Schema::dropIfExists('grpos');
    }
};
