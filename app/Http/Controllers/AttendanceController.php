<?php
namespace App\Http\Controllers;

use App\Http\Resources\AttendanceResource;
use App\Http\Resources\EventSlotResource;
use App\Http\Resources\StudentResource;
use App\Models\Attendance;
use App\Models\EventTimeSlot;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Attendance::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('student', function($studentQuery) use ($search) {
                    $studentQuery->where('first_name', 'like', "%$search%")
                        ->orWhere('middle_name', 'like', "%$search%")
                        ->orWhere('last_name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%")
                        ->orWhere('year_level', 'like', "%$search%");
                })
                ->orWhereHas('timeSlot.event', function($eventQuery) use ($search) {
                    $eventQuery->where('name', 'like', "%$search%");
                });
            });
        }
    
        if ($year_level = request('year_level')) {
            $query->whereHas('student', function($q) use ($year_level) {
                $q->where('year_level', $year_level);
            });
        }

        $sortField     = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "asc");

        $attendances   = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        $students      = Student::all();
        $eventTimeSlot = EventTimeSlot::all();
        return Inertia::render('Admin/Attendances/Index', [
            'attendances' => AttendanceResource::collection($attendances),
            'students'    => StudentResource::collection($students),
            'events'      => EventSlotResource::collection($eventTimeSlot),
            "queryParams" => request()->query() ?: null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_rfid_uid' => 'required|numeric|exists:students,rfid_uid',
            'time_slot_id'     => 'required|numeric|exists:event_time_slots,id',
        ]);
        $exists = Attendance::where([
            'student_rfid_uid' => $validated['student_rfid_uid'],
            'time_slot_id'     => $validated['time_slot_id'],
        ])->exists();

        if ($exists) {
            return redirect()->back()->withErrors('Attendance already recorded for this time slot');
        }
        Attendance::create($validated);

        return redirect()->route('attendances.index')->with('success', 'Attendance recorded successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return redirect()->back()->with('success', 'Attendance record deleted successfully');
    }
}
