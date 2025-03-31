<?php
namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SemesterResource extends JsonResource
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
            'name'       => $this->name,
            'start'      => (new Carbon($this->start))->format('Y-m-d'),
            'end'        => (new Carbon($this->end))->format('Y-m-d'),
            'active'     => $this->active,
            'created_at' => (new Carbon($this->created_at))->format('M d, Y'),
            'updated_at' => (new Carbon($this->updated_at))->format('M d, Y'),
        ];
    }
}
