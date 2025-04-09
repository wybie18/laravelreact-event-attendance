<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\EventTimeSlot;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $events = Event::where('date', '>=', now()->startOfDay())
            ->orderBy('date', 'asc')
            ->get();
         return Inertia::render('Homepage', [
            'events' => $events,
        ]);
    }

    public function create(string $id)
    {
        $event = Event::with('timeSlots')
            ->where('date', '>=', now()->startOfDay())
            ->findOrFail($id);
        $events = Event::where('date', '>=', now()->startOfDay())
            ->orderBy('date', 'asc')
            ->get();
        if (! $this->isEventDay($event)) {
            return redirect()->back()->withErrors('Attendance is currently close till the event date.');
        }
        return Inertia::render('Create', [
            'event'  => new EventResource($event),
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'student_rfid_uid' => 'required|exists:students,rfid_uid',
            'time_slot_id'     => 'required|exists:event_time_slots,id',
        ]);

        $timeSlot = EventTimeSlot::findOrFail($data['time_slot_id']);
        $event    = $timeSlot->event;

        if (! $this->isEventDay($event)) {
            return response()->json(['error' => 'Attendance is currently close till the event date.']);
        }

        $startDateTime = Carbon::parse(
            $event->date->format('Y-m-d') . ' ' . $timeSlot->start->format('H:i:s')
        );

        if (now()->lt($startDateTime)) {
            return response()->json([
                'error' => 'Attendance not allowed until ' . $startDateTime->format('h:i A')
            ], 403);
        }

        $existing = Attendance::where('student_rfid_uid', $data['student_rfid_uid'])
            ->where('time_slot_id', $data['time_slot_id'])
            ->exists();

        if ($existing) {
            return response()->json(['error' => 'Attendance already recorded'], 409);
        }

        Attendance::create($data);

        return response()->noContent();
    }

    private function isEventDay(Event $event): bool
    {
        return $event->date->isToday();
    }

    public function stats($timeSlotId)
    {
        $totalStudents = Student::count();
        $presentStudents = Attendance::where('time_slot_id', $timeSlotId)->count();

        return response()->json([
            'total' => $totalStudents,
            'present' => $presentStudents,
        ]);
    }
}
