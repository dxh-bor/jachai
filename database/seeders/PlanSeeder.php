<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::create([
            'name' => 'Basic (Free)',
            'price' => 0.00,
            'api_limit' => 50,
            'duration_days' => 30,
            'description' => '50 fraud checks per month. Perfect to get started.',
            'is_active' => true,
        ]);

        Plan::create([
            'name' => 'Pro',
            'price' => 499.00,
            'api_limit' => 500,
            'duration_days' => 30,
            'description' => '500 fraud checks per month. For growing businesses.',
            'is_active' => true,
        ]);

        Plan::create([
            'name' => 'Enterprise',
            'price' => 1499.00,
            'api_limit' => 5000,
            'duration_days' => 30,
            'description' => '5000 checks per month. For large e-commerce platforms.',
            'is_active' => true,
        ]);
    }
}
