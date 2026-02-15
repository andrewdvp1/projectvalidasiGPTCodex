<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DocumentController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store'])->middleware('role:user');
    Route::get('/documents/{document}', [DocumentController::class, 'show']);

    Route::post('/documents/{document}/validate', [DocumentController::class, 'validateDocument'])
        ->middleware('role:validator,admin');

    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])
        ->middleware('role:admin');

    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'storeUser']);
        Route::patch('/users/{user}', [AdminController::class, 'updateUser']);
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
    });
});
