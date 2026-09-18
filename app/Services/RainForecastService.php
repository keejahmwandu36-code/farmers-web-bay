<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class RainForecastService
{
    private const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

    public function forecast(float $latitude, float $longitude, int $days = 7): array
    {
        $cacheKey = "rain-forecast:{$latitude}:{$longitude}:{$days}";

        return Cache::remember($cacheKey, now()->addHour(), function () use ($latitude, $longitude, $days) {
            $response = Http::timeout(20)->get(self::BASE_URL, [
                'latitude'      => $latitude,
                'longitude'     => $longitude,
                'hourly'        => 'precipitation,precipitation_probability',
                'daily'         => 'precipitation_sum,precipitation_probability_max',
                'timezone'      => 'auto',
                'forecast_days' => $days,
            ]);

            if (! $response->successful()) {
                return ['error' => 'Open-Meteo API unavailable'];
            }

            $data     = $response->json();
            $hourly   = $data['hourly'] ?? [];
            $daily    = $data['daily'] ?? [];
            $timezone = $data['timezone'] ?? 'UTC';

            $hourTimes  = $hourly['time'] ?? [];
            $hourPrecip = $hourly['precipitation'] ?? [];
            $hourProb   = $hourly['precipitation_probability'] ?? [];

            $nextRainStart = null;
            $nextRainIndex = null;

            foreach ($hourTimes as $i => $time) {
                $precip = (float) ($hourPrecip[$i] ?? 0);
                $prob   = (float) ($hourProb[$i] ?? 0);

                if ($precip >= 0.2 || $prob >= 60) {
                    $nextRainStart = $time;
                    $nextRainIndex = $i;
                    break;
                }
            }

            $nextRainDay = null;
            $nextRainHours = null;

            if ($nextRainStart) {
                $start = new \DateTime($nextRainStart, new \DateTimeZone($timezone));
                $now   = new \DateTime('now', new \DateTimeZone($timezone));
                $diff  = $now->diff($start);
                $nextRainDay   = $diff->days;
                $nextRainHours = $diff->h;
            }

            $dailyRows = [];
            foreach (($daily['time'] ?? []) as $i => $date) {
                $dailyRows[] = [
                    'date'            => $date,
                    'rainfall_mm'     => round((float) ($daily['precipitation_sum'][$i] ?? 0), 1),
                    'probability_pct' => (int) ($daily['precipitation_probability_max'][$i] ?? 0),
                ];
            }

            $totalMm = array_sum(array_column($dailyRows, 'rainfall_mm'));

            return [
                'timezone'        => $timezone,
                'next_rain_start' => $nextRainStart,
                'next_rain_day'   => $nextRainDay,
                'next_rain_hours' => $nextRainHours,
                'total_mm'        => round($totalMm, 1),
                'daily'           => $dailyRows,
            ];
        });
    }
}