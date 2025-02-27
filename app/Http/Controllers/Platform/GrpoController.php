<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\GrpoTempImport;
use Illuminate\Support\Facades\DB;

class GrpoController extends Controller
{
    public function index()
    {
        $hasTemporaryData = DB::table('grpo_temps')->exists();
        
        // Get all grpos records with pagination
        $grpos = DB::table('grpos')
            ->select('id', 'grpo_date', 'grpo_create_date', 
                    'grpo_no', 'unit_no', 'for_project', 'remarks', 'batch', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('platform/grpo/index', [
            'hasTemporaryData' => $hasTemporaryData,
            'grpos' => $grpos
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file_upload' => 'required|mimes:xls,xlsx',
        ]);

        $file = $request->file('file_upload');
        $filename = 'grpo_' . uniqid() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $filename);

        Excel::import(new GrpoTempImport, public_path('uploads/' . $filename));
        unlink(public_path('uploads/' . $filename));

        return Inertia::render('platform/grpo/index', [
            'hasTemporaryData' => true // We just uploaded data
        ]);
    }

    public function truncate()
    {
        try {
            // Truncate the grpo_temps table
            DB::table('grpo_temps')->truncate();
            
            return Inertia::render('platform/grpo/index', [
                'hasTemporaryData' => false // Table is now empty
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to clear temporary data: ' . $e->getMessage()], 500);
        }
    }

    public function convertData()
    {
        try {
            // Get all unique records from grpo_temps grouped by po_no and grpo_no
            $grpoGroups = DB::table('grpo_temps')
                ->select('po_no', 'grpo_no')
                ->distinct()
                ->get();

            if ($grpoGroups->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No data to convert'
                ]);
            }

            $importedCount = 0;
            $skippedCount = 0;
            $detailsCount = 0;
            $inventoryUpdatedCount = 0;
            $inventoryCreatedCount = 0;

            // Begin transaction for data integrity
            DB::beginTransaction();

            // Get the current max batch number
            $maxBatch = DB::table('grpos')->max('batch') ?? 0;
            $currentBatch = $maxBatch + 1;

            // Get existing document numbers to avoid duplicates
            $existingGrpoNumbers = DB::table('grpos')
                ->pluck('grpo_no')
                ->toArray();

            foreach ($grpoGroups as $group) {
                // Get the first record for this po_no and grpo_no to use as header
                $grpoHeader = DB::table('grpo_temps')
                    ->where('po_no', $group->po_no)
                    ->where('grpo_no', $group->grpo_no)
                    ->first();

                if (!$grpoHeader) {
                    continue; // Skip if no data found
                }

                // Skip if grpo_no already exists
                if (in_array($grpoHeader->grpo_no, $existingGrpoNumbers)) {
                    $skippedCount++;
                    continue;
                }

                // Create Grpo record
                $grpoId = DB::table('grpos')->insertGetId([
                    'grpo_date' => $grpoHeader->grpo_date,
                    'grpo_create_date' => $grpoHeader->grpo_create_date,
                    'grpo_no' => $grpoHeader->grpo_no,
                    'unit_no' => $grpoHeader->unit_no,
                    'for_project' => $grpoHeader->for_project,
                    'remarks' => $grpoHeader->remarks,
                    'batch' => $currentBatch,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Add to existing document numbers to prevent duplicates in the same batch
                $existingGrpoNumbers[] = $grpoHeader->grpo_no;

                // Get all items for this po_no and grpo_no
                $grpoItems = DB::table('grpo_temps')
                    ->where('po_no', $group->po_no)
                    ->where('grpo_no', $group->grpo_no)
                    ->get();

                // Insert each item as a detail record
                foreach ($grpoItems as $item) {
                    DB::table('grpo_details')->insert([
                        'grpo_id' => $grpoId,
                        'item_code' => $item->item_code,
                        'description' => $item->description,
                        'qty' => $item->qty,
                        'unit_price' => $item->unit_price,
                        'item_amount' => $item->item_amount,
                        'uom' => $item->uom,
                        'weight' => $item->weight,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                    $detailsCount++;

                    // Update inventory
                    if ($item->item_code && $item->qty > 0) {
                        // Check if inventory item exists
                        $inventory = DB::table('inventories')
                            ->where('item_code', $item->item_code)
                            ->first();

                        if ($inventory) {
                            // Update existing inventory
                            $newTotalQty = $inventory->total_qty + $item->qty;
                            $newTotalAmount = $inventory->total_amount + $item->item_amount;
                            
                            // Calculate new average unit price
                            $newAvgUnitPrice = $newTotalQty > 0 ? $newTotalAmount / $newTotalQty : 0;
                            
                            // Calculate new average weight
                            $totalWeight = ($inventory->avg_weight * $inventory->total_qty) + ($item->weight * $item->qty);
                            $newAvgWeight = $newTotalQty > 0 ? $totalWeight / $newTotalQty : 0;
                            $newTotalWeight = $inventory->total_weight + ($item->weight * $item->qty);
                            DB::table('inventories')
                                ->where('id', $inventory->id)
                                ->update([
                                    'total_qty' => $newTotalQty,
                                    'avg_unit_price' => $newAvgUnitPrice,
                                    'total_amount' => $newTotalAmount,
                                    'avg_weight' => $newAvgWeight,
                                    'total_weight' => $newTotalWeight,
                                    'updated_at' => now()
                                ]);
                            
                            $inventoryUpdatedCount++;
                        } else {
                            // Create new inventory record
                            DB::table('inventories')->insert([
                                'item_code' => $item->item_code,
                                'description' => $item->description,
                                'total_qty' => $item->qty,
                                'avg_unit_price' => $item->unit_price,
                                'total_amount' => $item->item_amount,
                                'uom' => $item->uom,
                                'avg_weight' => $item->weight,
                                'total_weight' => $item->weight * $item->qty,
                                'created_at' => now(),
                                'updated_at' => now()
                            ]);
                            
                            $inventoryCreatedCount++;
                        }
                    }
                }

                $importedCount++;
            }

            DB::commit();

            $message = "Successfully converted {$importedCount} documents with {$detailsCount} detail items (Batch #{$currentBatch})";
            if ($skippedCount > 0) {
                $message .= ", skipped {$skippedCount} duplicate documents";
            }
            $message .= ". Inventory: {$inventoryCreatedCount} new items, {$inventoryUpdatedCount} updated items.";

            return Inertia::render('platform/grpo/index', [
                'success' => $message,
                'hasTemporaryData' => true // Keep the button enabled
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error converting data: ' . $e->getMessage()
            ]);
        }
    }

    // Add this new method to fetch details
    public function getDetails($id)
    {
        $details = DB::table('grpo_details')
            ->where('grpo_id', $id)
            ->get();
        
        return response()->json($details);
    }
}
