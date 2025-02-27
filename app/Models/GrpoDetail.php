<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GrpoDetail extends Model
{
    protected $guarded = [];

    public function grpo()
    {
        return $this->belongsTo(Grpo::class);
    }
}
