<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\FraudScoreService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FraudCheckController extends Controller
{
    protected $fraudService;

    public function __construct(FraudScoreService $fraudService)
    {
        $this->fraudService = $fraudService;
    }

    public function index()
    {
        return Inertia::render('User/FraudChecker', [
            'recentChecks' => auth()->user()->checkLogs()->latest()->limit(10)->get(),
            'remainingChecks' => optional(auth()->user()->activePlan)->plan ? (auth()->user()->activePlan->plan->api_limit - auth()->user()->activePlan->checks_used) : 0
        ]);
    }

    public function check(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^01[3-9]\d{8}$/'],
        ], [
            'phone.regex' => 'The phone number must be a valid Bangladeshi number (01XXXXXXXXX).'
        ]);

        $result = $this->fraudService->check($request->phone, $request->user());

        if (isset($result['status']) && $result['status'] === 'error') {
            return back()->with('error', $result['message']);
        }

        return back()->with([
            'success' => 'Fraud check completed successfully.',
            'result' => $result
        ]);
    }
}
