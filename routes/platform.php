<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Platform\MigiController;
use App\Http\Controllers\Platform\GrpoController;
use App\Http\Controllers\Platform\InventoryController;
use App\Http\Controllers\Platform\OldcoreController;

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

    // Inventory Routes
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::get('inventory/{id}', [InventoryController::class, 'show'])->name('inventory.show');
    
    // Oldcores Routes
    Route::get('oldcores', [OldcoreController::class, 'index'])->name('oldcores.index');
    Route::get('oldcores/{id}', [OldcoreController::class, 'show'])->name('oldcores.show');

    // Oldcore Receipts Routes
    Route::get('oldcores/receipts/create', [OldcoreController::class, 'createReceipt'])->name('oldcores.receipts.create');
    Route::post('oldcores/receipts', [OldcoreController::class, 'storeReceipt'])->name('oldcores.receipts.store');
    Route::get('oldcores/receipts/{id}/edit', [OldcoreController::class, 'editReceipt'])->name('oldcores.receipts.edit');
    Route::put('oldcores/receipts/{id}', [OldcoreController::class, 'updateReceipt'])->name('oldcores.receipts.update');
    Route::delete('oldcores/receipts/{id}', [OldcoreController::class, 'destroyReceipt'])->name('oldcores.receipts.destroy');
    Route::get('oldcores/receipts/{id}/print', [OldcoreController::class, 'printReceipt'])->name('oldcores.receipts.print');
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
Route::get('api/inventory/{id}/details', [InventoryController::class, 'getDetails']);
Route::get('api/oldcores/{id}/details', [OldcoreController::class, 'getDetails']);
Route::get('api/oldcores/issued', [OldcoreController::class, 'getIssuedItems']);
Route::get('api/oldcores/receipts', [OldcoreController::class, 'getReceiptItems']);
