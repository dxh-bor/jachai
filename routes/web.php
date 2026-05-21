<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\User\UserDashboardController;
use App\Http\Controllers\User\FraudCheckController;
use App\Http\Controllers\User\UserPlanController;
use App\Http\Controllers\User\UserPaymentController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminPlanController;
use App\Http\Controllers\Admin\AdminPaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('guest')->group(function () {

    Route::get('login', [LoginController::class, 'show'])->name('login');
    Route::post('login', [LoginController::class, 'store']);

    Route::get('register', [RegisterController::class, 'show'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);

    Route::get('auth/google', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'redirectToGoogle'])->name('google.login');
    Route::get('auth/google/callback', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'handleGoogleCallback']);
});

// Auth Routes
Route::middleware('auth')->group(function () {
    Route::post('logout', [LogoutController::class, 'store'])->name('logout');

    // User Routes
    Route::get('dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('checker', [FraudCheckController::class, 'index'])->name('checker');
    Route::post('checker/check', [FraudCheckController::class, 'check'])->name('checker.check');
    Route::get('plans', [UserPlanController::class, 'index'])->name('plans');
    Route::get('payment', [UserPaymentController::class, 'index'])->name('payment');
    Route::post('payment', [UserPaymentController::class, 'store'])->name('payment.store');

    // Add report fraud routes here
    
    // Add report fraud routes here
    Route::get('report-fraud', [\App\Http\Controllers\User\ReportFraudController::class, 'index'])->name('report.fraud');
    Route::post('report-fraud', [\App\Http\Controllers\User\ReportFraudController::class, 'store'])->name('report.fraud.store');

    Route::get('profile', function () {
        return Inertia\Inertia::render('User/Profile');
    })->name('profile');

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('users', [AdminUserController::class, 'index'])->name('users');
        Route::patch('users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::patch('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::get('plans', [AdminPlanController::class, 'index'])->name('plans');
        Route::patch('plans/{plan}', [AdminPlanController::class, 'update'])->name('plans.update');
        Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments');
        Route::patch('payments/{payment}', [AdminPaymentController::class, 'update'])->name('payments.update');
    });
});

Route::get('/clear-redis-cache', function () {

    \Illuminate\Support\Facades\Cache::flush();

    \Illuminate\Support\Facades\Redis::flushall();

    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');

    return 'Cache and direct Redis cache cleared successfully for testing!';
});
