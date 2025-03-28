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
            'event'      => new EventResource($this->semeter),
            'slot_type'  => $this->slot_type,
            'start'      => $this->start,
            'end'        => $this->end,
            'created_at' => (new Carbon($this->created_at))->format('M d, Y'),
            'updated_at' => (new Carbon($this->updated_at))->format('M d, Y'),
        ];
    }
}
