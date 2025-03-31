<?php

namespace App\Models;

use App\Casts\TimeCast;
use Illuminate\Database\Eloquent\Model;

class EventTimeSlot extends Model
{
    protected $fillable = [
        'event_id',
        'slot_type',
        'start',
        'end',
    ];

    protected $casts = [
        'start' => TimeCast::class,
        'end' => TimeCast::class,
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function attendances(){
        return $this->hasMany(Attendance::class, 'time_slot_id');
    }
}
