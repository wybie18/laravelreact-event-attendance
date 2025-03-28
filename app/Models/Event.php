<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'semester_id',
        'name',
        'date',
        'description',
        'timeSlots'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function semester(){
        return $this->belongsTo(Semester::class);
    }
    public function timeSlots()
    {
        return $this->hasMany(EventTimeSlot::class);
    }
}
