<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FraudCheckLog;
use App\Models\Payment;
use App\Models\User;
use App\Models\UserPlan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::where('role', 'user')->count();
        $monthlyRevenue = Payment::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->sum('amount');
        $checksToday = FraudCheckLog::whereDate('created_at', now()->toDateString())->count();
        $activeSubs = UserPlan::where('is_active', true)->where('expires_at', '>', now())->count();

        // Income summary for last 6 months
        $incomeSummary = Payment::select(
            DB::raw('SUM(amount) as total'),
            DB::raw("DATE_FORMAT(created_at, '%b %Y') as month")
        )
        ->where('status', 'completed')
        ->groupBy('month')
        ->orderBy('created_at', 'desc')
        ->limit(6)
        ->get()
        ->reverse()
        ->values();

        $recentPayments = Payment::with(['user', 'plan'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'monthly_revenue' => $monthlyRevenue,
                'checks_today' => $checksToday,
                'active_subs' => $activeSubs,
            ],
            'incomeSummary' => $incomeSummary,
            'recentPayments' => $recentPayments,
        ]);
    }
}
