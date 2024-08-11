<?php

use App\Http\Controllers\InstallController;
use App\Http\Controllers\MediaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::prefix('install')->group(function () {
    Route::get('/step/{step}', [InstallController::class, 'getStep']);
    Route::post('/step/{step}', [InstallController::class, 'postStep']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/translations/{locale}', function ($locale) {
    $translations = [];
    $path = __DIR__."/../lang/$locale";
    if (is_dir($path)) {
        $files = glob("$path/*.php");
        foreach ($files as $file) {
            $name = basename($file, '.php');
            $translations[$name] = require $file;
        }
    }
    return response()->json($translations);
});

Route::get('/medias', [MediaController::class, 'index']);
Route::post('/medias', [MediaController::class, 'store']);
Route::delete('/medias/{id}', [MediaController::class, 'destroy']);
Route::get('/media/{fileName}', [MediaController::class, 'media'])->name('media');
