<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Exception;

class PaperflyService
{

    protected string $baseUrl = 'https://go-app.paperfly.com.bd/merchant/api/react';

    protected string $username;
    protected string $password;
    public function __construct()
    {
        $this->username = config('fraud-checker-bd-courier.paperfly.user');
        $this->password = config('fraud-checker-bd-courier.paperfly.password');
    }
    public function getToken(): string
    {
        // Cache the token for 55 minutes since Paperfly tokens may expire
        return Cache::remember('fraud_checker_paperfly_token', 3300, function () {
            $response = Http::post("{$this->baseUrl}/authentication/login_using_password.php", [
                'username' => $this->username,
                'password' => $this->password,
            ]);

            if ($response->failed() || !$response->json('token')) {
                throw new \Exception("Paperfly Login Failed: " . $response->body());
            }

            return $response->json('token');
        });
    }

    public function getDeliveryStats(string $phoneNumber)
    {
        try {
            $token = $this->getToken();

            // Perform the Smart Check search
            $response = Http::withToken($token)
                ->withHeaders(['Accept' => 'application/json, text/plain, */*'])
                ->post("{$this->baseUrl}/smart-check/list.php", [
                    'search_text' => $phoneNumber,
                    'limit' => 50,
                    'page' => 1,
                ]);

            if ($response->failed()) {
                return ['error' => 'Failed to fetch fraud data from Paperfly', 'status' => $response->status()];
            }

            $data = $response->json();
            return $data;
            // Total records tells us how many associated history items exist
            $total = (int) ($data['totalRecords'] ?? 0);
            $records = $data['records'] ?? [];

            $success = 0;
            $cancel = 0;

            // Attempt to derive success/cancel from records if available.
            // If the paperfly `records` array yields clear status information,
            // this loops through and categorizes them.
            if (is_array($records) && count($records) > 0) {
                foreach ($records as $record) {
                    $status = strtolower($record['status'] ?? '');
                    if (str_contains($status, 'delivered') || str_contains($status, 'success')) {
                        $success++;
                    } elseif (str_contains($status, 'return') || str_contains($status, 'cancel') || str_contains($status, 'fail')) {
                        $cancel++;
                    }
                }
            }

            // Paperfly doesn't inherently give an aggregated summary like Steadfast if records array doesn't include status strings,
            // but we must still return standard data so we don't skew the ratio with 0 success and 0 cancel from 1 total
            // If the exact statuses aren't present in paperfly's array, we just report the total deliveries
            // We use 0 for success and cancel if we couldn't parse them, but success_ratio must be handled:
            $success_ratio = 0;
            if (($success + $cancel) > 0) {
                $totalParsed = $success + $cancel;
                $success_ratio = round(($success / $totalParsed) * 100, 2);
            }

            return [
                'success' => $success,
                'cancel' => $cancel,
                'total' => $total,
                'success_ratio' => $success_ratio,
            ];

        } catch (\Exception $e) {
            return [
                'error' => 'An error occurred while processing Paperfly request',
                'message' => $e->getMessage()
            ];
        }
    }
}
