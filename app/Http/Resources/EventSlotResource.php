<?php
namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventSlotResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'event'      => [
                'id'   => $this->event_id,
                'name' => $this->event->name,
                'date' => $this->event->date,
            ],
            'slot_type'  => $this->slot_type,
            'start'      => (new Carbon($this->start))->format('H:i'),
            'end'        => (new Carbon($this->end))->format('H:i'),
            'created_at' => (new Carbon($this->created_at))->format('M d, Y'),
            'updated_at' => (new Carbon($this->updated_at))->format('M d, Y'),
        ];
    }
}
