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
        
        // Get monthly quantity data for the chart
        $monthlyQuantityData = DB::table('oldcores')
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('SUM(total_qty) as total_quantity'))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->limit(6)
            ->get();
            
        return Inertia::render('platform/oldcores/index', [
            'oldcores' => $oldcores,
            'stats' => [
                'totalItems' => $totalItems,
                'totalQuantity' => $totalQuantity,
            ],
            'monthlyData' => $monthlyQuantityData
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
            // Create the receipt
            $receipt = new OldcoreReceipt();
            $receipt->receipt_number = $request->receipt_number;
            $receipt->date = $request->date;
            $receipt->item_code = $request->item_code;
            $receipt->desc = $request->desc;
            $receipt->qty = $request->qty;
            $receipt->weight_total = $request->weight_total;
            $receipt->project = $request->project;
            $receipt->remarks = $request->remarks;
            $receipt->given_by = $request->given_by;
            $receipt->received_by = $request->received_by;
            $receipt->migi_detail_id = $request->migi_detail_id;
            $receipt->save();
            
            // Update the oldcore quantity if migi_detail_id is provided
            if ($request->migi_detail_id) {
                $oldcore = Oldcore::where('item_code', $request->item_code)
                    ->where('migi_detail_id', $request->migi_detail_id)
                    ->first();
                    
                if ($oldcore) {
                    // Reduce the oldcore quantity
                    $oldcore->total_qty -= $request->qty;
                    if ($oldcore->total_qty < 0) {
                        $oldcore->total_qty = 0;
                    }
                    $oldcore->save();
                }
                
                // Update the migi_detail if needed
                $migiDetail = MigiDetail::find($request->migi_detail_id);
                if ($migiDetail) {
                    // Update the received quantity - field exists in the migration
                    $migiDetail->received_qty = ($migiDetail->received_qty ?? 0) + (int)$request->qty;
                    $migiDetail->save();
                }
            }
            
            DB::commit();
            
            return redirect()->route('oldcores.index')->with('success', 'Receipt created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
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
            // Calculate the quantity difference
            $qtyDifference = $request->qty - $receipt->qty;
            
            // Update the receipt
            $receipt->receipt_number = $request->receipt_number;
            $receipt->date = $request->date;
            $receipt->item_code = $request->item_code;
            $receipt->desc = $request->desc;
            $receipt->qty = $request->qty;
            $receipt->weight_total = $request->weight_total;
            $receipt->project = $request->project;
            $receipt->remarks = $request->remarks;
            $receipt->given_by = $request->given_by;
            $receipt->received_by = $request->received_by;
            $receipt->migi_detail_id = $request->migi_detail_id;
            $receipt->save();
            
            // Only update the oldcore if there's a quantity difference and migi_detail_id is provided
            if ($qtyDifference != 0 && $request->migi_detail_id) {
                // Update the oldcore quantity
                $oldcore = Oldcore::where('item_code', $request->item_code)
                    ->where('migi_detail_id', $request->migi_detail_id)
                    ->first();
                    
                if ($oldcore) {
                    // Adjust the oldcore quantity based on the difference
                    $oldcore->total_qty -= $qtyDifference;
                    if ($oldcore->total_qty < 0) {
                        $oldcore->total_qty = 0;
                    }
                    $oldcore->save();
                }
                
                // Update the migi_detail if needed
                $migiDetail = MigiDetail::find($request->migi_detail_id);
                if ($migiDetail) {
                    // Update received quantity - field exists in the migration
                    $migiDetail->received_qty = ($migiDetail->received_qty ?? 0) + (int)$qtyDifference;
                    if ($migiDetail->received_qty < 0) {
                        $migiDetail->received_qty = 0;
                    }
                    $migiDetail->save();
                }
            }
            
            DB::commit();
            
            return redirect()->route('oldcores.index')->with('success', 'Receipt updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
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
                    // Add the quantity back to the oldcore
                    $oldcore->total_qty += $receipt->qty;
                    $oldcore->save();
                }
                
                // Update the migi_detail if needed
                $migiDetail = MigiDetail::find($receipt->migi_detail_id);
                if ($migiDetail) {
                    // Reduce the received quantity - field exists in the migration
                    $migiDetail->received_qty = ($migiDetail->received_qty ?? 0) - (int)$receipt->qty;
                    if ($migiDetail->received_qty < 0) {
                        $migiDetail->received_qty = 0;
                    }
                    $migiDetail->save();
                }
            }
            
            // Delete the receipt
            $receipt->delete();
            
            DB::commit();
            
            return redirect()->route('oldcores.index')->with('success', 'Receipt deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
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