<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPaymentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $plan = Plan::findOrFail($request->plan_id);

        return Inertia::render('User/Payment', [
            'plan' => $plan,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:bkash,nagad,rocket',
            'transaction_id' => 'required|string|unique:payments,transaction_id',
        ]);

        $plan = Plan::findOrFail($validated['plan_id']);

        Payment::create([
            'user_id' => auth()->id(),
            'plan_id' => $plan->id,
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'],
            'status' => 'pending',
        ]);

        return redirect()->route('plans')->with('success', 'Payment submitted successfully! Please wait up to 24 hours for our team to verify your transaction and upgrade your plan.');
    }
}
