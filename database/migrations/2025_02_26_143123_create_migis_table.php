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
        Schema::create('migis', function (Blueprint $table) {
            $table->id();
            $table->string('document_number')->unique();
            $table->date('creation_date')->nullable();
            $table->date('document_date')->nullable();
            $table->string('wo_number')->nullable();
            $table->string('subject')->nullable();
            $table->string('category')->nullable();
            $table->string('issue_purpose')->nullable();
            $table->string('job_category')->nullable();
            $table->string('job_name')->nullable();
            $table->string('unit_number')->nullable();
            $table->string('model_number')->nullable();
            $table->string('serial_number')->nullable();
            $table->decimal('hours_meter', 10, 2)->nullable();
            $table->string('project_code')->nullable();
            $table->string('warehouse_name')->nullable();
            $table->string('no_ba_oldcore')->nullable();
            $table->string('order_type')->nullable();
            $table->string('status_gi')->nullable();
            $table->string('gr_no')->nullable();
            $table->string('m_ret_no')->nullable();
            $table->string('wo_item_code')->nullable();
            $table->string('wo_desc')->nullable();
            $table->text('keterangan')->nullable();
            $table->integer('batch')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('migis');
    }
};
