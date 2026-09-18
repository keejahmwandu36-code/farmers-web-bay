<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class NasaPowerService
{
    private const BASE_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point';

    public function dailyWeather(float $latitude, float $longitude, int $days = 7): array
    {
        $end   = now()->subDay()->format('Ymd');
        $start = now()->subDays($days + 1)->format('Ymd');

        $cacheKey = "nasa-power:{$latitude}:{$longitude}:{$start}:{$end}";

        return Cache::remember($cacheKey, now()->addHours(12), function () use ($latitude, $longitude, $start, $end) {
            $response = Http::timeout(20)->get(self::BASE_URL, [
                'parameters' => 'PRECTOTCORR,T2M,T2M_MAX,T2M_MIN,RH2M,ALLSKY_SFC_SW_DWN',
                'community'  => 'AG',
                'longitude'  => $longitude,
                'latitude'   => $latitude,
                'start'      => $start,
                'end'        => $end,
                'format'     => 'JSON',
            ]);

            if (! $response->successful()) {
                return ['error' => 'NASA POWER API unavailable'];
            }

            $data = $response->json();
            $params = $data['properties']['parameter'] ?? [];

            $precip   = $params['PRECTOTCORR'] ?? [];
            $tempAvg  = $params['T2M'] ?? [];
            $tempMax  = $params['T2M_MAX'] ?? [];
            $tempMin  = $params['T2M_MIN'] ?? [];
            $humidity = $params['RH2M'] ?? [];
            $solar    = $params['ALLSKY_SFC_SW_DWN'] ?? [];

            return [
                'period' => [
                    'start' => $start,
                    'end'   => $end,
                    'days'  => count($precip),
                ],
                'rainfall_mm'      => round(array_sum(array_filter($precip, fn ($v) => is_numeric($v) && $v != -999)), 2),
                'avg_temp_c'       => $this->avg($tempAvg),
                'max_temp_c'       => $this->max($tempMax),
                'min_temp_c'       => $this->min($tempMin),
                'avg_humidity_pct' => $this->avg($humidity),
                'avg_solar_mj_m2'  => $this->avg($solar),
                'daily' => [
                    'rainfall_mm' => $precip,
                    'temp_c'      => $tempAvg,
                    'humidity'    => $humidity,
                ],
            ];
        });
    }

    private function avg(array $values): ?float
    {
        $nums = array_filter($values, fn ($v) => is_numeric($v) && $v != -999);
        return count($nums) ? round(array_sum($nums) / count($nums), 1) : null;
    }

    private function max(array $values): ?float
    {
        $nums = array_filter($values, fn ($v) => is_numeric($v) && $v != -999);
        return count($nums) ? round(max($nums), 1) : null;
    }

    private function min(array $values): ?float
    {
        $nums = array_filter($values, fn ($v) => is_numeric($v) && $v != -999);
        return count($nums) ? round(min($nums), 1) : null;
    }
}