<?php
namespace App\Http\Controllers;

class FileController extends Controller
{
    public function download()
    {
        $filePath = public_path('template/template.xlsx');

        if (file_exists($filePath)) {
            return response()->download($filePath);
        } else {
            abort(404, 'File not found.');
        }
    }
}
