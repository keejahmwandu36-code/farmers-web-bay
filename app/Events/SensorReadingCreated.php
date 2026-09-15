<?php

namespace App\Events;

use App\Models\SensorReading;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SensorReadingCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public SensorReading $reading)
    {
    }

    /**
     * Broadcast on a private channel scoped to the field's owner.
     */
    public function broadcastOn(): array
    {
        $userId = $this->reading->device->field->farm->user_id;

        return [
            new PrivateChannel('user.' . $userId),
        ];
    }

    /**
     * The payload React receives.
     */
    public function broadcastWith(): array
    {
        return [
            'id'            => $this->reading->id,
            'device_id'     => $this->reading->device_id,
            'field_id'      => $this->reading->device->field_id,
            'soil_moisture' => (float) $this->reading->soil_moisture,
            'temperature'   => (float) $this->reading->temperature,
            'humidity'      => (float) $this->reading->humidity,
            'battery_level' => $this->reading->battery_level,
            'recorded_at'   => $this->reading->recorded_at->toIso8601String(),
        ];
    }

    /**
     * Custom event name — leading dot keeps it namespaced.
     */
    public function broadcastAs(): string
    {
        return 'reading.created';
    }
}