<?php
namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Event::with(['semester', 'timeSlots']);

        if ($search = request('search')) {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhereDate('date', $search)
                ->orWhereHas('semester', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
        }

        $sortField     = request("sort_field", "date");
        $sortDirection = request("sort_direction", "desc");

        $events = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return Inertia::render('Admin/Events/Index', [
            'events'      => EventResource::collection($events),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Events/Create', [
            'semesters'     => Semester::active()->get(),
            'timeSlotTypes' => [
                'morning-in', 'morning-out',
                'afternoon-in', 'afternoon-out',
                'evening-in', 'evening-out',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'semester_id'            => 'required|exists:semesters,id',
            'name'                   => 'required|string|max:255',
            'date'                   => 'required|date',
            'description'            => 'nullable|string',
            'time_slots'             => 'required|array|min:1',
            'time_slots.*.slot_type' => 'required|in:morning-in,morning-out,afternoon-in,afternoon-out,evening-in,evening-out',
            'time_slots.*.start'     => 'required|date_format:H:i',
            'time_slots.*.end'       => 'required|date_format:H:i|after:time_slots.*.start',
        ]);

        $event = Event::create($validated);

        foreach ($request->time_slots as $slot) {
            $event->timeSlots()->create($slot);
        }

        return redirect()->route('events.index')
            ->with('success', 'Event created with time slots');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $event = Event::with(['semester', 'timeSlots.attendances.student'])
            ->findOrFail($id);

        return Inertia::render('Admin/Events/Show', [
            'event' => new EventResource($event),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $event = Event::with('timeSlots')->findOrFail($id);

        return Inertia::render('Admin/Events/Edit', [
            'event'         => new EventResource($event),
            'semesters'     => Semester::active()->get(),
            'timeSlotTypes' => [
                'morning-in', 'morning-out',
                'afternoon-in', 'afternoon-out',
                'evening-in', 'evening-out',
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'semester_id'            => 'required|exists:semesters,id',
            'name'                   => 'required|string|max:255',
            'date'                   => 'required|date',
            'description'            => 'nullable|string',
            'time_slots'             => 'required|array|min:1',
            'time_slots.*.id'        => 'sometimes|exists:event_time_slots,id,event_id,' . $id,
            'time_slots.*.slot_type' => 'required|in:morning-in,morning-out,afternoon-in,afternoon-out,evening-in,evening-out',
            'time_slots.*.start'     => 'required|date_format:H:i',
            'time_slots.*.end'       => 'required|date_format:H:i|after:time_slots.*.start',
        ]);

        $event->update($validated);

        $timeSlotIds = [];
        foreach ($request->time_slots as $slot) {
            if (isset($slot['id'])) {
                $timeSlot = $event->timeSlots()->findOrFail($slot['id']);
                $timeSlot->update($slot);
                $timeSlotIds[] = $timeSlot->id;
            } else {
                $newSlot       = $event->timeSlots()->create($slot);
                $timeSlotIds[] = $newSlot->id;
            }
        }

        // Delete removed time slots
        $event->timeSlots()->whereNotIn('id', $timeSlotIds)->delete();

        return redirect()->route('events.index')->with('success', 'Event updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return redirect()->back()->with('success', 'Event deleted successfully');
    }
}
