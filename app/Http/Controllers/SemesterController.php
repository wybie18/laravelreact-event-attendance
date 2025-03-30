<?php

namespace App\Http\Controllers;

use App\Http\Resources\SemesterResource;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Semester::query();

        if ($search = request('search')) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        if (request('active')) {
            $query->where('active', true);
        }

        $sortField = request("sort_field", "start");
        $sortDirection = request("sort_direction", "desc");

        $semesters = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return Inertia::render('Admin/Semesters/Index', [
            'semesters' => SemesterResource::collection($semesters),
            'queryParams' => request()->query() ?: null,
            'activeSemester' => Semester::active()->first()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Semesters/Create', [
            'defaults' => [
                'start' => now()->format('Y-m-d'),
                'end' => now()->addMonths(4)->format('Y-m-d'),
                'active' => false
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:semesters',
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'active' => 'boolean'
        ]);

        $overlapping = Semester::where(function($query) use ($validated) {
            $query->whereBetween('start', [$validated['start'], $validated['end']])
                  ->orWhereBetween('end', [$validated['start'], $validated['end']])
                  ->orWhere(function($q) use ($validated) {
                      $q->where('start', '<', $validated['start'])
                        ->where('end', '>', $validated['end']);
                  });
        })->exists();

        if ($overlapping) {
            return redirect()->back()->withErrors(['date' => 'This semester overlaps with an existing semester']);
        }

        $semester = Semester::create($validated);

        if ($validated['active']) {
            $semester->activate();
        }

        return redirect()->route('semesters.index')->with('success', 'Semester created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $semester = Semester::with(['events.timeSlots'])
                        ->findOrFail($id);

        return Inertia::render('Admin/Semesters/Show', [
            'semester' => new SemesterResource($semester)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $semester = Semester::findOrFail($id);

        return Inertia::render('Admin/Semesters/Edit', [
            'semester' => new SemesterResource($semester)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $semester = Semester::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:semesters,name,'.$id,
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'active' => 'boolean'
        ]);

        $overlapping = Semester::where('id', '!=', $id)
            ->where(function($query) use ($validated) {
                $query->whereBetween('start', [$validated['start'], $validated['end']])
                      ->orWhereBetween('end', [$validated['start'], $validated['end']])
                      ->orWhere(function($q) use ($validated) {
                          $q->where('start', '<', $validated['start'])
                            ->where('end', '>', $validated['end']);
                      });
            })->exists();

        if ($overlapping) {
            return redirect()->back()->withErrors(['date' => 'This semester overlaps with an existing semester']);
        }

        $semester->update($validated);

        if ($request->has('active') && $validated['active']) {
            $semester->activate();
        } elseif ($request->has('active') && !$validated['active']) {
            $semester->update(['active' => false]);
        }

        return redirect()->route('semesters.index')->with('success', 'Semester updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $semester = Semester::findOrFail($id);

        if ($semester->events()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete semester with associated events');
        }

        if ($semester->active) {
            return redirect()->back()->with('error', 'Cannot delete active semester');
        }

        $semester->delete();

        return redirect()->back()
            ->with('success', 'Semester deleted successfully');
    }

    /**
     * Activate a semester
     */
    public function activate(string $id)
    {
        $semester = Semester::findOrFail($id);
        $semester->activate();

        return redirect()->back()
            ->with('success', 'Semester activated successfully');
    }
}