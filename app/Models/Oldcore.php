<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Oldcore extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'migi_detail_id',
        'item_code',
        'desc',
        'total_qty',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_qty' => 'float',
    ];

    /**
     * Get the MIGI detail that this oldcore belongs to.
     */
    public function migiDetail()
    {
        return $this->belongsTo(MigiDetail::class);
    }

    /**
     * Get the receipts for this oldcore.
     */
    public function receipts()
    {
        return $this->hasMany(OldcoreReceipt::class, 'item_code', 'item_code')
            ->where('project', function ($query) {
                $query->select('project_code')
                    ->from('migi_details')
                    ->where('id', $this->migi_detail_id)
                    ->limit(1);
            });
    }
}
