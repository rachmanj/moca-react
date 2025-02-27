<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Inventory;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index()
    {
        // Get all inventory items with calculated fields
        $inventories = Inventory::select([
            'id',
            'item_code',
            'description',
            'total_qty',
            'avg_unit_price',
            'total_amount',
            'uom',
            'avg_weight',
            'total_weight',
            'created_at',
            'updated_at'
        ])->get();
        
        // Calculate summary statistics
        $totalItems = $inventories->count();
        $totalQuantity = $inventories->sum('total_qty');
        $totalWeight = $inventories->sum('total_weight');
        
        // Get monthly weight data for the chart
        $monthlyWeightData = DB::table('inventories')
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('SUM(total_weight) as total_weight'))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->limit(6)
            ->get();
            
        return Inertia::render('platform/inventory/index', [
            'inventories' => $inventories,
            'stats' => [
                'totalItems' => $totalItems,
                'totalQuantity' => $totalQuantity,
                'totalWeight' => $totalWeight,
            ],
            'monthlyData' => $monthlyWeightData
        ]);
    }

    /**
     * Show inventory item details with GRPO history
     */
    public function show($id)
    {
        $inventory = Inventory::findOrFail($id);
        
        // Get GRPO history for this inventory item
        $grpoDetails = DB::table('grpo_details')
            ->select(
                'grpo_details.id',
                'grpo_details.grpo_id',
                'grpo_details.qty',
                'grpo_details.unit_price',
                'grpo_details.item_amount',
                'grpo_details.uom',
                'grpo_details.weight',
                'grpos.grpo_no',
                'grpos.grpo_date',
                'grpos.unit_no',
                'grpos.for_project'
            )
            ->join('grpos', 'grpo_details.grpo_id', '=', 'grpos.id')
            ->where('grpo_details.item_code', $inventory->item_code)
            ->orderBy('grpos.grpo_date', 'desc')
            ->get();
        
        return Inertia::render('platform/inventory/show', [
            'inventory' => $inventory,
            'grpoDetails' => $grpoDetails
        ]);
    }

    /**
     * Get inventory item details
     */
    public function getDetails($id)
    {
        $details = DB::table('inventories')
            ->where('id', $id)
            ->first();
        
        return response()->json($details);
    }
}
