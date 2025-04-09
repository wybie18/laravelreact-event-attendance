<?php
namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class StudentsImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    public function model(array $row)
    {
        $email = $row['email'] ?? strtolower($row['last_name'] . '.' . $row['first_name'] . '@sfxc.edu.ph');
        return new Student([
            'student_id'  => $row['student_id'],
            'rfid_uid'    => $row['rfid_uid'],
            'last_name'   => $row['last_name'],
            'first_name'  => $row['first_name'],
            'middle_name' => $row['middle_name'] ?? null,
            'email'       => $email,
            'year_level'  => $row['year_level'],
        ]);
    }

    public function headingRow(): int
    {
        return 2;
    }

    public function rules(): array
    {
        return [
            '*.student_id'  => ['required', 'unique:students,student_id'],
            '*.rfid_uid'    => ['required', 'unique:students,rfid_uid'],
            '*.last_name'   => ['required', 'string', 'max:200'],
            '*.first_name'  => ['required', 'string', 'max:200'],
            '*.email'       => ['nullable', 'email', 'unique:students,email'],
            '*.year_level'  => ['required', 'numeric'],
        ];
    }
}
