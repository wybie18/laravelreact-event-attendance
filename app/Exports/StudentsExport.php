<?php
namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StudentsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnWidths
{
    protected $yearLevel;
    protected $search;

    public function __construct($yearLevel = null, $search = null)
    {
        $this->yearLevel = $yearLevel;
        $this->search    = $search;
    }
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Student::query()
            ->when($this->search, function ($q) {
                $q->where(function ($query) {
                    $query->where('first_name', 'like', "%{$this->search}%")
                        ->orWhere('middle_name', 'like', "%{$this->search}%")
                        ->orWhere('last_name', 'like', "%{$this->search}%")
                        ->orWhere('student_id', 'like', "%{$this->search}%")
                        ->orWhere('email', 'like', "%{$this->search}%");
                });
            })
            ->when($this->yearLevel, function ($q) {
                $q->where('year_level', $this->yearLevel);
            })
            ->orderBy('year_level')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Student ID',
            'RFID UID',
            'Last Name',
            'First Name',
            'Middle Name',
            'Email',
            'Year Level',
            'Date Registered',
        ];
    }

    public function map($student): array
    {
        return [
            $student->student_id,
            $student->rfid_uid,
            $student->last_name,
            $student->first_name,
            $student->middle_name ?: 'N/A',
            $student->email,
            $student->year_level,
            $student->created_at->format('Y-m-d'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1          => [
                'font'      => ['bold' => true],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
                'fill'      => [
                    'fillType'   => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E2F0D9'],
                ],
            ],
            'A1:H1000' => [
                'alignment' => ['vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER],
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 15, // Student ID
            'B' => 15, // RFID UID
            'C' => 20, // Last Name
            'D' => 20, // First Name
            'E' => 20, // Middle Name
            'F' => 30, // Email
            'G' => 10, // Year Level
            'H' => 15, // Date Registered
        ];
    }
}
