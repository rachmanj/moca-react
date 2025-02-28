<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MigiDetail extends Model
{
    protected $guarded = [];

    /**
     * Get the migi that owns the detail.
     */
    public function migi(): BelongsTo
    {
        return $this->belongsTo(Migi::class);
    }

    /**
     * Get the oldcores for this migi detail.
     */
    public function oldcores(): HasMany
    {
        return $this->hasMany(Oldcore::class, 'migi_detail_id');
    }

    /**
     * Get the oldcore receipts for this migi detail.
     */
    public function oldcoreReceipts(): HasMany
    {
        return $this->hasMany(OldcoreReceipt::class, 'migi_detail_id');
    }
}
