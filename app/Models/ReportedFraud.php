<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportedFraud extends Model
{
    protected $fillable = [
        'phone',
        'name',
        'details',
        'user_id',
        'source',
        'external_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
