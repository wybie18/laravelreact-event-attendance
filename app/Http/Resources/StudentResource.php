<?php
namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'student_id'  => $this->student_id,
            'rfid_uid'    => $this->rfid_uid,
            'first_name'  => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name'   => $this->last_name,
            'email'       => $this->email,
            'year_level'  => $this->year_level,
            'created_at'  => (new Carbon($this->created_at))->format('Y/d/m, h:i:s'),
            'updated_at'  => (new Carbon($this->updated_at))->format('Y/d/m, h:i:s'),
        ];
    }
}
