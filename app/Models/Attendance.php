<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_rfid_uid',
        'time_slot_id',
    ];

    public function student(){
        return $this->belongsTo(Student::class, 'student_rfid_uid', 'rfid_uid');
    }

    public function timeSlot()
    {
        return $this->belongsTo(EventTimeSlot::class, 'time_slot_id');
    }
}
