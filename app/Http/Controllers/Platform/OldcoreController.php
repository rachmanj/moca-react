<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Oldcore;
use App\Models\MigiDetail;
use App\Models\OldcoreReceipt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Inventory;

class OldcoreController extends Controller
{
    public function index()
    {
        // Get all oldcores with related migi_detail information
        $oldcores = DB::table('oldcores')
            ->select([
                'oldcores.id',
                'oldcores.migi_detail_id',
                'oldcores.item_code',
                'oldcores.desc',
                'oldcores.total_qty',
                'oldcores.created_at',
                'oldcores.updated_at',
                'migi_details.line',
                'migi_details.stock_price',
                'migi_details.total_price',
                'migi_details.project_code',
                'migis.document_number',
                'migis.document_date',
                'migis.wo_number',
                'migis.unit_number',
                'migis.model_number',
                'migis.serial_number'
            ])
            ->join('migi_details', 'oldcores.migi_detail_id', '=', 'migi_details.id')
            ->join('migis', 'migi_details.migi_id', '=', 'migis.id')
            ->get();
        
        // Calculate summary statistics
        $totalItems = $oldcores->count();
        $totalQuantity = $oldcores->sum('total_qty');
        
        // Get current year
        $currentYear = date('Y');
        
        // Get monthly weight data from oldcore_receipts for all months of the current year
        $monthlyWeightData = DB::table('oldcore_receipts')
            ->select(
                DB::raw('DATE_FORMAT(date, "%Y-%m") as month'), 
                DB::raw('SUM(weight_total) as total_weight'),
                DB::raw('SUM(expected_total_weight) as expected_total_weight')
            )
            ->whereRaw('YEAR(date) = ?', [$currentYear])
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();
            
        // Create an array with all months of the year
        $allMonths = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthKey = sprintf('%s-%02d', $currentYear, $month);
            $allMonths[$monthKey] = [
                'month' => $monthKey,
                'total_weight' => 0,
                'expected_total_weight' => 0
            ];
        }
        
        // Fill in the actual data for months that have records
        foreach ($monthlyWeightData as $item) {
            if (isset($allMonths[$item->month])) {
                $allMonths[$item->month]['total_weight'] = $item->total_weight;
                $allMonths[$item->month]['expected_total_weight'] = $item->expected_total_weight;
            }
        }
        
        // Convert to array and maintain month order
        $monthlyData = array_values($allMonths);
        
        // Get user role
        $userRole = Auth::user()->getRoleNames() ?? ['user'];
            
        return Inertia::render('platform/oldcores/index', [
            'oldcores' => $oldcores,
            'stats' => [
                'totalItems' => $totalItems,
                'totalQuantity' => $totalQuantity,
                'totalWeight' => $monthlyWeightData->sum('total_weight') ?? 0,
            ],
            'monthlyData' => $monthlyData,
            'userRole' => $userRole
        ]);
    }

    /**
     * Display the specified oldcore.
     */
    public function show($id)
    {
        // Get the oldcore details
        $oldcore = DB::table('oldcores')
            ->select([
                'oldcores.id',
                'oldcores.migi_detail_id',
                'oldcores.item_code',
                'oldcores.desc',
                'oldcores.total_qty',
                'oldcores.created_at',
                'oldcores.updated_at',
                'migi_details.line',
                'migi_details.stock_price',
                'migi_details.total_price',
                'migi_details.project_code',
                'migis.document_number',
                'migis.document_date',
                'migis.wo_number',
                'migis.unit_number',
                'migis.model_number',
                'migis.serial_number'
            ])
            ->join('migi_details', 'oldcores.migi_detail_id', '=', 'migi_details.id')
            ->join('migis', 'migi_details.migi_id', '=', 'migis.id')
            ->where('oldcores.id', $id)
            ->first();
            
        if (!$oldcore) {
            return redirect()->route('oldcores.index')->with('error', 'Oldcore not found');
        }
        
        // Get the history of migi_details that affected this oldcore (same item_code and project_code)
        $history = DB::table('migi_details')
            ->select([
                'migi_details.id',
                'migi_details.migi_id',
                'migi_details.line',
                'migi_details.item_code',
                'migi_details.desc',
                'migi_details.qty',
                'migi_details.stock_price',
                'migi_details.total_price',
                'migi_details.project_code',
                'migi_details.created_at',
                'migis.document_number',
                'migis.document_date',
                'migis.wo_number',
                'migis.unit_number'
            ])
            ->join('migis', 'migi_details.migi_id', '=', 'migis.id')
            ->where('migi_details.item_code', $oldcore->item_code)
            ->where('migi_details.project_code', $oldcore->project_code)
            ->orderBy('migi_details.created_at', 'desc')
            ->get();
            
        return Inertia::render('platform/oldcores/show', [
            'oldcore' => $oldcore,
            'history' => $history
        ]);
    }

    /**
     * Get oldcore details
     */
    public function getDetails($id)
    {
        $details = DB::table('oldcores')
            ->select([
                'oldcores.*',
                'migi_details.line',
                'migi_details.stock_price',
                'migi_details.total_price',
                'migi_details.project_code',
                'migis.document_number',
                'migis.document_date',
                'migis.wo_number',
                'migis.unit_number',
                'migis.model_number',
                'migis.serial_number'
            ])
            ->join('migi_details', 'oldcores.migi_detail_id', '=', 'migi_details.id')
            ->join('migis', 'migi_details.migi_id', '=', 'migis.id')
            ->where('oldcores.id', $id)
            ->first();
        
        return response()->json($details);
    }
    
    /**
     * Get issued items (migi_details)
     */
    public function getIssuedItems()
    {
        $issuedItems = DB::table('migi_details')
            ->select([
                'migi_details.id',
                'migi_details.migi_id',
                'migi_details.line',
                'migi_details.item_code',
                'migi_details.desc',
                'migi_details.qty',
                'migi_details.stock_price',
                'migi_details.total_price',
                'migi_details.wo_qty',
                'migi_details.project_code',
                'migi_details.created_at',
                'migi_details.updated_at',
                'migis.document_number',
                'migis.document_date',
                'migis.wo_number',
                'migis.unit_number',
                'migis.model_number',
                'migis.serial_number'
            ])
            ->join('migis', 'migi_details.migi_id', '=', 'migis.id')
            ->orderBy('migi_details.created_at', 'desc')
            ->limit(100) // Limit to prevent performance issues
            ->get();
            
        return response()->json($issuedItems);
    }
    
    /**
     * Get received items (oldcore_receipts)
     */
    public function getReceiptItems()
    {
        $receiptItems = DB::table('oldcore_receipts')
            ->select([
                'oldcore_receipts.id',
                'oldcore_receipts.receipt_number',
                'oldcore_receipts.migi_detail_id',
                'oldcore_receipts.date',
                'oldcore_receipts.item_code',
                'oldcore_receipts.desc',
                'oldcore_receipts.qty',
                'oldcore_receipts.weight_total',
                'oldcore_receipts.project',
                'oldcore_receipts.remarks',
                'oldcore_receipts.given_by',
                'oldcore_receipts.received_by',
                'oldcore_receipts.created_at',
                'oldcore_receipts.updated_at'
            ])
            ->orderBy('oldcore_receipts.created_at', 'desc')
            ->limit(100) // Limit to prevent performance issues
            ->get();
            
        return response()->json($receiptItems);
    }

    /**
     * Show the form for creating a new receipt.
     */
    public function createReceipt()
    {
        // Get available migi_details for selection
        $migiDetails = DB::table('migi_details')
            ->select([
                'migi_details.id',
                'migi_details.item_code',
                'migi_details.desc',
                'migi_details.qty',
                'migi_details.project_code',
                'migis.document_number',
                'migis.document_date',
                'migis.wo_number',
                'migis.unit_number'
            ])
            ->join('migis', 'migi_details.migi_id', '=', 'migis.id')
            ->orderBy('migi_details.created_at', 'desc')
            ->get();
            
        return Inertia::render('platform/oldcores/create-receipt', [
            'migiDetails' => $migiDetails
        ]);
    }
    
    /**
     * Store a newly created receipt in storage.
     */
    public function storeReceipt(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'receipt_number' => 'nullable|string|max:50|unique:oldcore_receipts',
            'date' => 'required|date',
            'item_code' => 'required|string|max:50',
            'desc' => 'required|string|max:255',
            'qty' => 'required|numeric|min:0.01',
            'project' => 'required|string|max:50',
            'migi_detail_id' => 'nullable|exists:migi_details,id',
            'weight_total' => 'required|numeric|min:0.01',
            'remarks' => 'nullable|string',
            'given_by' => 'nullable|string|max:50',
            'received_by' => 'required|string|max:50',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Prepare receipt data with proper type conversions
            $receiptData = [
                'receipt_number' => $request->receipt_number,
                'date' => $request->date,
                'item_code' => $request->item_code,
                'desc' => $request->desc,
                'qty' => (int)$request->qty, // Ensure integer conversion
                'weight_total' => (float)$request->weight_total, // Ensure float conversion
                'project' => $request->project,
                'remarks' => $request->remarks,
                'given_by' => $request->given_by,
                'received_by' => $request->received_by,
                'migi_detail_id' => $request->migi_detail_id ?: null, // Ensure null if empty
            ];
            
            // Check in inventories table if item_code exists
            $inventory = Inventory::where('item_code', $request->item_code)->first();
            
            // Add inventory-related data if available
            if ($inventory) {
                $receiptData['inventory_id'] = $inventory->id;
                $receiptData['grpo_avg_weight'] = $inventory->avg_weight ?? 0;
                $receiptData['expected_total_weight'] = (float)$request->qty * ($inventory->avg_weight ?? 0);
            } else {
                $receiptData['inventory_id'] = null;
                $receiptData['grpo_avg_weight'] = 0;
                $receiptData['expected_total_weight'] = 0;
            }
            
            // Create the receipt in a single operation
            $receipt = OldcoreReceipt::create($receiptData);
            
            // Update the oldcore quantity if migi_detail_id is provided
            if ($request->migi_detail_id) {
                // Update the oldcore record
                $oldcore = Oldcore::where('item_code', $request->item_code)
                    ->where('migi_detail_id', $request->migi_detail_id)
                    ->first();
                    
                if ($oldcore) {
                    // Reduce the oldcore quantity
                    $oldcore->total_qty = max(0, $oldcore->total_qty - (float)$request->qty);
                    $oldcore->save();
                }
                
                // Update the migi_detail received quantity
                $migiDetail = MigiDetail::find($request->migi_detail_id);
                if ($migiDetail) {
                    $migiDetail->received_qty = ($migiDetail->received_qty ?? 0) + (int)$request->qty;
                    $migiDetail->save();
                }
            }
            
            DB::commit();
            
            return redirect()->route('oldcores.index')->with('success', 'Receipt created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error for debugging
            \Log::error('Failed to create receipt: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Failed to create receipt: ' . $e->getMessage())->withInput();
        }
    }
    
    /**
     * Show the form for editing the specified receipt.
     */
    public function editReceipt($id)
    {
        $receipt = OldcoreReceipt::findOrFail($id);
        
        // Get available migi_details for selection
        $migiDetails = DB::table('migi_details')
            ->select([
                'migi_details.id',
                'migi_details.item_code',
                'migi_details.desc',
                'migi_details.qty',
                'migi_details.project_code',
                'migis.document_number',
                'migis.document_date',
                'migis.wo_number',
                'migis.unit_number'
            ])
            ->join('migis', 'migi_details.migi_id', '=', 'migis.id')
            ->orderBy('migi_details.created_at', 'desc')
            ->get();
            
        return Inertia::render('platform/oldcores/edit-receipt', [
            'receipt' => $receipt,
            'migiDetails' => $migiDetails
        ]);
    }
    
    /**
     * Update the specified receipt in storage.
     */
    public function updateReceipt(Request $request, $id)
    {
        $receipt = OldcoreReceipt::findOrFail($id);
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'receipt_number' => 'nullable|string|max:50|unique:oldcore_receipts,receipt_number,' . $id,
            'date' => 'required|date',
            'item_code' => 'required|string|max:50',
            'desc' => 'required|string|max:255',
            'qty' => 'required|numeric|min:0.01',
            'project' => 'required|string|max:50',
            'migi_detail_id' => 'nullable|exists:migi_details,id',
            'weight_total' => 'required|numeric|min:0.01',
            'remarks' => 'nullable|string',
            'given_by' => 'nullable|string|max:50',
            'received_by' => 'required|string|max:50',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Calculate the quantity difference with proper type conversion
            $qtyDifference = (float)$request->qty - (float)$receipt->qty;
            
            // Prepare receipt data with proper type conversions
            $receiptData = [
                'receipt_number' => $request->receipt_number,
                'date' => $request->date,
                'item_code' => $request->item_code,
                'desc' => $request->desc,
                'qty' => (int)$request->qty, // Ensure integer conversion
                'weight_total' => (float)$request->weight_total, // Ensure float conversion
                'project' => $request->project,
                'remarks' => $request->remarks,
                'given_by' => $request->given_by,
                'received_by' => $request->received_by,
                'migi_detail_id' => $request->migi_detail_id ?: null, // Ensure null if empty
            ];
            
            // Check in inventories table if item_code exists
            $inventory = Inventory::where('item_code', $request->item_code)->first();
            
            // Add inventory-related data if available
            if ($inventory) {
                $receiptData['inventory_id'] = $inventory->id;
                $receiptData['grpo_avg_weight'] = $inventory->avg_weight ?? 0;
                $receiptData['expected_total_weight'] = (float)$request->qty * ($inventory->avg_weight ?? 0);
            } else {
                $receiptData['inventory_id'] = null;
                $receiptData['grpo_avg_weight'] = 0;
                $receiptData['expected_total_weight'] = 0;
            }
            
            // Update the receipt in a single operation
            $receipt->update($receiptData);
            
            // Only update the oldcore if there's a quantity difference and migi_detail_id is provided
            if ($qtyDifference != 0 && $request->migi_detail_id) {
                // Update the oldcore quantity
                $oldcore = Oldcore::where('item_code', $request->item_code)
                    ->where('migi_detail_id', $request->migi_detail_id)
                    ->first();
                    
                if ($oldcore) {
                    // Adjust the oldcore quantity based on the difference
                    $oldcore->total_qty = max(0, $oldcore->total_qty - $qtyDifference);
                    $oldcore->save();
                }
                
                // Update the migi_detail if needed
                $migiDetail = MigiDetail::find($request->migi_detail_id);
                if ($migiDetail) {
                    // Update received quantity with proper type handling
                    $migiDetail->received_qty = max(0, ($migiDetail->received_qty ?? 0) + (int)$qtyDifference);
                    $migiDetail->save();
                }
            }
            
            DB::commit();
            
            return redirect()->route('oldcores.index')->with('success', 'Receipt updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error for debugging
            \Log::error('Failed to update receipt: ' . $e->getMessage(), [
                'request' => $request->all(),
                'receipt_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Failed to update receipt: ' . $e->getMessage())->withInput();
        }
    }
    
    /**
     * Remove the specified receipt from storage.
     */
    public function destroyReceipt($id)
    {
        $receipt = OldcoreReceipt::findOrFail($id);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Find the oldcore to update if migi_detail_id is provided
            if ($receipt->migi_detail_id) {
                $oldcore = Oldcore::where('item_code', $receipt->item_code)
                    ->where('migi_detail_id', $receipt->migi_detail_id)
                    ->first();
                    
                if ($oldcore) {
                    // Add the quantity back to the oldcore with proper type conversion
                    $oldcore->total_qty += (float)$receipt->qty;
                    $oldcore->save();
                }
                
                // Update the migi_detail if needed
                $migiDetail = MigiDetail::find($receipt->migi_detail_id);
                if ($migiDetail) {
                    // Reduce the received quantity with proper type handling
                    $migiDetail->received_qty = max(0, ($migiDetail->received_qty ?? 0) - (int)$receipt->qty);
                    $migiDetail->save();
                }
            }
            
            // Delete the receipt
            $receipt->delete();
            
            DB::commit();
            
            return redirect()->route('oldcores.index')->with('success', 'Receipt deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error for debugging
            \Log::error('Failed to delete receipt: ' . $e->getMessage(), [
                'receipt_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Failed to delete receipt: ' . $e->getMessage());
        }
    }
    
    /**
     * Generate a printable receipt.
     */
    public function printReceipt($id)
    {
        $receipt = OldcoreReceipt::findOrFail($id);
        
        return Inertia::render('platform/oldcores/print-receipt', [
            'receipt' => $receipt
        ]);
    }
} 