<?php
namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Http\Resources\StudentResource;
use App\Models\Event;
use App\Models\Semester;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Student::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                    ->orWhere('middle_name', 'like', '%' . $search . '%')
                    ->orWhere('last_name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhere('student_id', 'like', '%' . $search . '%')
                    ->orWhere('year_level', 'like', '%' . $search . '%')
                    ->orWhere('rfid_uid', 'like', '%' . $search . '%');
            });
        }

        if ($year_level = request('year_level')) {
            $query->where('year_level', $year_level);
        }

        $sortField     = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "asc");

        $students = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return Inertia::render('Admin/Students/Index', [
            'students'    => StudentResource::collection($students),
            "queryParams" => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Students/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rfid_uid'    => 'required|numeric|unique:students,rfid_uid',
            'student_id'  => 'required|string|unique:students,student_id',
            'first_name'  => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name'   => 'required|string|max:255',
            'email'       => 'required|email|unique:students,email',
            'year_level'  => 'required|integer|between:1,4',
        ]);

        Student::create($validated);

        return redirect()->route('students.index')->with('success', 'Student created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $student = Student::findOrFail($id);
        return Inertia::render('Admin/Students/Show', [
            'student' => new StudentResource($student),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $student = Student::findOrFail($id);
        return Inertia::render('Admin/Students/Edit', [
            'student' => new StudentResource($student),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'rfid_uid'    => 'required|numeric|unique:students,rfid_uid,' . $id,
            'student_id'  => 'required|string|unique:students,student_id,' . $id,
            'first_name'  => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name'   => 'required|string|max:255',
            'email'       => 'required|email|unique:students,email,' . $id,
            'year_level'  => 'required|integer|between:1,5',
        ]);

        $student->update($validated);

        return redirect()->route('students.index')->with('success', 'Student updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return redirect()->back()->with('success', 'Student deleted successfully');
    }
}
