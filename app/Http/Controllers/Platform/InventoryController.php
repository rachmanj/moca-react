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
        $inventories = Inventory::all();
        return Inertia::render('platform/inventory/index', [
            'inventories' => $inventories
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
