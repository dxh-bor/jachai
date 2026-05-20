<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        // Automatically assign Basic plan
        $basicPlan = Plan::where('name', 'like', '%Basic%')->first();

        if ($basicPlan) {
            UserPlan::create([
                'user_id' => $user->id,
                'plan_id' => $basicPlan->id,
                'started_at' => now(),
                'expires_at' => now()->addDays($basicPlan->duration_days),
                'checks_used' => 0,
                'is_active' => true,
            ]);

            Payment::create([
                'user_id' => $user->id,
                'plan_id' => $basicPlan->id,
                'amount' => 0.00,
                'status' => 'completed',
                'paid_at' => now(),
            ]);
        }

        Auth::login($user);

        return redirect('/checker')->with('success', 'Registration successful! Basic plan has been assigned.');
    }
}
