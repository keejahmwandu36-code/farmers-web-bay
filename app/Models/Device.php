<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = ['field_id', 'device_uid', 'status', 'battery_level', 'signal_strength'];

    public function field()    { return $this->belongsTo(Field::class); }
    public function readings() { return $this->hasMany(SensorReading::class); }
}
