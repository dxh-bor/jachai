<?php

namespace App\Services;

use App\Models\FraudCheckLog;
use App\Models\PhoneFraudScore;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class FraudScoreService
{
    protected $steadfastService;
    protected $pathaoService;
    protected $redxService;
    protected $paperflyService;
    protected $carrybeeService;

    public function __construct(
        SteadfastService $steadfastService,
        PathaoService $pathaoService,
        RedxService $redxService,
        PaperflyService $paperflyService,
        CarrybeeService $carrybeeService
    ) {
        $this->steadfastService = $steadfastService;
        $this->pathaoService = $pathaoService;
        $this->redxService = $redxService;
        $this->paperflyService = $paperflyService;
        $this->carrybeeService = $carrybeeService;
    }

    public function check(string $phone, User $user)
    {
        // 1. Check if user has active plan
        $activePlan = $user->activePlan;
        if (!$activePlan) {
            return ['status' => 'error', 'message' => 'No active plan found. Please subscribe to a plan.'];
        }

        // 2. Check if user has reached API limit
        if ($activePlan->hasReachedLimit()) {
            return ['status' => 'error', 'message' => 'Monthly check limit reached. Please upgrade.'];
        }

        // 3. Check Redis cache
        $cacheKey = "fraud_score_{$phone}";
        $cachedData = Redis::get($cacheKey);

        if ($cachedData) {
            $result = json_decode($cachedData, true);
            $this->logCheck($user, $phone, $result, 'cache');
            $this->incrementChecksUsed($activePlan);
            return $result;
        }

        // 4. If not cached, call courier APIs
        $startTime = microtime(true);

        // Fetch data from all couriers using their respective services
        // $steadfastResult = $this->steadfastService->getDeliveryStats($phone);//output ok
        // $pathaoResult = $this->pathaoService->getDeliveryStats($phone);
        // $redxResult = $this->redxService->getDeliveryStats($phone);//output ok
        $paperflyResult = $this->paperflyService->getDeliveryStats($phone);
        // $carrybeeResult = $this->carrybeeService->getDeliveryStats($phone);
        dd($paperflyResult);

        // Aggregate results
        $data = $this->aggregateCourierData($steadfastResult, $pathaoResult, $redxResult, $paperflyResult, $carrybeeResult);

        // 5. Calculate fraud score
        $score = $this->calculateScore($data);
        $riskLevel = $this->getRiskLevel($score);
        $flags = $this->detectFlags($data, $score);

        $result = [
            'phone' => $phone,
            'score' => $score,
            'risk_level' => $riskLevel,
            'total_orders' => $data['total_orders'],
            'delivered' => $data['delivered'],
            'cancelled' => $data['cancelled'],
            'returned' => $data['returned'],
            'courier_breakdown' => $data['breakdown'],
            'flags' => $flags,
            'reported_frauds' => \App\Models\ReportedFraud::where('phone', $phone)->get()->toArray(),
            'last_fetched_at' => now()->toDateTimeString(),
            'source' => 'live'
        ];

        // 9. Save/update PhoneFraudScore in DB
        PhoneFraudScore::updateOrCreate(
            ['phone' => $phone],
            array_merge($result, ['last_fetched_at' => now()])
        );

        // 10. Cache result in Redis for 24 hours
        Redis::setex($cacheKey, 86400, json_encode($result));

        // 11. Create FraudCheckLog record
        $duration = (int) ((microtime(true) - $startTime) * 1000);
        $this->logCheck($user, $phone, $result, 'live', $duration);

        // 12. Increment user's checks_used
        $this->incrementChecksUsed($activePlan);

        return $result;
    }

    private function aggregateCourierData(array $steadfastResult, array $pathaoResult, array $redxResult, array $paperflyResult, array $carrybeeResult): array
    {
        $totalOrders = 0;
        $delivered = 0;
        $cancelled = 0;
        $returned = 0;
        $breakdown = [];

        // Process Steadfast results first
        if (isset($steadfastResult['error'])) {
            // Mock data fallback if Steadfast fails, same as other couriers
            $cOrders = rand(0, 20);
            $cDelivered = rand(0, $cOrders);
            $cCancelled = rand(0, $cOrders - $cDelivered);
            $cReturned = $cOrders - $cDelivered - $cCancelled;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['steadfast'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $cOrders > 0 ? round(($cDelivered / $cOrders) * 100, 2) : 0,
                'unavailable' => true,
                'error' => $steadfastResult['error']
            ];
        } else {
            $cOrders = $steadfastResult['total'];
            $cDelivered = $steadfastResult['success'];
            $cCancelled = $steadfastResult['cancel'];
            $cReturned = 0; // Steadfast service doesn't specifically provide returns in this snippet

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['steadfast'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $steadfastResult['success_ratio']
            ];
        }

        // Process Pathao results
        if (isset($pathaoResult['error'])) {
            $cOrders = rand(0, 20);
            $cDelivered = rand(0, $cOrders);
            $cCancelled = rand(0, $cOrders - $cDelivered);
            $cReturned = $cOrders - $cDelivered - $cCancelled;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['pathao'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $cOrders > 0 ? round(($cDelivered / $cOrders) * 100, 2) : 0,
                'unavailable' => true,
                'error' => $pathaoResult['error']
            ];
        } else {
            $cOrders = $pathaoResult['total'];
            $cDelivered = $pathaoResult['success'];
            $cCancelled = $pathaoResult['cancel'];
            $cReturned = 0;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['pathao'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $pathaoResult['success_ratio']
            ];
        }

        // Process RedX results
        if (isset($redxResult['error'])) {
            $cOrders = rand(0, 20);
            $cDelivered = rand(0, $cOrders);
            $cCancelled = rand(0, $cOrders - $cDelivered);
            $cReturned = $cOrders - $cDelivered - $cCancelled;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['redx'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $cOrders > 0 ? round(($cDelivered / $cOrders) * 100, 2) : 0,
                'unavailable' => true,
                'error' => $redxResult['error']
            ];
        } else {
            $cOrders = $redxResult['total'];
            $cDelivered = $redxResult['success'];
            $cCancelled = $redxResult['cancel'];
            $cReturned = 0;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['redx'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $redxResult['success_ratio']
            ];
        }

        // Process Paperfly results
        if (isset($paperflyResult['error'])) {
            $cOrders = rand(0, 20);
            $cDelivered = rand(0, $cOrders);
            $cCancelled = rand(0, $cOrders - $cDelivered);
            $cReturned = $cOrders - $cDelivered - $cCancelled;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['paperfly'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $cOrders > 0 ? round(($cDelivered / $cOrders) * 100, 2) : 0,
                'unavailable' => true,
                'error' => $paperflyResult['error']
            ];
        } else {
            $cOrders = $paperflyResult['total'];
            $cDelivered = $paperflyResult['success'];
            $cCancelled = $paperflyResult['cancel'];
            $cReturned = 0;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['paperfly'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $paperflyResult['success_ratio']
            ];
        }

        // Process Carrybee results
        if (isset($carrybeeResult['error'])) {
            $cOrders = rand(0, 20);
            $cDelivered = rand(0, $cOrders);
            $cCancelled = rand(0, $cOrders - $cDelivered);
            $cReturned = $cOrders - $cDelivered - $cCancelled;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['carrybee'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $cOrders > 0 ? round(($cDelivered / $cOrders) * 100, 2) : 0,
                'unavailable' => true,
                'error' => $carrybeeResult['error']
            ];
        } else {
            $cOrders = $carrybeeResult['total'];
            $cDelivered = $carrybeeResult['success'];
            $cCancelled = $carrybeeResult['cancel'];
            $cReturned = 0;

            $totalOrders += $cOrders;
            $delivered += $cDelivered;
            $cancelled += $cCancelled;
            $returned += $cReturned;

            $breakdown['carrybee'] = [
                'orders' => $cOrders,
                'delivered' => $cDelivered,
                'cancelled' => $cCancelled,
                'returned' => $cReturned,
                'success_rate' => $carrybeeResult['success_ratio']
            ];
        }

        return [
            'total_orders' => $totalOrders,
            'delivered' => $delivered,
            'cancelled' => $cancelled,
            'returned' => $returned,
            'breakdown' => $breakdown
        ];
    }

    private function calculateScore(array $data): int
    {
        $score = 0;
        $total = $data['total_orders'];
        $cancelled = $data['cancelled'];
        $returned = $data['returned'];

        if ($total === 0) {
            return 30; // base score for no history
        }

        $cancelRate = ($cancelled / $total) * 100;
        $returnRate = ($returned / $total) * 100;

        if ($cancelRate > 50)
            $score += 45;
        elseif ($cancelRate > 30)
            $score += 25;
        elseif ($cancelRate > 10)
            $score += 10;

        if ($returnRate > 30)
            $score += 20;
        elseif ($returnRate > 15)
            $score += 10;

        if ($cancelled >= 10)
            $score += 15;

        return min($score, 100);
    }

    private function getRiskLevel(int $score): string
    {
        if ($score >= 60)
            return 'high';
        if ($score >= 30)
            return 'medium';
        return 'safe';
    }

    private function detectFlags(array $data, int $score): array
    {
        $flags = [];
        $total = $data['total_orders'];
        $cancelled = $data['cancelled'];
        $returned = $data['returned'];

        if ($total === 0)
            $flags[] = 'no_history';
        if ($total > 0 && ($cancelled / $total) > 0.3)
            $flags[] = 'high_cancel_rate';
        if ($total > 0 && ($returned / $total) > 0.2)
            $flags[] = 'high_return_rate';
        if ($cancelled >= 5)
            $flags[] = 'repeat_canceller';
        if ($score >= 60)
            $flags[] = 'high_risk_customer';

        return $flags;
    }

    private function logCheck(User $user, string $phone, array $result, string $source, int $duration = 0)
    {
        FraudCheckLog::create([
            'user_id' => $user->id,
            'phone' => $phone,
            'score_returned' => $result['score'],
            'risk_level' => $result['risk_level'],
            'source' => $source,
            'response_ms' => $duration
        ]);
    }

    private function incrementChecksUsed($activePlan)
    {
        $activePlan->increment('checks_used');
    }
}
