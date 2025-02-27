<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Platform\MigiController;
use App\Http\Controllers\Platform\GrpoController;

Route::middleware(['auth'])->group(function () {
    // MIGI Routes
    Route::get('migi', [MigiController::class, 'index'])->name('migi.index');
    Route::post('migi/upload', [MigiController::class, 'upload'])->name('migi.upload');
    Route::post('/migi/truncate', [MigiController::class, 'truncate'])->name('platform.migi.truncate');
    Route::post('migi/convert', [MigiController::class, 'convertData'])->name('migi.convert');
    
    // GRPO Routes
    Route::get('grpo', [GrpoController::class, 'index'])->name('grpo.index');
    Route::post('grpo/upload', [GrpoController::class, 'upload'])->name('grpo.upload');
    Route::post('/grpo/truncate', [GrpoController::class, 'truncate'])->name('platform.grpo.truncate');
    Route::post('grpo/convert', [GrpoController::class, 'convertData'])->name('grpo.convert');
});

// MIGI Debug Routes
Route::get('migi/upload', function() {
    return redirect()->route('migi.index')->with('error', 'Please use the form to upload files');
});

Route::get('migi/convert', function() {
    return redirect()->route('migi.index')->with('error', 'Please use the conversion button to convert data');
});

Route::get('migi/truncate', function() {
    return redirect()->route('migi.index')->with('error', 'Please use the clear button to truncate data');
});

// GRPO Debug Routes
Route::get('grpo/upload', function() {
    return redirect()->route('grpo.index')->with('error', 'Please use the form to upload files');
});

Route::get('grpo/convert', function() {
    return redirect()->route('grpo.index')->with('error', 'Please use the conversion button to convert data');
});

Route::get('grpo/truncate', function() {
    return redirect()->route('grpo.index')->with('error', 'Please use the clear button to truncate data');
});

// API Routes
Route::get('api/migi/{id}/details', [MigiController::class, 'getDetails']);
Route::get('api/grpo/{id}/details', [GrpoController::class, 'getDetails']);
