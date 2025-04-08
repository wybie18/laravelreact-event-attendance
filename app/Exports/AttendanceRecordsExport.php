<?php
namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class AttendanceRecordsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnWidths
{
    protected $records;
    protected $semesterEvents;

    public function __construct(Collection $records, Collection $semesterEvents)
    {
        $this->records        = $records;
        $this->semesterEvents = $semesterEvents;
    }

    public function collection()
    {
        return $this->records;
    }

    public function headings(): array
    {
        $headers = [
            'Student Name',
            'Student ID',
            'Year Level',
        ];

        // Add event and time slot headers
        foreach ($this->semesterEvents as $event) {
            foreach ($event->timeSlots as $slot) {
                $slotType  = ucwords(str_replace('-', ' ', $slot->slot_type));
                $startTime = substr($slot->start, 11, 5);
                $endTime   = substr($slot->end, 11, 5);
                $headers[] = "{$event->name}\n{$slotType}\n{$startTime}-{$endTime}";
            }
        }

        return $headers;
    }

    public function map($record): array
    {
        $row = [
            $record['student']['name'],
            $record['student']['student_id'],
            $record['student']['year_level'],
        ];

        // Add attendance status
        foreach ($record['attendances'] as $attendance) {
            $row[] = $attendance['timestamp'] ? 'Present' : 'Absent';
        }

        return $row;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the header row
            1          => [
                'font'      => ['bold' => true],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical'   => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                    'wrapText'   => true,
                ],
                'fill'      => [
                    'fillType'   => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E2F0D9'], // Light green background
                ],
            ],
            // Style for entire sheet
            'A1:Z1000' => [
                'alignment' => ['vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER],
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 30, // Student Name
            'B' => 15, // Student ID
            'C' => 12, // Year Level
        ];
    }
}
