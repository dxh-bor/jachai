<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Payment::with(['user', 'plan'])
            ->when($request->date_from, fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->date_to, fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
            'filters' => $request->only(['date_from', 'date_to', 'status']),
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:completed,failed',
        ]);

        \DB::transaction(function () use ($payment, $validated) {
            $payment->update([
                'status' => $validated['status'],
                'paid_at' => $validated['status'] === 'completed' ? now() : null,
            ]);

            if ($validated['status'] === 'completed') {
                $userPlan = \App\Models\UserPlan::firstOrCreate(
                    ['user_id' => $payment->user_id],
                    ['plan_id' => $payment->plan_id, 'is_active' => true]
                );

                $userPlan->update([
                    'plan_id' => $payment->plan_id,
                    'started_at' => now(),
                    'expires_at' => now()->addMonths(1),
                    'checks_used' => 0,
                    'is_active' => true,
                ]);
            }
        });

        return back()->with('success', 'Payment status updated and plan activated.');
    }
}
