<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPlanController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Plans', [
            'plans' => Plan::where('is_active', true)->get(),
            'activePlanId' => optional(auth()->user()->activePlan)->plan_id
        ]);
    }
}
