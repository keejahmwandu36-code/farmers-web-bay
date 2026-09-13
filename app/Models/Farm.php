<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farm extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'location'];

    public function user()   { return $this->belongsTo(User::class); }
    public function fields() { return $this->hasMany(Field::class); }
}
