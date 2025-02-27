<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Migi extends Model
{
    protected $guarded = [];

    public function details()
    {
        return $this->hasMany(MigiDetail::class);
    }
}
