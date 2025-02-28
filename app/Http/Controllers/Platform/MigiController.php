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

    /**
     * Convert temporary MIGI data to permanent records
     */
    public function convertData()
    {
        try {
            // Check if there's data to convert
            $migiGroups = $this->getUniqueDocumentNumbers();
            if ($migiGroups->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No data to convert'
                ]);
            }

            // Initialize counters
            $importedCount = 0;
            $skippedCount = 0;
            $detailsCount = 0;

            // Begin transaction for data integrity
            DB::beginTransaction();

            // Get the current batch number
            $currentBatch = $this->getNextBatchNumber();

            // Get existing document numbers to avoid duplicates
            $existingDocNumbers = $this->getExistingDocumentNumbers();

            // Process each document group
            foreach ($migiGroups as $group) {
                $result = $this->processDocumentGroup($group, $currentBatch, $existingDocNumbers);
                
                if ($result['status'] === 'skipped') {
                    $skippedCount++;
                    continue;
                }
                
                $importedCount++;
                $detailsCount += $result['details_count'];
                $existingDocNumbers[] = $result['document_number'];
            }

            DB::commit();

            // Prepare success message
            $message = $this->prepareSuccessMessage($importedCount, $detailsCount, $currentBatch, $skippedCount);

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

    /**
     * Get unique document numbers from temporary data
     */
    private function getUniqueDocumentNumbers()
    {
        return DB::table('migi_temps')
            ->select('document_number')
            ->distinct()
            ->get();
    }

    /**
     * Get the next batch number
     */
    private function getNextBatchNumber()
    {
        $maxBatch = DB::table('migis')->max('batch') ?? 0;
        return $maxBatch + 1;
    }

    /**
     * Get existing document numbers to avoid duplicates
     */
    private function getExistingDocumentNumbers()
    {
        return DB::table('migis')
            ->pluck('document_number')
            ->toArray();
    }

    /**
     * Process a single document group
     */
    private function processDocumentGroup($group, $currentBatch, $existingDocNumbers)
    {
        // Get the first record for this document number to use as header
        $migiHeader = DB::table('migi_temps')
            ->where('document_number', $group->document_number)
            ->first();

        if (!$migiHeader) {
            return ['status' => 'skipped'];
        }

        // Skip if document number already exists
        if (in_array($migiHeader->document_number, $existingDocNumbers)) {
            return ['status' => 'skipped'];
        }

        // Create Migi record
        $migiId = $this->createMigiRecord($migiHeader, $currentBatch);

        // Process details for this document
        $detailsCount = $this->processDocumentDetails($migiHeader->document_number, $migiId);

        return [
            'status' => 'imported',
            'document_number' => $migiHeader->document_number,
            'details_count' => $detailsCount
        ];
    }

    /**
     * Create a new MIGI record
     */
    private function createMigiRecord($migiHeader, $currentBatch)
    {
        return DB::table('migis')->insertGetId([
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
    }

    /**
     * Process details for a document
     */
    private function processDocumentDetails($documentNumber, $migiId)
    {
        // Get all items for this document
        $migiItems = DB::table('migi_temps')
            ->where('document_number', $documentNumber)
            ->get();

        $detailsCount = 0;

        // Insert each item as a detail record
        foreach ($migiItems as $item) {
            // Insert migi_detail record and get the ID
            $migiDetailId = DB::table('migi_details')->insertGetId([
                'migi_id' => $migiId,
                'line' => $item->line,
                'item_code' => $item->item_code,
                'desc' => $item->desc,
                'qty' => $item->qty,
                'stock_price' => $item->stock_price,
                'total_price' => $item->total_price,
                'wo_qty' => $item->wo_qty,
                'project_code' => $item->project_code,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // Check if an oldcore record exists with the same item_code and project_code
            $existingOldcore = DB::table('oldcores')
                ->where('item_code', $item->item_code)
                ->where('project_code', $item->project_code)
                ->first();
                
            if ($existingOldcore) {
                // Update the existing oldcore record
                DB::table('oldcores')
                    ->where('id', $existingOldcore->id)
                    ->update([
                        'total_qty' => DB::raw('total_qty + ' . $item->qty),
                        'updated_at' => now()
                    ]);
            } else {
                // Create a new oldcore record
                DB::table('oldcores')->insert([
                    'migi_detail_id' => $migiDetailId,
                    'item_code' => $item->item_code,
                    'desc' => $item->desc,
                    'total_qty' => $item->qty,
                    'project_code' => $item->project_code,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
            
            $detailsCount++;
        }

        return $detailsCount;
    }

    /**
     * Prepare success message
     */
    private function prepareSuccessMessage($importedCount, $detailsCount, $currentBatch, $skippedCount)
    {
        $message = "Successfully converted {$importedCount} documents with {$detailsCount} detail items (Batch #{$currentBatch})";
        if ($skippedCount > 0) {
            $message .= ", skipped {$skippedCount} duplicate documents";
        }
        return $message;
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
