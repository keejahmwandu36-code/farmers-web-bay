<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Device;
use App\Models\SensorReading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SensorReadingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'device_uid'    => 'required|string',
            'api_key'       => 'required|string',
            'soil_moisture' => 'required|numeric|between:0,100',
            'temperature'   => 'required|numeric|between:-50,80',
            'humidity'      => 'required|numeric|between:0,100',
            'light'         => 'nullable|integer|min:0',
            'battery_level' => 'nullable|integer|between:0,100',
            'recorded_at'   => 'nullable|date',
        ]);

        $device = Device::where('device_uid', $data['device_uid'])->first();

        if (! $device || ! hash_equals($device->api_key ?? '', $data['api_key'])) {
            throw ValidationException::withMessages([
                'device_uid' => ['Invalid device credentials.'],
            ]);
        }

        $reading = DB::transaction(function () use ($device, $data) {
            $reading = $device->readings()->create([
                'soil_moisture' => $data['soil_moisture'],
                'temperature'   => $data['temperature'],
                'humidity'      => $data['humidity'],
                'light'         => $data['light'] ?? null,
                'battery_level' => $data['battery_level'] ?? null,
                'recorded_at'   => $data['recorded_at'] ?? now(),
            ]);

            $device->update([
                'status'        => 'online',
                'battery_level' => $data['battery_level'] ?? $device->battery_level,
            ]);

            $this->checkAlerts($device, $reading);

            return $reading;
        });

        return response()->json([
            'status'      => 'ok',
            'reading_id'  => $reading->id,
            'received_at' => now()->toIso8601String(),
        ], 201);
    }

    public function index(Request $request, $fieldId)
    {
        $readings = SensorReading::whereHas('device', function ($q) use ($fieldId) {
                $q->where('field_id', $fieldId);
            })
            ->orderByDesc('recorded_at')
            ->limit(100)
            ->get();

        return response()->json($readings);
    }

    protected function checkAlerts(Device $device, SensorReading $reading): void
    {
        $field = $device->field;

        if (! $field) {
            return;
        }

        if ($field->minimum_moisture !== null
            && $reading->soil_moisture < $field->minimum_moisture) {

            $recent = Alert::where('field_id', $field->id)
                ->where('type', 'low_moisture')
                ->where('status', 'new')
                ->where('created_at', '>=', now()->subHour())
                ->exists();

            if (! $recent) {
                Alert::create([
                    'field_id' => $field->id,
                    'type'     => 'low_moisture',
                    'severity' => 'high',
                    'message'  => "Soil moisture {$reading->soil_moisture}% is below the configured minimum of {$field->minimum_moisture}%.",
                    'status'   => 'new',
                ]);
            }
        }

        if ($reading->battery_level !== null && $reading->battery_level < 20) {
            $recent = Alert::where('field_id', $field->id)
                ->where('type', 'low_battery')
                ->where('status', 'new')
                ->where('created_at', '>=', now()->subHour())
                ->exists();

            if (! $recent) {
                Alert::create([
                    'field_id' => $field->id,
                    'type'     => 'low_battery',
                    'severity' => 'medium',
                    'message'  => "Device {$device->device_uid} battery at {$reading->battery_level}%.",
                    'status'   => 'new',
                ]);
            }
        }
    }
}