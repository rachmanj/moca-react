<?php

namespace App\Imports;

use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\MigiTemp;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MigiTempImport implements ToCollection, WithHeadingRow
{
    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $allowedPrefixes = ['SP-', 'GT-', 'UC-', 'CO-'];
        
        // Track unique document_number + line combinations to prevent duplicates
        $importedCombinations = [];
        
        // Add debugging counters
        $totalRows = count($rows);
        $skippedEmptyFields = 0;
        $skippedNoAllowedPrefix = 0;
        $skippedDuplicateInBatch = 0;
        $skippedExistingInDB = 0;
        $importedRows = 0;
        
        Log::info("Starting import of {$totalRows} rows");
        
        foreach ($rows as $index => $row) {
            // Log the row being processed for debugging
            Log::info("Processing row " . ($index + 1), [
                'document_number' => $row['document_number'] ?? 'MISSING',
                'line' => $row['line'] ?? 'MISSING',
                'item_code' => $row['item_code'] ?? 'MISSING'
            ]);
            
            // Skip rows with empty document_number or line (item_code is now optional)
            if (empty($row['document_number']) || empty($row['line'])) {
                Log::info("Skipping row " . ($index + 1) . " - Empty required field (document_number or line)");
                $skippedEmptyFields++;
                continue;
            }
            
            // Only check for allowed prefixes if item_code is not empty
            if (!empty($row['item_code'])) {
                // Check if item_code starts with any of the allowed prefixes
                $hasAllowedPrefix = false;
                foreach ($allowedPrefixes as $prefix) {
                    if (strpos($row['item_code'], $prefix) === 0) {
                        $hasAllowedPrefix = true;
                        break;
                    }
                }
                
                // Skip rows that don't have allowed prefixes
                if (!$hasAllowedPrefix) {
                    Log::info("Skipping row " . ($index + 1) . " - No allowed prefix in item_code: " . $row['item_code']);
                    $skippedNoAllowedPrefix++;
                    continue;
                }
            }
            
            // Create a unique key for document_number and line combination
            $combinationKey = $row['document_number'] . '_' . $row['line'];
            
            // Skip if this combination already exists in our tracking array
            // This ensures only the first occurrence of a document_number + line combination is imported
            if (in_array($combinationKey, $importedCombinations)) {
                Log::info("Skipping row " . ($index + 1) . " - Duplicate combination in current batch: " . $combinationKey);
                $skippedDuplicateInBatch++;
                continue;
            }
            
            // Also check if this combination already exists in the database
            $existingRecord = DB::table('migi_temps')
                ->where('document_number', $row['document_number'])
                ->where('line', $row['line'])
                ->exists();
                
            if ($existingRecord) {
                Log::info("Skipping row " . ($index + 1) . " - Combination already exists in database: " . $combinationKey);
                $skippedExistingInDB++;
                continue;
            }
            
            // Add to our tracking array to prevent duplicates in the same import batch
            $importedCombinations[] = $combinationKey;
            
            // Insert the row into the database
            DB::table('migi_temps')->insert([
                'document_number' => $row['document_number'],
                'creation_date' => $this->transformDate($row['creation_date'] ?? null),
                'document_date' => $this->transformDate($row['document_date'] ?? null),
                'wo_number' => $row['wo_number'] ?? null,
                'subject' => $row['subject'] ?? null,
                'category' => $row['category'] ?? null,
                'line' => $row['line'],
                'issue_purpose' => $row['issue_purpose'] ?? null,
                'job_category' => $row['job_category'] ?? null,
                'job_name' => $row['job_name'] ?? null,
                'unit_number' => $row['unit_number'] ?? null,
                'model_number' => $row['model_number'] ?? null,
                'serial_number' => $row['serial_number'] ?? null,
                'hours_meter' => $row['hours_meter'] ?? null,
                'item_code' => $row['item_code'] ?? null, // Make item_code optional
                'desc' => $row['desc'] ?? null,
                'qty' => $row['qty'] ?? null,
                'stock_price' => $row['stock_price'] ?? null,
                'total_price' => $row['total_price'] ?? null,
                'project_code' => $row['project_code'] ?? null,
                'warehouse_name' => $row['warehouse_name'] ?? null,
                'no_ba_oldcore' => $row['no_ba_oldcore'] ?? null,
                'order_type' => $row['order_type'] ?? null,
                'status_gi' => $row['status_gi'] ?? null,
                'gr_no' => $row['gr_no'] ?? null,
                'm_ret_no' => $row['m_ret_no'] ?? null,
                'wo_item_code' => $row['wo_item_code'] ?? null,
                'wo_desc' => $row['wo_desc'] ?? null,
                'wo_qty' => $row['wo_qty'] ?? null,
                'keterangan' => $row['keterangan'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            Log::info("Successfully imported row " . ($index + 1) . " with combination: " . $combinationKey);
            $importedRows++;
        }
        
        // Log summary of import
        Log::info("Import summary", [
            'total_rows' => $totalRows,
            'imported_rows' => $importedRows,
            'skipped_empty_fields' => $skippedEmptyFields,
            'skipped_no_allowed_prefix' => $skippedNoAllowedPrefix,
            'skipped_duplicate_in_batch' => $skippedDuplicateInBatch,
            'skipped_existing_in_db' => $skippedExistingInDB
        ]);
    }
    
    /**
     * Transform a date value from the Excel file.
     *
     * @param mixed $value
     * @return string|null
     */
    private function transformDate($value)
    {
        if (empty($value)) {
            return null;
        }
        
        try {
            // Handle Excel date format or string date
            if (is_numeric($value)) {
                // Convert Excel date to PHP date
                $date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value);
                return $date->format('Y-m-d');
            } else {
                // Try to parse the date string
                return date('Y-m-d', strtotime($value));
            }
        } catch (\Exception $e) {
            return null;
        }
    }
}
