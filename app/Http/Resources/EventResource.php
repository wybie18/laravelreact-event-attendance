<?php
namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'semester'    => new SemesterResource($this->semeter),
            'name'        => $this->name,
            'date'        => (new Carbon($this->date))->format('M d, Y'),
            'description' => $this->description,
            'created_at' => (new Carbon($this->created_at))->format('M d, Y'),
            'updated_at' => (new Carbon($this->updated_at))->format('M d, Y'),
        ];
    }
}
