<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Platform\MigiController;

Route::middleware(['auth'])->group(function () {
    Route::get('migi', [MigiController::class, 'index'])->name('migi.index');
    Route::post('migi/upload', [MigiController::class, 'upload'])->name('migi.upload');
    Route::post('/migi/truncate', [MigiController::class, 'truncate'])->name('platform.migi.truncate');
    Route::post('migi/convert', [MigiController::class, 'convertData'])->name('migi.convert');
});

// Add this for debugging
Route::get('migi/upload', function() {
    return redirect()->route('migi.index')->with('error', 'Please use the form to upload files');
});

// Add this for debugging
Route::get('migi/convert', function() {
    return redirect()->route('migi.index')->with('error', 'Please use the conversion button to convert data');
});

// Add this for debugging
Route::get('migi/truncate', function() {
    return redirect()->route('migi.index')->with('error', 'Please use the clear button to truncate data');
});

// Add this route for fetching details
Route::get('api/migi/{id}/details', [MigiController::class, 'getDetails']);
