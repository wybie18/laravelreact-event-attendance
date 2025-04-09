<?php
namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Semester;
use Carbon\Carbon;
use Inertia\Inertia;

class HomepageController extends Controller
{
    public function index()
    {
        $activeSemester = Semester::active()->first();

        $today = Carbon::today();

        $currentEvent = null;
        if ($activeSemester) {
            $currentEvent = Event::with(['timeSlots' => function ($query) {
                $query->orderBy('start', 'asc');
            }])
                ->where('semester_id', $activeSemester->id)
                ->where('date', $today)
                ->first();

            if ($currentEvent) {
                $currentEvent->attendance_count = $currentEvent->timeSlots
                    ->map(function ($slot) {
                        return $slot->attendances()->count();
                    })
                    ->sum();
            }
        }

        $upcomingEvents = Event::with(['timeSlots' => function ($query) {
            $query->orderBy('start', 'asc');
        }])
            ->when($activeSemester, function ($query) use ($activeSemester) {
                return $query->where('semester_id', $activeSemester->id);
            })
            ->where('date', '>', $today)
            ->orderBy('date', 'asc')
            ->limit(10)
            ->get();

        return Inertia::render('Homepage', [
            'events'         => $upcomingEvents,
            'currentEvent'   => $currentEvent,
            'activeSemester' => $activeSemester,
        ]);
    }

    public function eventDetails(string $id)
    {
        $event = Event::with(['timeSlots' => function ($query) {
            $query->orderBy('start', 'asc');
        }])
            ->findOrFail($id);

        $event->timeSlots->each(function ($slot) {
            $slot->attendance_count = $slot->attendances()->count();
        });
        $activeSemester = Semester::active()->first();

        return Inertia::render('Events/Details', [
            'event'          => $event,
            'activeSemester' => $activeSemester,
        ]);
    }

    public function showEvent(string $id)
    {
        $event = Event::with(['timeSlots' => function ($query) {
                $query->orderBy('start', 'asc');
            }])
            ->findOrFail($id);
        
        $isToday = Carbon::parse($event->date)->isToday();
        
        $event->timeSlots->each(function ($slot) {
            $slot->attendance_count = $slot->attendances()->count();
        });
        
        $activeSemester = Semester::active()->first();
        
        return Inertia::render('Events/Attendance', [
            'event' => $event,
            'isToday' => $isToday,
            'activeSemester' => $activeSemester,
        ]);
    }
}
