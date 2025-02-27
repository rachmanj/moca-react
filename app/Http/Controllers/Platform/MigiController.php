<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\MigiTempImport;
use Illuminate\Support\Facades\DB;

class MigiController extends Controller
{   
    public function index()
    {
        $hasTemporaryData = DB::table('migi_temps')->exists();
        
        // Get all migis records with pagination
        $migis = DB::table('migis')
            ->select('id', 'document_number', 'document_date', 'creation_date', 'wo_number', 'unit_number', 
                    'model_number', 'serial_number', 'category', 'status_gi', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('platform/migi/index', [
            'hasTemporaryData' => $hasTemporaryData,
            'migis' => $migis
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file_upload' => 'required|mimes:xls,xlsx',
        ]);

        $file = $request->file('file_upload');
        $filename = 'migi_' . uniqid() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $filename);

        Excel::import(new MigiTempImport, public_path('uploads/' . $filename));
        unlink(public_path('uploads/' . $filename));

        return Inertia::render('platform/migi/index', [
            // 'success' => 'File uploaded successfully',
            'hasTemporaryData' => true // We just uploaded data
        ]);
    }

    public function truncate()
    {
        try {
            // Truncate the migi_temps table
            DB::table('migi_temps')->truncate();
            
            return Inertia::render('platform/migi/index', [
                // 'success' => 'Temporary data cleared successfully',
                'hasTemporaryData' => false // Table is now empty
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to clear temporary data: ' . $e->getMessage()], 500);
        }
    }

    public function convertData()
    {
        try {
            // Get all unique records from migi_temps grouped by document_number
            $migiGroups = DB::table('migi_temps')
                ->select('document_number')
                ->distinct()
                ->get();

            if ($migiGroups->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No data to convert'
                ]);
            }

            $importedCount = 0;
            $skippedCount = 0;
            $detailsCount = 0;

            // Begin transaction for data integrity
            DB::beginTransaction();

            // Get the current max batch number
            $maxBatch = DB::table('migis')->max('batch') ?? 0;
            $currentBatch = $maxBatch + 1;

            // Get existing document numbers to avoid duplicates
            $existingDocNumbers = DB::table('migis')
                ->pluck('document_number')
                ->toArray();

            foreach ($migiGroups as $group) {
                // Get the first record for this document number to use as header
                $migiHeader = DB::table('migi_temps')
                    ->where('document_number', $group->document_number)
                    ->first();

                if (!$migiHeader) {
                    continue; // Skip if no data found
                }

                // Skip if document number already exists
                if (in_array($migiHeader->document_number, $existingDocNumbers)) {
                    $skippedCount++;
                    continue;
                }

                // Create Migi record
                $migiId = DB::table('migis')->insertGetId([
                    'document_number' => $migiHeader->document_number,
                    'creation_date' => $migiHeader->creation_date,
                    'document_date' => $migiHeader->document_date,
                    'wo_number' => $migiHeader->wo_number,
                    'subject' => $migiHeader->subject,
                    'category' => $migiHeader->category,
                    'issue_purpose' => $migiHeader->issue_purpose,
                    'job_category' => $migiHeader->job_category,
                    'job_name' => $migiHeader->job_name,
                    'unit_number' => $migiHeader->unit_number,
                    'model_number' => $migiHeader->model_number,
                    'serial_number' => $migiHeader->serial_number,
                    'hours_meter' => $migiHeader->hours_meter,
                    'project_code' => $migiHeader->project_code,
                    'warehouse_name' => $migiHeader->warehouse_name,
                    'no_ba_oldcore' => $migiHeader->no_ba_oldcore,
                    'order_type' => $migiHeader->order_type,
                    'status_gi' => $migiHeader->status_gi,
                    'gr_no' => $migiHeader->gr_no,
                    'm_ret_no' => $migiHeader->m_ret_no,
                    'wo_item_code' => $migiHeader->wo_item_code,
                    'wo_desc' => $migiHeader->wo_desc,
                    'keterangan' => $migiHeader->keterangan,
                    'batch' => $currentBatch,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Add to existing document numbers to prevent duplicates in the same batch
                $existingDocNumbers[] = $migiHeader->document_number;

                // Get all items for this document
                $migiItems = DB::table('migi_temps')
                    ->where('document_number', $migiHeader->document_number)
                    ->get();

                // Insert each item as a detail record
                foreach ($migiItems as $item) {
                    DB::table('migi_details')->insert([
                        'migi_id' => $migiId,
                        'line' => $item->line,
                        'item_code' => $item->item_code,
                        'desc' => $item->desc,
                        'qty' => $item->qty,
                        'stock_price' => $item->stock_price,
                        'total_price' => $item->total_price,
                        'wo_qty' => $item->wo_qty,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                    $detailsCount++;
                }

                $importedCount++;
            }

            DB::commit();

            $message = "Successfully converted {$importedCount} documents with {$detailsCount} detail items (Batch #{$currentBatch})";
            if ($skippedCount > 0) {
                $message .= ", skipped {$skippedCount} duplicate documents";
            }

            return Inertia::render('platform/migi/index', [
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
        $details = DB::table('migi_details')
            ->where('migi_id', $id)
            ->get();
        
        return response()->json($details);
    }
}
