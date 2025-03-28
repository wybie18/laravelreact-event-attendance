<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'rfid_uid',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'year_level'
    ];

    public function attendances(){
        return $this->hasMany(Attendance::class, 'student_rfid_uid', 'rfid_uid');
    }
    
    public function getFullNameAttribute()
    {
        return $this->last_name . ' ' . $this->first_name. $this->middle_name ? ' ' . $this->middle_name : '';
    }

    public function getAttendanceStatusForSlot($timeSlotId)
    {
        return $this->attendances()
            ->where('time_slot_id', $timeSlotId)
            ->exists();
    }
}
