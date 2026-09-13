<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = ['field_id', 'type', 'message', 'severity', 'status'];

    public function field() { return $this->belongsTo(Field::class); }
}
