<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'google_id',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function checkLogs()
    {
        return $this->hasMany(FraudCheckLog::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function userPlans()
    {
        return $this->hasMany(UserPlan::class);
    }

    public function activePlan()
    {
        return $this->hasOne(UserPlan::class)
            ->where('is_active', true)
            ->where('expires_at', '>', now());
    }
}
