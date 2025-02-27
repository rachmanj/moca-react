<?php

namespace App\Imports;

use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\MigiTemp;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MigiTempImport implements ToCollection, WithHeadingRow
{
    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $allowedPrefixes = ['SP-', 'GT-', 'UC-', 'CO-'];
        
        foreach ($rows as $row) {
            // Skip rows with empty item_code
            if (empty($row['item_code'])) {
                continue;
            }
            
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
                continue;
            }
            
            // Insert the row into the database
            DB::table('migi_temps')->insert([
                'document_number' => $row['document_number'] ?? null,
                'creation_date' => $this->transformDate($row['creation_date']),
                'document_date' => $this->transformDate($row['document_date']),
                'wo_number' => $row['wo_number'] ?? null,
                'subject' => $row['subject'] ?? null,
                'category' => $row['category'] ?? null,
                'line' => $row['line'] ?? null,
                'issue_purpose' => $row['issue_purpose'] ?? null,
                'job_category' => $row['job_category'] ?? null,
                'job_name' => $row['job_name'] ?? null,
                'unit_number' => $row['unit_number'] ?? null,
                'model_number' => $row['model_number'] ?? null,
                'serial_number' => $row['serial_number'] ?? null,
                'hours_meter' => $row['hours_meter'] ?? null,
                'item_code' => $row['item_code'] ?? null,
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
        }
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
