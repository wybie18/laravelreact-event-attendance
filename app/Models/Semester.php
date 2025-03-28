<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $fillable = [
        'name',
        'start',
        'end',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
        'start' => 'date',
        'end' => 'date',
    ];

    public function events(){
        return $this->hasMany(Event::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
