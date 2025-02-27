<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\DB;

class GrpoTempImport implements ToCollection, WithHeadingRow
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        foreach ($collection as $row) {
            // Only import rows where weight > 0
            if (isset($row['weight']) && $row['weight'] > 0) {
                DB::table('grpo_temps')->insert([
                    'po_no' => $row['po_no'] ?? null,
                    'po_date' => $this->transformDate($row['po_date']),
                    'po_delivery_date' => $this->transformDate($row['po_delivery_date']),
                    'grpo_date' => $this->transformDate($row['grpo_date']),
                    'grpo_create_date' => $this->transformDate($row['grpo_create_date']),
                    'grpo_no' => $row['grpo_no'] ?? null,
                    'po_delivery_status' => $row['po_delivery_status'] ?? null,
                    'vendor_code' => $row['vendor_code'] ?? null,
                    'dept_code' => $row['dept_code'] ?? null,
                    'dept_name' => $row['dept_name'] ?? null,
                    'unit_no' => $row['unit_no'] ?? null,
                    'item_code' => $row['item_code'] ?? null,
                    'description' => $row['description'] ?? null,
                    'qty' => $row['qty'] ?? null,
                    'grpo_currency' => $row['grpo_currency'] ?? null,
                    'unit_price' => $row['unit_price'] ?? null,
                    'item_amount' => $row['item_amount'] ?? null,
                    'uom' => $row['uom'] ?? null,
                    'weight' => $row['weight'] ?? null,
                    'for_project' => $row['for_project'] ?? null,
                    'remarks' => $row['remarks'] ?? null,
                ]);
            }
        }
    }

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
