<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ReportedFraud;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportFraudController extends Controller
{
    public function index()
    {
        $reports = ReportedFraud::where('user_id', auth()->id())
            ->latest()
            ->get();
            
        return Inertia::render('User/ReportFraud', [
            'reports' => $reports
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string|max:20',
            'name' => 'nullable|string|max:255',
            'details' => 'required|string|max:1000',
        ]);

        ReportedFraud::create([
            'phone' => $validated['phone'],
            'name' => $validated['name'],
            'details' => $validated['details'],
            'user_id' => auth()->id(),
            'source' => 'manual',
            'status' => 1,
        ]);

        return redirect()->back()->with('success', 'Fraud reported successfully!');
    }
}
