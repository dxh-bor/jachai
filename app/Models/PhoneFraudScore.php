<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhoneFraudScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone',
        'score',
        'risk_level',
        'total_orders',
        'delivered',
        'cancelled',
        'returned',
        'courier_breakdown',
        'flags',
        'last_fetched_at',
    ];

    protected $casts = [
        'courier_breakdown' => 'array',
        'flags' => 'array',
        'last_fetched_at' => 'datetime',
    ];

    public function fraudCheckLogs()
    {
        return $this->hasMany(FraudCheckLog::class, 'phone', 'phone');
    }
}
