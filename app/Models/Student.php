<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'rfid_uid',
        'student_id',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'year_level',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_rfid_uid', 'rfid_uid');
    }

    public function getFullNameAttribute()
    {
        $fullName = "{$this->last_name}, {$this->first_name}";

        if (! empty($this->middle_name)) {
            $fullName .= " {$this->middle_name}";
        }

        return $fullName;
    }

    public function getAttendanceStatusForSlot($timeSlotId)
    {
        return $this->attendances()
            ->where('time_slot_id', $timeSlotId)
            ->exists();
    }
}
