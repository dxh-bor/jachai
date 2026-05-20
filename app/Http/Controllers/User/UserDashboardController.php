<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $activePlan = $user->activePlan()->with('plan')->first();
        $recentChecks = $user->checkLogs()
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('User/Dashboard', [
            'activePlan' => $activePlan,
            'recentChecks' => $recentChecks,
        ]);
    }
}
