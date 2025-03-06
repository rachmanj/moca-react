<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\GrpoTempImport;
use Illuminate\Support\Facades\DB;

/**
 * GRPO (Goods Receipt Purchase Order) Controller
 * 
 * This controller handles all operations related to GRPO management including:
 * - Displaying GRPO records
 * - Uploading Excel files for data import
 * - Converting temporary data to permanent records
 * - Managing inventory updates based on GRPO data
 */
class GrpoController extends Controller
{
    /**
     * Display a listing of GRPO records
     * 
     * Shows all GRPO records with pagination and checks if temporary data exists
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        // Check if there's any data in the temporary table
        $hasTemporaryData = DB::table('grpo_temps')->exists();
        
        // Get all GRPO records with pagination
        $grpos = DB::table('grpos')
            ->select('id', 'grpo_date', 'grpo_create_date', 
                    'grpo_no', 'unit_no', 'for_project', 'remarks', 'batch', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Calculate total weight for each GRPO by summing weights from details
        foreach ($grpos as $grpo) {
            $totalWeight = DB::table('grpo_details')
                ->where('grpo_id', $grpo->id)
                ->sum('weight');
                
            $grpo->weight = $totalWeight;
        }
        
        // Calculate statistics
        $stats = [
            'totalDocuments' => count($grpos),
            'totalWeight' => DB::table('grpo_details')->sum('weight'),
        ];
        
        // Get monthly weight data for the current year
        $currentYear = date('Y');
        $monthlyData = DB::table('grpos')
            ->join('grpo_details', 'grpos.id', '=', 'grpo_details.grpo_id')
            ->selectRaw('DATE_FORMAT(grpo_date, "%Y-%m") as month, SUM(weight) as total_weight')
            ->whereYear('grpo_date', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        // Return Inertia view with data
        return Inertia::render('platform/grpo/index', [
            'hasTemporaryData' => $hasTemporaryData,
            'grpos' => $grpos,
            'stats' => $stats,
            'monthlyData' => $monthlyData
        ]);
    }

    /**
     * Upload and import Excel file to temporary table
     * 
     * Validates, stores, processes, and then removes the uploaded Excel file
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function upload(Request $request)
    {
        // Validate the uploaded file
        $request->validate([
            'file_upload' => 'required|mimes:xls,xlsx',
        ]);

        // Store the file temporarily
        $file = $request->file('file_upload');
        $filename = 'grpo_' . uniqid() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $filename);

        // Import data from Excel to temporary table
        Excel::import(new GrpoTempImport, public_path('uploads/' . $filename));
        
        // Remove the temporary file after import
        unlink(public_path('uploads/' . $filename));

        // Return to index with flag indicating temporary data exists
        return Inertia::render('platform/grpo/index', [
            'hasTemporaryData' => true // We just uploaded data
        ]);
    }

    /**
     * Clear all temporary data
     * 
     * Truncates the grpo_temps table to remove all temporary records
     * 
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function truncate()
    {
        try {
            // Truncate the grpo_temps table
            DB::table('grpo_temps')->truncate();
            
            // Return to index with flag indicating no temporary data
            return Inertia::render('platform/grpo/index', [
                'hasTemporaryData' => false // Table is now empty
            ]);
        } catch (\Exception $e) {
            // Return error response if truncation fails
            return response()->json(['message' => 'Failed to clear temporary data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Convert temporary data to permanent records
     * 
     * Processes data from grpo_temps table to create:
     * 1. GRPO header records
     * 2. GRPO detail records
     * 3. Updates inventory quantities and values
     * 
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function convertData()
    {
        try {
            // Get all unique GRPO records from temporary table
            // Grouped by PO number and GRPO number
            $grpoGroups = DB::table('grpo_temps')
                ->select('po_no', 'grpo_no')
                ->distinct()
                ->get();

            // Check if there's data to process
            if ($grpoGroups->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No data to convert'
                ]);
            }

            // Initialize counters for tracking process results
            $importedCount = 0;          // Number of GRPO headers created
            $skippedCount = 0;           // Number of duplicate GRPOs skipped
            $detailsCount = 0;           // Number of GRPO detail items created
            $inventoryUpdatedCount = 0;  // Number of inventory items updated
            $inventoryCreatedCount = 0;  // Number of new inventory items created

            // Begin database transaction for data integrity
            DB::beginTransaction();

            // Get the current max batch number and increment for this import
            $maxBatch = DB::table('grpos')->max('batch') ?? 0;
            $currentBatch = $maxBatch + 1;

            // Get existing GRPO numbers to avoid duplicates
            $existingGrpoNumbers = DB::table('grpos')
                ->pluck('grpo_no')
                ->toArray();

            // Process each unique GRPO group
            foreach ($grpoGroups as $group) {
                // Get the first record for this PO/GRPO combination to use as header
                $grpoHeader = DB::table('grpo_temps')
                    ->where('po_no', $group->po_no)
                    ->where('grpo_no', $group->grpo_no)
                    ->first();

                // Skip if no header data found
                if (!$grpoHeader) {
                    continue;
                }

                // Skip if GRPO number already exists in database
                if (in_array($grpoHeader->grpo_no, $existingGrpoNumbers)) {
                    $skippedCount++;
                    continue;
                }

                // Create GRPO header record
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

                // Get all items for this PO/GRPO combination
                $grpoItems = DB::table('grpo_temps')
                    ->where('po_no', $group->po_no)
                    ->where('grpo_no', $group->grpo_no)
                    ->get();

                // Process each item in the GRPO
                foreach ($grpoItems as $item) {
                    // Create GRPO detail record
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

                    // Update inventory if item code exists and quantity is positive
                    if ($item->item_code && $item->qty > 0) {
                        // Check if inventory item already exists
                        $inventory = DB::table('inventories')
                            ->where('item_code', $item->item_code)
                            ->first();

                        if ($inventory) {
                            // Update existing inventory record
                            
                            // Calculate new total quantity and amount
                            $newTotalQty = $inventory->total_qty + $item->qty;
                            $newTotalAmount = $inventory->total_amount + $item->item_amount;
                            
                            // Calculate new average unit price
                            $newAvgUnitPrice = $newTotalQty > 0 ? $newTotalAmount / $newTotalQty : 0;
                            
                            // Calculate new average and total weight
                            $totalWeight = ($inventory->avg_weight * $inventory->total_qty) + ($item->weight * $item->qty);
                            $newAvgWeight = $newTotalQty > 0 ? $totalWeight / $newTotalQty : 0;
                            $newTotalWeight = $inventory->total_weight + ($item->weight * $item->qty);
                            
                            // Update inventory record with new values
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

            // Commit the transaction if all operations succeeded
            DB::commit();

            // Build success message with statistics
            $message = "Successfully converted {$importedCount} documents with {$detailsCount} detail items (Batch #{$currentBatch})";
            if ($skippedCount > 0) {
                $message .= ", skipped {$skippedCount} duplicate documents";
            }
            $message .= ". Inventory: {$inventoryCreatedCount} new items, {$inventoryUpdatedCount} updated items.";

            // Return to index with success message
            return Inertia::render('platform/grpo/index', [
                'success' => $message,
                'hasTemporaryData' => true // Keep the button enabled
            ]);

        } catch (\Exception $e) {
            // Rollback transaction if any operation failed
            DB::rollBack();
            
            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'Error converting data: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get GRPO details for a specific GRPO header
     * 
     * Retrieves all detail records associated with a GRPO ID
     * 
     * @param  int  $id  The GRPO header ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDetails($id)
    {
        // Get all detail records for the specified GRPO
        $details = DB::table('grpo_details')
            ->where('grpo_id', $id)
            ->get();
        
        // Return details as JSON response
        return response()->json($details);
    }
}
