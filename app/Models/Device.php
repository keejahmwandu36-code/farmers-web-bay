<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'field_id',
        'device_uid',
        'api_key',
        'status',
        'battery_level',
        'signal_strength',
    ];

    protected $hidden = [
        'api_key',   // never expose device keys in API responses
    ];

    public function field()
    {
        return $this->belongsTo(Field::class);
    }

    public function readings()
    {
        return $this->hasMany(SensorReading::class);
    }
}