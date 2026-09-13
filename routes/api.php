<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SensorReadingController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::post('/sensor/readings', [SensorReadingController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::get('/fields/{field}/readings', [SensorReadingController::class, 'index']);
});