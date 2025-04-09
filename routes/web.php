<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin'       => Route::has('login'),
//         'canRegister'    => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion'     => PHP_VERSION,
//     ]);
// });
Route::middleware('guest')->group(function () {
    Route::get('/', [App\Http\Controllers\User\AttendanceController::class, 'index'])->name('user.attendances.index');
    Route::get('/events/{id}/attendance', [App\Http\Controllers\User\AttendanceController::class, 'create'])->name('user.attendances.create');
    Route::post('/events//attendance', [App\Http\Controllers\User\AttendanceController::class, 'store'])->name('user.attendances.store');
    Route::get('/attendance/stats/{time_slot_id}', [App\Http\Controllers\User\AttendanceController::class, 'stats'])->name('user.attendances.stats');
});
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('/admin')->group(function () {
    Route::get('/download/template', [FileController::class, 'download'])->name('excel.template');

    Route::resource('/students', StudentController::class);
    Route::get('/students/excel/export', [StudentController::class, 'exportStudents'])->name('students.export');
    Route::post('/students/excel/import', [StudentController::class, 'importStudents'])->name('students.import');
    Route::get('/semesters', [SemesterController::class, 'index'])->name('semesters.index');
    Route::post('/semesters', [SemesterController::class, 'store'])->name('semesters.store');
    Route::put('/semesters/{semester}', [SemesterController::class, 'update'])->name('semesters.update');
    Route::delete('/semesters/{semester}', [SemesterController::class, 'destroy'])->name('semesters.destroy');
    Route::resource('/events', EventController::class);

    Route::get('/attendances', [AttendanceController::class, 'index'])->name('attendances.index');
    Route::post('/attendances', [AttendanceController::class, 'store'])->name('attendances.store');
    Route::put('/attendances/{attendance}', [AttendanceController::class, 'update'])->name('attendances.update');
    Route::delete('/attendances/{attendance}', [AttendanceController::class, 'destroy'])->name('attendances.destroy');

    Route::get('/records', [StudentController::class, 'records'])->name('records');
    Route::get('/records/export', [StudentController::class, 'exportRecords'])->name('records.export');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
