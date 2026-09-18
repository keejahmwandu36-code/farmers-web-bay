<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Farm;
use App\Services\NasaPowerService;
use App\Services\RainForecastService;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function forFarm(Request $request, Farm $farm, NasaPowerService $nasa)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403, 'You do not have access to this farm.');
        }

        if (! $farm->latitude || ! $farm->longitude) {
            return response()->json([
                'error' => 'Farm has no coordinates set.',
                'hint'  => 'Add latitude and longitude to this farm to enable NASA POWER data.',
            ], 422);
        }

        $weather = $nasa->dailyWeather(
            (float) $farm->latitude,
            (float) $farm->longitude,
            7,
        );

        return response()->json([
            'farm'   => [
                'id'        => $farm->id,
                'name'      => $farm->name,
                'latitude'  => $farm->latitude,
                'longitude' => $farm->longitude,
            ],
            'source' => 'NASA POWER (power.larc.nasa.gov)',
            'data'   => $weather,
        ]);
    }

    public function rainForecast(Request $request, Farm $farm, RainForecastService $forecast)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403, 'You do not have access to this farm.');
        }

        if (! $farm->latitude || ! $farm->longitude) {
            return response()->json([
                'error' => 'Farm has no coordinates set.',
                'hint'  => 'Add latitude and longitude to your farm to enable the rain forecast.',
            ], 422);
        }

        $data = $forecast->forecast(
            (float) $farm->latitude,
            (float) $farm->longitude,
            7,
        );

        return response()->json([
            'farm'   => [
                'id'        => $farm->id,
                'name'      => $farm->name,
                'latitude'  => $farm->latitude,
                'longitude' => $farm->longitude,
            ],
            'source' => 'Open-Meteo (open-meteo.com)',
            'data'   => $data,
        ]);
    }
}