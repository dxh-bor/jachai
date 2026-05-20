<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FraudCheckLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'score_returned',
        'risk_level',
        'source',
        'response_ms',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
