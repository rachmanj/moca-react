<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OldcoreReceipt extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'qty' => 'integer',
        'weight_total' => 'float',
    ];

    /**
     * Get the oldcore associated with this receipt.
     */
    public function oldcore()
    {
        return $this->belongsTo(Oldcore::class, 'item_code', 'item_code')
            ->where('project', $this->project);
    }

    /**
     * Get the migi detail that owns the receipt.
     */
    public function migiDetail(): BelongsTo
    {
        return $this->belongsTo(MigiDetail::class, 'migi_detail_id');
    }
}
