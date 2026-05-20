<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use App\Models\UserPlan;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if ($user) {
                // Update user if they exist but don't have google_id or avatar
                $user->update([
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                ]);
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'password' => bcrypt(Str::random(16)), // Dummy password
                    'role' => 'user',
                    'is_active' => true,
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
            }

            Auth::login($user);

            if ($user->isAdmin()) {
                return redirect()->intended('/admin/dashboard');
            }

            return redirect()->intended('/checker');

        } catch (Exception $e) {
            return redirect('/login')->with('error', 'Something went wrong with Google Login.');
        }
    }
}
