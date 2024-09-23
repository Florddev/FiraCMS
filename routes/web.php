<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\PluginController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\InstallController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/install', [InstallController::class, 'index'])->name('install.index');
Route::get('/install/initial-data', [InstallController::class, 'getInitialData']);
Route::post('/install', [InstallController::class, 'install']);


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::post('/change-locale', [LanguageController::class, 'changeLocale'])->name('change.locale');

Route::prefix('nexius-admin')->middleware('auth')->group(function () {

    Route::get('home', function () { echo "Page Home"; })->name("home");

    Route::auto('/users', UserController::class);

//    Route::resource('roles', RoleController::class);
//    Route::resource('permissions', PermissionController::class);
//
//    Route::get('/plugins', [PluginController::class, 'index'])->name('plugins.index');
//    Route::post('/plugins/{plugin}/toggle', [PluginController::class, 'toggle'])->name('plugins.toggle');
//    Route::get('/plugins/scan', [PluginController::class, 'scan'])->name('plugins.scan');
})->name("nexius-admin");

// dd(Route::getRoutes());

require __DIR__.'/auth.php';
