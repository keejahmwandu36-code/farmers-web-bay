<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    use HasFactory;

    protected $fillable = ['farm_id', 'name', 'crop', 'area', 'minimum_moisture'];

    public function farm()    { return $this->belongsTo(Farm::class); }
    public function devices() { return $this->hasMany(Device::class); }
    public function alerts()  { return $this->hasMany(Alert::class); }
}
