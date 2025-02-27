<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grpo extends Model
{
    protected $guarded = [];

    public function details()
    {
        return $this->hasMany(GrpoDetail::class);
    }   
}
