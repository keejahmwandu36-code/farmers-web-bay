<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Farm;
use App\Models\SensorReading;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard
     * Returns a snapshot of the authenticated farmer's farms, fields,
     * latest readings, device health, and recent alerts.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $farms = Farm::where('user_id', $user->id)
            ->with(['fields.devices', 'fields.alerts' => function ($q) {
                $q->where('status', 'new')->latest()->limit(5);
            }])
            ->get();

        // Attach the latest reading for each field
        $farms->each(function (Farm $farm) {
            $farm->fields->each(function ($field) {
                $latest = SensorReading::whereHas('device', function ($q) use ($field) {
                        $q->where('field_id', $field->id);
                    })
                    ->latest('recorded_at')
                    ->first();

                $field->setAttribute('latest_reading', $latest);
            });
        });

        $recentAlerts = Alert::whereHas('field.farm', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', 'new')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'farms'         => $farms,
            'recent_alerts' => $recentAlerts,
            'generated_at'  => now()->toIso8601String(),
        ]);
    }
}