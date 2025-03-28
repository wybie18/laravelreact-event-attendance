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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_rfid_uid')->constrained('students', 'rfid_uid')->onDelete('cascade');
            $table->foreignId('time_slot_id')->constrained('event_time_slots')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['student_rfid_uid', 'time_slot_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
