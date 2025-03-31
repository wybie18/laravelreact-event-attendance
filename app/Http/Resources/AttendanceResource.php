<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student' => new StudentResource($this->student),
            'timeSlot' => new EventSlotResource($this->timeSlot),
            'created_at'  => (new Carbon($this->created_at)),
            'updated_at'  => (new Carbon($this->updated_at)),
        ];
    }
}
